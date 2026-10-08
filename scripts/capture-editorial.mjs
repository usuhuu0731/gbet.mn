import { chromium } from "playwright";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createStaticServer } from "./serve-static.mjs";
import { basePath } from "./site-config.mjs";

// The same selectors and camera positions work for the previous release and
// the editorial revision. QA_SITE_DIR selects a preserved baseline export.
const tag = process.env.QA_REPORT_TAG || "editorial-after";
if (!/^[a-z0-9-]+$/.test(tag)) throw new Error("Invalid capture tag");
const directory = `outputs/${tag}`;
await mkdir(directory, { recursive: true });
const server = createStaticServer().listen(0, "127.0.0.1");
await once(server, "listening");
const browser = await chromium.launch({
  ...(process.env.QA_BROWSER_PATH
    ? { executablePath: process.env.QA_BROWSER_PATH }
    : {}),
});
const captures = [];
try {
  for (const width of [390, 1440]) {
    const height = width === 390 ? 844 : 900;
    for (const locale of ["mn", "en"]) {
      const page = await browser.newPage({
        viewport: { width, height },
        reducedMotion: "reduce",
      });
      const base = `http://127.0.0.1:${server.address().port}${basePath}/${locale}/`;
      const ready = async () => {
        await page.evaluate(() => document.fonts.ready);
        for (const image of await page.locator("main img").all()) {
          if (!(await image.isVisible())) continue;
          await image.scrollIntoViewIfNeeded();
          await image.evaluate((img) => img.decode());
        }
        await page.evaluate(() => scrollTo(0, 0));
      };
      const record = (name) => {
        const path = `${directory}/${name}-${locale}-${width}.png`;
        captures.push({ name, locale, width, path });
        return path;
      };
      const shot = async (name, fullPage = false) => {
        await page.screenshot({ path: record(name), fullPage });
      };
      const elementShot = async (selector, name) => {
        const target = page.locator(selector).first();
        const box = await target.boundingBox();
        if (!box) throw new Error(`Missing capture target: ${selector}`);
        // Give the entire element paint space, including lazy images, without
        // changing the width that determines the responsive composition.
        await page.setViewportSize({
          width,
          height: Math.max(height, Math.ceil(box.height + 160)),
        });
        await target.screenshot({ path: record(name) });
        await page.setViewportSize({ width, height });
      };
      await page.goto(base);
      await ready();
      await shot("hero");
      await shot("home", true);
      await elementShot(".project-feature", "main-feature");
      await elementShot(".digital-design", "engineering");
      await elementShot(".timeline", "timeline");
      await page.goto(base + "projects/");
      await ready();
      await shot("archive", true);
      await elementShot(".photographic-project", "archive-feature");
      await page.goto(base + "projects/ongi-river/");
      await ready();
      await shot("detail-without-photo", true);
      await page.goto(base + "projects/ikh-tamir/");
      await ready();
      await shot("detail-with-photo", true);
      await page.goto(base + "innovation/");
      await ready();
      await shot("innovation", true);
      await page.goto(base + "about/");
      await ready();
      await shot("about", true);
      await page.goto(base + "contact/");
      await ready();
      await shot("contact", true);
      await page.goto(base + "team/");
      await ready();
      await elementShot(".team-grid", "team");
      await page.close();
    }
  }
  await writeFile(
    `${directory}/capture.json`,
    JSON.stringify(
      {
        tag,
        siteDirectory: resolve(process.env.QA_SITE_DIR || "site"),
        browser: browser.version(),
        reducedMotion: "reduce",
        count: captures.length,
        captures,
      },
      null,
      2,
    ),
  );
  console.log(
    `Captured ${captures.length} editorial review images in ${directory}/.`,
  );
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
