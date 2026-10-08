import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { once } from "node:events";
import { createStaticServer } from "./serve-static.mjs";
import { basePath, origin } from "./site-config.mjs";
import {
  expectedRoutes,
  slugs,
  serviceRecords,
  projectFacts,
} from "./expected-routes.mjs";

await mkdir("outputs", { recursive: true });
const mediaSources = JSON.parse(
  await readFile("content/media-sources.json", "utf8"),
);
const illustratedProjects = slugs.filter(
  (slug) => mediaSources[slug]?.usageApproved,
);
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
      const project = projectFacts.find((p) => route.endsWith(`/${p.slug}/`));
      const highlights = [project.length, project.bridgeType?.[locale]].filter(
        Boolean,
      );
      assert.equal(
        await page.locator(".facts-highlights").count(),
        highlights.length ? 1 : 0,
        "No empty highlights rail",
      );
      assert.deepEqual(
        await page.locator(".facts-highlights dd").allTextContents(),
        highlights,
      );
      const definitions = await page
        .locator(".project-detail aside dt")
        .allTextContents();
      assert.equal(
        definitions.filter((t) => t === (locale === "mn" ? "Урт" : "Length"))
          .length,
        project.length ? 1 : 0,
      );
      assert.equal(
        definitions.filter(
          (t) => t === (locale === "mn" ? "Бүтцийн төрөл" : "Structure type"),
        ).length,
        project.bridgeType ? 1 : 0,
      );
      assert.equal(
        await page.locator(".detail-hero").count(),
        illustratedProjects.includes(project.slug) ? 1 : 0,
        "Only projects with approved imagery have a large image hero",
      );
      if (!illustratedProjects.includes(project.slug)) {
        assert.equal(await page.locator(".detail-without-image").count(), 1);
        assert.equal(await page.locator(".detail-photo-note").count(), 1);
        assert.equal(await page.locator(".awaiting-photo").count(), 0);
        assert.ok(await page.locator(".project-detail aside").isVisible());
      }
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
    assert.equal(
      await staticPage.locator(".selected-work .project-feature").count(),
      1,
      "Homepage has one focused case study",
    );
    assert.ok(
      (
        await staticPage
          .locator(".selected-work .feature-image-link")
          .getAttribute("href")
      ).endsWith("/projects/sonsgolon/"),
    );
    for (const slug of illustratedProjects) {
      assert.equal(
        await staticPage
          .locator("main img")
          .evaluateAll(
            (images, alt) => images.filter((img) => img.alt === alt).length,
            mediaSources[slug].alt[locale],
          ),
        1,
        `The ${slug} project image appears once on the homepage`,
      );
    }
    const mobileHero = await staticPage.locator(".hero-visual").boundingBox();
    const mobileCopy = await staticPage
      .locator(".hero-editorial")
      .boundingBox();
    assert.ok(Math.abs(mobileHero.width / mobileHero.height - 4 / 3) < 0.02);
    assert.ok(mobileCopy.y >= mobileHero.y + mobileHero.height - 1);
    await staticPage.goto(`${base}/${locale}/projects/`);
    assert.equal(
      await staticPage.locator(".project-card").count(),
      slugs.length,
    );
    assert.equal(
      await staticPage.locator(".photographic-project").count(),
      illustratedProjects.length,
    );
    assert.equal(
      await staticPage.locator(".textual-project .project-image").count(),
      0,
      "Project register has no empty image cards",
    );
    assert.equal(
      await staticPage.locator(".project-register-number").count(),
      slugs.length - illustratedProjects.length,
    );
    assert.equal(
      await staticPage.locator(".project-register-note").count(),
      slugs.length - illustratedProjects.length,
    );
    await staticPage.goto(`${base}/${locale}/innovation/`);
    const staticScheme = staticPage.locator(".bridge-schematic");
    assert.equal(await staticScheme.count(), 1);
    assert.equal(await staticScheme.locator("svg").count(), 1);
    assert.equal(await staticScheme.locator("canvas").count(), 0);
    assert.match(
      await staticScheme.locator("figcaption").innerText(),
      locale === "mn"
        ? /ерөнхий схем.*тодорхой төслийн/s
        : /general explanatory diagram.*specific GBET project/s,
      "The illustration is explicitly distinguished from project geometry",
    );
    assert.equal(
      await staticScheme.locator("[data-bridge-control]").count(),
      3,
    );
    for (const control of await staticScheme
      .locator("[data-bridge-control]")
      .all()) {
      const descriptionId = await control.getAttribute("aria-describedby");
      assert.ok(descriptionId, "Each part has an associated explanation");
      const description = staticScheme.locator(`[id="${descriptionId}"]`);
      assert.ok(
        await description.isVisible(),
        "All explanations are readable without JS",
      );
      assert.ok((await description.innerText()).trim().length > 20);
    }
    for (const route of ["", "expertise/"]) {
      await staticPage.goto(`${base}/${locale}/${route}`);
      const details = staticPage.locator(".expertise-grid details");
      assert.equal(await details.count(), serviceRecords.length);
      assert.equal(
        await staticPage.locator(".expertise-grid details[open]").count(),
        1,
      );
      for (const service of serviceRecords) {
        const item = staticPage.locator(`#service-${service.id}`);
        assert.ok(
          (await item.locator("summary").innerText()).includes(
            service.title[locale],
          ),
        );
        assert.equal(
          await item.locator(".service-panel p").textContent(),
          service.copy[locale],
          "Approved copy is present without JS",
        );
        const links = await item
          .locator(".service-projects a")
          .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
        assert.deepEqual(
          links,
          service.projectSlugs.map(
            (slug) => `${basePath}/${locale}/projects/${slug}/`,
          ),
        );
      }
      const first = details.nth(0),
        second = details.nth(1);
      await first.locator("summary").press("Enter");
      assert.equal(await first.getAttribute("open"), null);
      await second.locator("summary").press("Space");
      assert.equal(await second.locator(".service-panel").isVisible(), true);
      await first.locator("summary").press("Space");
      assert.equal(
        await staticPage.locator(".expertise-grid details[open]").count(),
        2,
        "Multiple native rows stay open",
      );
    }
    await staticPage.close();
  }
  await noJS.close();
  await page.goto(base + "/en/projects/");
  const archiveOrder = await page
    .locator(".project-card > a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  assert.equal(new Set(archiveOrder).size, slugs.length);
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
  assert.deepEqual(
    await page
      .locator(".project-card > a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    archiveOrder.map((href) => href.replace("/en/", "/mn/")),
    "Reset and history restore the same authored project order",
  );
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
  assert.equal(await page.locator(".detail-hero").count(), 0);
  assert.equal(await page.locator(".detail-photo-note").count(), 1);
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
    assert.equal(
      await page.locator(".form-status").getAttribute("data-feedback"),
      "error",
    );
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
  assert.equal(
    await page.locator(".form-status").getAttribute("data-feedback"),
    "info",
    "Draft is information, not delivery success",
  );
  await page.goto(base + "/en/");
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").getAttribute("href"), "#main");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  assert.equal(
    await page.locator("#expanded-menu").getByRole("link").count(),
    9,
  );
  assert.equal(
    await page
      .locator('#expanded-menu a[aria-current="page"]')
      .getAttribute("href"),
    `${basePath}/en/`,
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
        "projects/ikh-tamir",
        "projects/ongi-river",
        "expertise",
        "innovation",
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
          [
            "",
            "team",
            "contact",
            "expertise",
            "innovation",
            "projects/ikh-tamir",
            "projects",
            "projects/ongi-river",
          ].includes(route)
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
        if (["", "expertise"].includes(route)) {
          for (const target of await page
            .locator(".expertise-grid summary")
            .all()) {
            const box = await target.boundingBox();
            assert.ok(box.width >= 44 && box.height >= 44);
          }
        }
        if (["", "about"].includes(route) && width <= 390) {
          const timeline = await page
            .locator(".timeline article")
            .evaluateAll((articles) =>
              articles.map((article) => {
                const year = article.querySelector("span");
                const title = article.querySelector("h3");
                const range = document.createRange();
                range.selectNodeContents(year);
                const text = range.getBoundingClientRect();
                const box = year.getBoundingClientRect();
                return {
                  year: year.textContent,
                  singleLine: range.getClientRects().length === 1,
                  fits: text.width <= box.width + 1,
                  aboveTitle:
                    box.bottom <= title.getBoundingClientRect().top + 1,
                };
              }),
            );
          assert.ok(timeline.length > 0);
          assert.ok(
            timeline.every(
              (item) => item.singleLine && item.fits && item.aboveTitle,
            ),
            `Mobile timeline years are intact above their titles: ${JSON.stringify(timeline)}`,
          );
        }
        if (route === "projects") {
          const images = page.locator(".photographic-project");
          const [first, second, third] = await Promise.all(
            [0, 1, 2].map((index) => images.nth(index).boundingBox()),
          );
          if (width >= 768) {
            assert.ok(
              first.width > second.width * 1.8,
              "First image leads the archive",
            );
            assert.ok(
              Math.abs(second.y - third.y) <= 1,
              "Next two images share a row",
            );
            assert.ok(second.x + second.width <= third.x + 1);
          } else {
            assert.ok(second.y >= first.y + first.height - 1);
            assert.ok(third.y >= second.y + second.height - 1);
          }
          assert.equal(
            await page.locator(".textual-project .project-image").count(),
            0,
          );
        }
        if (route === "innovation") {
          const scheme = page.locator(".bridge-schematic");
          await page.waitForFunction(() =>
            [...document.querySelectorAll("[data-bridge-control]")].every(
              (button) => !button.disabled,
            ),
          );
          for (const part of ["piers", "foundations", "deck"]) {
            const control = scheme.locator(`[data-bridge-control="${part}"]`);
            await control.press(part === "foundations" ? "Space" : "Enter");
            await page.waitForFunction(
              (selected) =>
                document
                  .querySelector(`[data-bridge-control="${selected}"]`)
                  .getAttribute("aria-pressed") === "true",
              part,
            );
            assert.equal(await control.getAttribute("aria-pressed"), "true");
            assert.equal(
              await scheme
                .locator('[data-bridge-control][aria-pressed="true"]')
                .count(),
              1,
            );
            assert.equal(
              await scheme
                .locator(`[data-bridge-part="${part}"]`)
                .getAttribute("data-active"),
              "true",
            );
            const box = await control.boundingBox();
            assert.ok(
              box.width >= 44 && box.height >= 44,
              "44px schematic control",
            );
          }
          assert.ok(
            await scheme
              .locator(".bridge-block polygon, [data-bridge-control]")
              .evaluateAll((parts) =>
                parts.every((part) =>
                  getComputedStyle(part)
                    .transitionDuration.split(",")
                    .every((duration) => parseFloat(duration) <= 0.001),
                ),
              ),
            "Reduced motion disables schematic transitions",
          );
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
  for (const locale of ["mn", "en"])
    for (const route of [
      "",
      "team",
      "contact",
      "expertise",
      "innovation",
      "projects",
      "projects/ikh-tamir",
      "projects/ongi-river",
    ]) {
      await page.goto(`${base}/${locale}/${route ? route + "/" : ""}`);
      await page.evaluate(
        () => (document.documentElement.style.fontSize = "200%"),
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `200% ${locale}/${route}`,
      );
    }
  const desktopNavigationChecks = [];
  for (const locale of ["mn", "en"])
    for (const test of [
      { width: 1279, textZoom: false, visible: false },
      { width: 1280, textZoom: false, visible: true },
      { width: 1440, textZoom: false, visible: true },
      { width: 1440, textZoom: true, visible: false },
    ]) {
      await page.setViewportSize({ width: test.width, height: 900 });
      await page.goto(`${base}/${locale}/expertise/`);
      await page.evaluate(() => document.fonts.ready);
      if (test.textZoom)
        await page.evaluate(
          () => (document.documentElement.style.fontSize = "200%"),
        );
      await page.waitForFunction((visible) => {
        const navigation = document.querySelector(".desktop-nav");
        const style = getComputedStyle(navigation);
        return (
          (style.display !== "none" && style.visibility !== "hidden") ===
          visible
        );
      }, test.visible);
      const navigation = page.locator(".desktop-nav");
      assert.deepEqual(
        await navigation
          .locator("a")
          .evaluateAll((links) =>
            links.map((link) => link.getAttribute("href")),
          ),
        ["projects", "expertise", "about"].map(
          (path) => `${basePath}/${locale}/${path}/`,
        ),
      );
      if (test.visible) {
        const [brand, navBox, actions] = await Promise.all(
          [".brand", ".desktop-nav", ".header-actions"].map((selector) =>
            page.locator(selector).boundingBox(),
          ),
        );
        assert.ok(brand.x + brand.width <= navBox.x + 1);
        assert.ok(navBox.x + navBox.width <= actions.x + 1);
        assert.equal(
          await navigation
            .locator('[aria-current="page"]')
            .getAttribute("href"),
          `${basePath}/${locale}/expertise/`,
        );
        await navigation.locator("a").first().focus();
        assert.equal(
          await page.locator(":focus").getAttribute("href"),
          `${basePath}/${locale}/projects/`,
        );
      }
      desktopNavigationChecks.push({ locale, ...test });
    }
  const menuChecks = [];
  for (const locale of ["mn", "en"])
    for (const test of [
      { width: 320, height: 568, textZoom: false },
      { width: 390, height: 844, textZoom: true },
      { width: 768, height: 900, textZoom: false },
      { width: 1023, height: 900, textZoom: false },
      { width: 1024, height: 900, textZoom: false },
      { width: 1280, height: 900, textZoom: false },
      { width: 1440, height: 900, textZoom: true },
    ]) {
      await page.setViewportSize({ width: test.width, height: test.height });
      await page.goto(`${base}/${locale}/expertise/`);
      await page.evaluate(() => document.fonts.ready);
      if (test.textZoom)
        await page.evaluate(
          () => (document.documentElement.style.fontSize = "200%"),
        );
      await page
        .getByRole("button", {
          name: locale === "mn" ? "Цэс" : "Menu",
          exact: true,
        })
        .click();
      const menu = page.locator("#expanded-menu");
      await page.waitForFunction(() => {
        const box = document
          .querySelector("#expanded-menu")
          .getBoundingClientRect();
        return box.bottom <= innerHeight + 1;
      });
      const columns = await menu.evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
      );
      assert.equal(columns, test.width <= 767 ? 1 : test.width <= 1023 ? 2 : 3);
      await menu.locator("a").last().focus();
      const last = await menu.locator("a").last().boundingBox();
      assert.ok(
        last.y >= 0 && last.y + last.height <= test.height + 1,
        "Last menu link is fully reachable",
      );
      assert.equal(
        await menu.locator('a[aria-current="page"]').getAttribute("href"),
        `${basePath}/${locale}/expertise/`,
      );
      await page.keyboard.press("Escape");
      assert.equal(await menu.count(), 0);
      menuChecks.push({ locale, ...test, columns });
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
        menuChecks,
        desktopNavigationChecks,
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
