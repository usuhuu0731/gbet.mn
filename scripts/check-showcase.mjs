import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { once } from "node:events";
import { createStaticServer } from "./serve-static.mjs";
import { basePath } from "./site-config.mjs";

const directory = "outputs/slideshow-review";
await mkdir(directory, { recursive: true });
const server = createStaticServer().listen(0, "127.0.0.1");
await once(server, "listening");
const base = `http://127.0.0.1:${server.address().port}${basePath}`;
const browser = await chromium.launch({
  executablePath: process.env.QA_BROWSER_PATH,
  headless: true,
});
const results = [], errors = [];
const slugs = ["ikh-tamir", "sonsgolon", "tavantolgoi-zuunbayan"];
async function active(page, slug) {
  await page.waitForFunction((value) => document.querySelector(".project-slideshow")?.dataset.activeProject === value, slug);
  assert.ok((await page.locator(".hero-image-caption").getAttribute("href")).endsWith(`/projects/${slug}/`));
}
async function reflow(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No horizontal overflow");
}
async function shot(page, selector, filename) {
  const element = page.locator(selector);
  const box = await element.boundingBox();
  const previous = page.viewportSize();
  await page.setViewportSize({ width: previous.width, height: Math.max(previous.height, Math.ceil(box.height + 160)) });
  await element.scrollIntoViewIfNeeded();
  for (const img of await element.locator("img:visible").all()) {
    await img.evaluate(image => { image.loading = "eager"; return image.decode(); });
  }
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  await element.screenshot({ path: `${directory}/${filename}.png` });
  await page.setViewportSize(previous);
}
try {
  for (const locale of ["mn", "en"]) {
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await noJS.newPage();
    await page.goto(`${base}/${locale}/`);
    assert.equal(await page.locator(".project-slideshow img").count(), 1, "One initial hero download");
    assert.equal(await page.locator(".hero-picture img").getAttribute("fetchpriority"), "high");
    assert.equal(await page.locator(".slideshow-controls").count(), 0);
    assert.equal(await page.locator(".team-selector-choice[href]").count(), 6);
    assert.ok(await page.locator(".team-selected-copy h3").isVisible());
    for (const anchor of await page.locator(".team-selector-choice[href]").all()) {
      const href = await anchor.getAttribute("href");
      assert.ok(href.startsWith(`${basePath}/${locale}/team/#`));
    }
    await reflow(page);
    results.push({ locale, noJS: true });
    await noJS.close();
  }
  for (const width of [320, 390, 1440]) for (const locale of ["mn", "en"]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(String(error)));
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/${locale}/`, { waitUntil: "load" });
    await page.locator(".slideshow-dots button").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator(".project-slideshow").getAttribute("data-playing"), "false");
    assert.equal(await page.locator(".slideshow-play").count(), 0, "Reduced motion has manual navigation only");
    for (let index = 0; index < slugs.length; index++) {
      const button = page.locator(".slideshow-dots button").nth(index);
      await button.press("Enter");
      await active(page, slugs[index]);
      assert.equal(await button.getAttribute("aria-pressed"), "true");
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
      if (index === 1) assert.ok(await page.locator(".slide-rendering-label").isVisible());
      await reflow(page);
    }
    await page.locator(".slideshow-dots button").first().press("Enter");
    await active(page, slugs[0]);
    await shot(page, ".image-hero", `after-hero-${locale}-${width}`);
    const choices = page.locator("button.team-selector-choice");
    assert.equal(await choices.count(), 6);
    for (let index = 0; index < 6; index++) {
      const choice = choices.nth(index);
      const name = await choice.locator(".team-selector-name").innerText();
      const role = await choice.locator(".team-selector-role").innerText();
      await choice.press(index % 2 ? "Space" : "Enter");
      assert.equal(await page.locator(".team-selected-copy h3").innerText(), name);
      assert.equal(await page.locator(".team-selected-role").innerText(), role);
      assert.equal(await choice.getAttribute("aria-pressed"), "true");
    }
    await choices.last().press("Home");
    assert.equal(await choices.first().getAttribute("aria-pressed"), "true");
    await shot(page, ".people-section", `after-team-${locale}-${width}`);
    await reflow(page);
    const axe = await new AxeBuilder({ page }).include(".image-hero").include(".people-section").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    results.push({ locale, width, violations: axe.violations });
    assert.deepEqual(axe.violations, [], JSON.stringify(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
    if (width === 390) {
      await page.evaluate(() => document.documentElement.style.fontSize = "200%");
      await page.evaluate(() => window.scrollTo(0, 0));
      await reflow(page);
      await shot(page, ".image-hero", `after-hero-zoom-${locale}`);
      await shot(page, ".people-section", `after-team-zoom-${locale}`);
    }
    await context.close();
  }
  const autoplay = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const page = await autoplay.newPage();
  await page.clock.install();
  await page.goto(`${base}/en/`, { waitUntil: "load" });
  await page.locator(".slideshow-play").waitFor();
  await page.mouse.move(0, 0);
  await page.waitForFunction(() => document.querySelector(".project-slideshow").dataset.playing === "true");
  await page.clock.runFor(7100);
  await active(page, "sonsgolon");
  await page.locator(".slideshow-dots button").last().press("Enter");
  await active(page, "tavantolgoi-zuunbayan");
  await page.clock.runFor(15000);
  await active(page, "tavantolgoi-zuunbayan");
  assert.equal(await page.locator(".project-slideshow").getAttribute("data-playing"), "false");
  await page.getByRole("button", { name: "Play slideshow", exact: true }).press("Enter");
  await page.mouse.move(0, 0);
  await page.clock.runFor(7100);
  await active(page, "ikh-tamir");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => document.querySelector(".project-slideshow").dataset.playing === "false");
  await page.clock.runFor(15000);
  await active(page, "ikh-tamir");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForFunction(() => !!document.querySelector(".slideshow-play"));
  await page.clock.runFor(15000);
  await active(page, "ikh-tamir");
  results.push({ autoplay: "advances; manual pauses; explicit resume; motion preference latches pause" });
  await autoplay.close();
  const failure = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const failedPage = await failure.newPage();
  await failedPage.route("**/generated/sonsgolon-*.webp", route => route.abort());
  await failedPage.goto(`${base}/en/`, { waitUntil: "load" });
  await failedPage.locator(".slideshow-dots button").nth(1).click();
  await failedPage.locator(".slideshow-error").waitFor();
  await active(failedPage, "ikh-tamir");
  await failedPage.unroute("**/generated/sonsgolon-*.webp");
  await failedPage.locator(".slideshow-dots button").nth(1).click();
  await active(failedPage, "sonsgolon");
  assert.equal(await failedPage.locator(".slideshow-error").count(), 0);
  results.push({ failureRecovery: "failed image preserves current slide; retry succeeds" });
  await failure.close();
  assert.deepEqual(errors, []);
  console.log("Showcase passed: no-JS, slideshow controls/autoplay, six team selections, responsive/reduced-motion/200% and scoped axe.");
} finally {
  await writeFile(`${directory}/review${basePath ? "-prefix" : ""}.json`, JSON.stringify({ results, errors }, null, 2));
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
