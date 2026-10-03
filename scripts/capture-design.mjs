import { chromium } from "playwright";
import { once } from "node:events";
import { mkdir } from "node:fs/promises";
import { createStaticServer } from "./serve-static.mjs";
import { basePath } from "./site-config.mjs";
const tag = process.env.QA_REPORT_TAG || "after";
if (!/^[a-z0-9-]+$/.test(tag)) throw Error("Invalid report tag");
await mkdir(`outputs/${tag}`, { recursive: true });
const server = createStaticServer().listen(0, "127.0.0.1");
await once(server, "listening");
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.QA_BROWSER_PATH,
});
try {
  for (const width of [390, 1440])
    for (const locale of ["mn", "en"]) {
      const page = await browser.newPage({
        viewport: { width, height: width === 390 ? 844 : 900 },
        reducedMotion: "reduce",
      });
      const base = `http://127.0.0.1:${server.address().port}${basePath}/${locale}/`;
      for (const [name, route] of [
        ["home", ""],
        ["detail", "projects/ikh-tamir/"],
        ["team", "team/"],
      ]) {
        await page.setViewportSize({
          width,
          height: width === 390 ? 844 : 900,
        });
        await page.goto(base + route, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        for (const image of await page.locator("main img").all()) {
          if (!(await image.isVisible())) continue;
          await image.scrollIntoViewIfNeeded();
          await image.evaluate((img) => img.decode());
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `outputs/${tag}/${name}-${locale}-${width}.png`,
          fullPage: name !== "home",
        });
        if (name === "home") {
          const feature = page.locator(".project-feature").first();
          const box = await feature.boundingBox();
          // Leave room for the fixed header so the entire facts row is painted.
          await page.setViewportSize({
            width,
            height: Math.max(
              width === 390 ? 844 : 900,
              Math.ceil(box.height + 200),
            ),
          });
          await feature.screenshot({
            path: `outputs/${tag}/feature-${locale}-${width}.png`,
          });
        }
        if (name === "team")
          await page
            .locator(".team-profile")
            .first()
            .screenshot({
              path: `outputs/${tag}/profile-${locale}-${width}.png`,
            });
      }
      await page.close();
    }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
