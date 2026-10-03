import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { once } from "node:events";
import { createStaticServer } from "./serve-static.mjs";
import { basePath, origin } from "./site-config.mjs";
import { expectedRoutes, slugs } from "./expected-routes.mjs";

await mkdir("outputs", { recursive: true });
const sitemap = await readFile("site/sitemap.xml", "utf8");
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
assert.deepEqual(
  routes.map((url) => url.slice(origin.length)).sort(),
  expectedRoutes,
  "Exported routes match authored content",
);
assert.equal(new Set(routes).size, expectedRoutes.length);
assert.ok(
  routes.every((url) => url.startsWith(origin + "/") && url.endsWith("/")),
);
assert.equal(
  (await readFile("site/google9a26a91e934cf80c.html", "utf8")).trim(),
  "google-site-verification: google9a26a91e934cf80c.html",
);
const publicFiles = await readdir("site", { recursive: true });
const manifest = JSON.parse(
  await readFile("site/manifest.webmanifest", "utf8"),
);
assert.equal(manifest.start_url, `${basePath}/mn/`);
assert.equal(manifest.scope, `${basePath}/`);
assert.ok(manifest.icons.every((icon) => icon.src.startsWith(`${basePath}/`)));
assert.equal(
  (await readFile("site/robots.txt", "utf8")).trim(),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml`,
);
if (process.env.GBET_PUBLIC_ORIGIN)
  assert.equal(
    (await readFile("site/CNAME", "utf8")).trim(),
    new URL(origin).hostname,
  );
else
  assert.ok(
    !publicFiles.includes("CNAME"),
    "No custom-domain CNAME in prefix export",
  );
const forbidden =
  /611.?879.?400|846[.,]5|Founded in 1996|World Bank partner|staff-source|director-message-draft|gbet-review/;
for (const file of publicFiles.filter((file) =>
  /\.(html|js|json|rsc|map|txt|xml|webmanifest|css)$/i.test(file),
))
  assert.ok(
    !forbidden.test(await readFile("site/" + file, "utf8")),
    `No private/unapproved marker in ${file}`,
  );
assert.ok(
  !publicFiles.some((file) =>
    /gbet-review|staff-source|director-message-draft|bandi-reference|\.pdf$/i.test(
      file,
    ),
  ),
  "No private documents in artifact",
);
const server = process.env.QA_BASE_URL
  ? null
  : createStaticServer().listen(0, "127.0.0.1");
if (server) await once(server, "listening");
const base =
  process.env.QA_BASE_URL ||
  `http://127.0.0.1:${server.address().port}${basePath}`;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.QA_BROWSER_PATH
    ? { executablePath: process.env.QA_BROWSER_PATH }
    : {}),
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  // A visitor must not lose the first filter click while client code is loading.
  const delayedPage = await context.newPage();
  await delayedPage.route("**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
  await delayedPage.goto(base + "/en/projects/", { waitUntil: "commit" });
  const firstFilter = delayedPage.getByRole("button", {
    name: "Rail infrastructure",
    exact: true,
  });
  await firstFilter.waitFor({ state: "visible" });
  assert.equal(await firstFilter.isDisabled(), true);
  await firstFilter.click(); // Auto-waits until the control can handle the action.
  await delayedPage.waitForFunction(
    () => document.querySelectorAll(".project-card").length === 2,
  );
  await delayedPage.close();
  const page = await context.newPage();
  assert.equal(
    (await context.request.get(base + "/not-a-real-route/")).status(),
    404,
    "No SPA fallback",
  );
  const redirect = await context.request.get(
    base + "/en/projects?status=opened-2021",
    { maxRedirects: 0 },
  );
  assert.equal(redirect.status(), 301);
  assert.equal(
    redirect.headers().location,
    basePath + "/en/projects/?status=opened-2021",
  );
  const errors = [],
    failed = [],
    overflow = [],
    axe = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failed.push(`${response.status()} ${response.url()}`);
  });
  const leaked =
    /611.?879.?400|846[.,]5|Founded in 1996|World Bank partner|Монгол Улсын гүүрийн салбарын ирээдүйг бид/;
  const projectTitles = new Set();
  for (const url of routes) {
    const route = url.slice(origin.length);
    const response = await page.goto(base + route, {
      // External long-polling (including locally injected software) is not page readiness.
      // Assertions and locators below wait for the actual UI under test.
      waitUntil: "load",
    });
    assert.equal(response.status(), 200, route);
    const locale = route.split("/")[1];
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("h1").count(), 1, route);
    assert.equal(
      await page.locator("link[rel=canonical]").getAttribute("href"),
      url,
    );
    for (const language of ["mn", "en"])
      assert.equal(await page.locator(`link[hreflang=${language}]`).count(), 1);
    assert.ok(!leaked.test(await page.locator("body").innerText()), route);
    assert.equal(await page.locator("canvas").count(), 0);
    if (/\/projects\/[^/]+\/$/.test(route)) {
      const title = await page.title();
      assert.ok(!projectTitles.has(title), "Unique localized project title");
      projectTitles.add(title);
      const og = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");
      assert.ok(og.startsWith(origin + "/"), "OG uses selected origin");
      const image = await context.request.get(base + og.slice(origin.length));
      assert.equal(image.status(), 200, "Exported project OG asset exists");
      assert.match(image.headers()["content-type"], /^image\//);
    }
  }
  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  for (const locale of ["mn", "en"]) {
    const staticPage = await noJS.newPage();
    await staticPage.goto(`${base}/${locale}/`);
    assert.ok(await staticPage.locator("h1").isVisible());
    assert.equal(await staticPage.locator(".hero-actions a").count(), 2);
    assert.equal(
      await staticPage.locator(".hero-picture img").getAttribute("loading"),
      "eager",
    );
    assert.equal(
      await staticPage
        .locator(".hero-picture img")
        .getAttribute("fetchpriority"),
      "high",
    );
    await staticPage.goto(`${base}/${locale}/projects/`);
    assert.equal(
      await staticPage.locator(".project-card").count(),
      slugs.length,
    );
    await staticPage.close();
  }
  await noJS.close();
  await page.goto(base + "/en/projects/");
  const cards = async (count) => {
    await page.waitForFunction(
      (n) => document.querySelectorAll(".project-card").length === n,
      count,
    );
  };
  await cards(slugs.length);
  await page
    .getByRole("button", { name: "Rail infrastructure", exact: true })
    .click();
  await cards(2);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await cards(slugs.length);
  await page.getByLabel("Year", { exact: true }).selectOption("2013");
  await cards(1);
  await page.getByLabel("Location", { exact: true }).selectOption("khan-uul");
  await cards(0);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.getByLabel("Status", { exact: true }).selectOption("opened-2021");
  await cards(2);
  await page.reload();
  await cards(2);
  assert.ok(new URL(page.url()).searchParams.get("status") === "opened-2021");
  await page
    .locator(".language")
    .getByRole("link", { name: "MN", exact: true })
    .click();
  await page.waitForURL("**/mn/projects/?status=opened-2021");
  await cards(2);
  await page.getByRole("button", { name: "Цэвэрлэх", exact: true }).click();
  await cards(slugs.length);
  await page.goBack();
  await cards(2);
  await page.goForward();
  await cards(slugs.length);
  await page.goto(base + "/en/projects/?status=invalid&year=not-a-year");
  await cards(slugs.length);
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    origin + "/en/projects/",
  );
  await page.goto(base + "/en/projects/ikh-tamir/");
  const expand = page.getByRole("button", {
    name: "Expand image",
    exact: true,
  });
  await expand.click();
  assert.equal(await page.locator("dialog").evaluate((d) => d.open), true);
  const dialogAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  axe.push({
    width: 1440,
    locale: "en",
    route: "projects/ikh-tamir/dialog",
    violations: dialogAxe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  });
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((d) => d.open), false);
  await expand.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  assert.equal(
    await page.locator(":focus").textContent(),
    await expand.textContent(),
  );
  assert.equal(
    await page
      .locator(".detail-hero .project-image img")
      .getAttribute("loading"),
    "eager",
  );
  assert.equal(
    await page
      .locator(".detail-hero .project-image img")
      .getAttribute("fetchpriority"),
    "high",
  );
  assert.ok(
    (
      await page
        .locator(".detail-hero .project-image img")
        .getAttribute("srcset")
    ).includes("480w"),
  );
  assert.ok(
    (
      await page.locator('meta[property="og:image"]').getAttribute("content")
    ).includes("/generated/og-ikh-tamir-en-"),
  );
  assert.ok(
    !(await page.locator("main").innerText()).includes(
      "following internal review",
    ),
  );
  await page.goto(base + "/en/projects/ongi-river/");
  assert.equal(await page.locator(".detail-hero .awaiting-photo").count(), 1);
  assert.equal(
    await page
      .getByRole("button", { name: "Expand image", exact: true })
      .count(),
    0,
  );
  for (const route of ["team", "projects/ongi-river"]) {
    await page.goto(base + "/en/" + route + "/");
    await page
      .locator(".language")
      .getByRole("link", { name: "MN", exact: true })
      .click();
    await page.waitForURL("**/mn/" + route + "/");
  }
  await page.goto(base + "/");
  await page.waitForURL("**/mn/");
  for (const locale of ["mn", "en"]) {
    await page.goto(`${base}/${locale}/team/`);
    assert.equal(await page.locator(".team-profile").count(), 6);
    assert.equal(
      await page.locator(".team-portrait").count(),
      6,
      "Portrait slots remain present when approved photographs replace placeholders",
    );
    assert.match(await page.locator("main").innerText(), /Б\. Эрхэмбаяр/);
    assert.match(await page.locator("main").innerText(), /С\. Өсөхбаяр/);
    await page.goto(`${base}/${locale}/contact/`);
    await page.locator(".contact-form .button").click();
    assert.equal(await page.locator(".field-error").count(), 5);
    assert.equal(await page.locator(":focus").getAttribute("name"), "name");
  }
  await page.goto(base + "/en/contact/");
  await page.getByLabel("Email", { exact: true }).fill("invalid");
  await page.locator(".contact-form .button").click();
  assert.match(await page.locator("#email-error").innerText(), /valid email/);
  await page.getByLabel("Name", { exact: true }).fill("QA Test");
  await page.getByLabel("Organization", { exact: true }).fill("Local QA");
  await page.getByLabel("Email", { exact: true }).fill("qa@example.com");
  await page
    .getByLabel("Project type", { exact: true })
    .selectOption("Bridge design");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Local validation; no message is sent.");
  await page.locator(".contact-form .button").click();
  await page.waitForFunction(() =>
    document.querySelector(".form-status").textContent.includes("draft opens"),
  );
  assert.equal(await page.locator(".field-error").count(), 0);
  await page.goto(base + "/en/");
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").getAttribute("href"), "#main");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  assert.equal(
    await page.locator("#expanded-menu").getByRole("link").count(),
    9,
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#expanded-menu").count(), 0);
  assert.match(
    await page.locator(":focus").getAttribute("class"),
    /menu-button/,
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.locator("#expanded-menu a").last().focus();
  await page.keyboard.press("Tab");
  await page.waitForFunction(() => !document.querySelector("#expanded-menu"));
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const touch = await touchContext.newPage();
  await touch.goto(base + "/en/projects/ikh-tamir/");
  await touch.getByRole("button", { name: "Expand image", exact: true }).tap();
  assert.equal(await touch.locator("dialog").evaluate((d) => d.open), true);
  await touch.getByRole("button", { name: "Close", exact: true }).tap();
  for (const target of await touch
    .locator(".gallery-open,.menu-button,.language a")
    .all()) {
    const box = await target.boundingBox();
    assert.ok(box.width >= 44 && box.height >= 44, "44px touch control");
  }
  await touch.screenshot({ path: "outputs/gallery-touch.png" });
  await touchContext.close();
  const retinaContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const retina = await retinaContext.newPage();
  await retina.goto(base + "/mn/");
  await retina.evaluate(() => document.fonts.ready);
  const hero = retina.locator(".hero-picture img");
  await hero.evaluate((image) => image.decode());
  const selectedPath = await hero.evaluate(
    (image) => new URL(image.currentSrc).pathname,
  );
  const preparedMedia = JSON.parse(
    await readFile("site/generated/media-manifest.json", "utf8"),
  );
  const selectedVariant = preparedMedia["ikh-tamir"].variants.find(
    (variant) => basePath + variant.src === selectedPath,
  );
  // naturalWidth is density-corrected for srcset; verify the actual file pixels.
  assert.ok(
    selectedVariant && selectedVariant.width >= 780,
    "High-DPR hero uses an adequate responsive variant",
  );
  assert.ok(
    await retina
      .locator(".project-image img")
      .first()
      .evaluate(
        (image) =>
          parseFloat(getComputedStyle(image).transitionDuration) <= 0.001,
      ),
    "Reduced motion disables image transition",
  );
  await retina.screenshot({ path: "outputs/hero-mn-dpr2.png" });
  await retinaContext.close();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["mn", "en"])
      for (const route of [
        "",
        "team",
        "about",
        "projects",
        "projects/sonsgolon",
        "contact",
      ]) {
        await page.goto(`${base}/${locale}/${route ? route + "/" : ""}`);
        if (
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          overflow.push(`${width}/${locale}/${route}`);
        if (
          [390, 1440].includes(width) &&
          ["", "team", "contact"].includes(route)
        ) {
          const result = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
          axe.push({
            width,
            locale,
            route,
            violations: result.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
          });
        }
      }
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const locale of ["mn", "en"]) {
      await page.goto(`${base}/${locale}/`, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.locator(".hero-picture img").evaluate((image) => {
        if (image.complete && image.naturalWidth) return;
        return new Promise((resolve, reject) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", reject, { once: true });
        });
      });
      await page.screenshot({ path: `outputs/refresh-${locale}-${width}.png` });
      await page.locator(".project-feature").first().scrollIntoViewIfNeeded();
      await page
        .locator(".project-feature img")
        .first()
        .evaluate((image) => {
          if (image.complete && image.naturalWidth) return;
          return new Promise((resolve, reject) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", reject, { once: true });
          });
        });
      await page
        .locator(".project-feature")
        .first()
        .screenshot({ path: `outputs/project-${locale}-${width}.png` });
      await page.goto(`${base}/${locale}/team/`, { waitUntil: "load" });
      // Full-page captures must include lazy portraits below the initial viewport.
      for (const portrait of await page.locator(".team-portrait img").all()) {
        await portrait.scrollIntoViewIfNeeded();
        await portrait.evaluate((image) => image.decode());
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `outputs/team-${locale}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["", "team", "contact"]) {
    await page.goto(`${base}/mn/${route ? route + "/" : ""}`);
    await page.evaluate(
      () => (document.documentElement.style.fontSize = "200%"),
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `200% ${route}`,
    );
  }
  await writeFile(
    "outputs/site-check.json",
    JSON.stringify(
      {
        routes: routes.length,
        origin,
        overflow,
        axe,
        errors,
        failed,
        forms: "validated; mailto draft only",
      },
      null,
      2,
    ),
  );
  assert.deepEqual(overflow, []);
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  assert.ok(
    axe.every((result) => !result.violations.length),
    "Accessibility violations: see outputs/site-check.json",
  );
  console.log(
    `Passed ${routes.length} routes, locale switches, filters, team, forms, keyboard, reduced motion, responsive/200% checks and ${axe.length} axe cases.`,
  );
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}
