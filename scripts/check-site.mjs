import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { once } from "node:events";
import { createStaticServer } from "./serve-static.mjs";
import { basePath, origin } from "./site-config.mjs";

await mkdir("outputs", { recursive: true });
const sitemap = await readFile("site/sitemap.xml", "utf8");
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
assert.equal(routes.length, 36, "36 localized routes");
assert.equal(new Set(routes).size, 36);
assert.ok(
  routes.every((url) => url.startsWith(origin + "/") && url.endsWith("/")),
);
assert.equal(
  (await readFile("site/google9a26a91e934cf80c.html", "utf8")).trim(),
  "google-site-verification: google9a26a91e934cf80c.html",
);
const publicFiles = await readdir("site", { recursive: true });
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
  }
  await page.goto(base + "/en/projects/");
  const cards = async (count) => {
    await page.waitForFunction(
      (n) => document.querySelectorAll(".project-card").length === n,
      count,
    );
  };
  await cards(9);
  await page
    .getByRole("button", { name: "Rail infrastructure", exact: true })
    .click();
  await cards(2);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await cards(9);
  await page.getByLabel("Year", { exact: true }).selectOption("2013");
  await cards(1);
  await page
    .getByLabel("Location", { exact: true })
    .selectOption("Khan-Uul · Ulaanbaatar");
  await cards(0);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page
    .getByLabel("Status", { exact: true })
    .selectOption("Opened in 2021");
  await cards(2);
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
      await page.locator(".hero-photograph").evaluate((image) => {
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
