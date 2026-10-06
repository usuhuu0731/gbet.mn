import { chromium } from "playwright";
import { once } from "node:events";
import { mkdir } from "node:fs/promises";
import { createStaticServer } from "./serve-static.mjs";
import { basePath } from "./site-config.mjs";

const tag = process.env.QA_REPORT_TAG || "ui-after";
if (!/^[a-z0-9-]+$/.test(tag)) throw new Error("Invalid capture tag");
await mkdir(`outputs/${tag}`, { recursive: true });
const server = createStaticServer().listen(0, "127.0.0.1");
await once(server, "listening");
const browser = await chromium.launch({
  executablePath: process.env.QA_BROWSER_PATH,
});
let captured = 0;
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
      const shot = async (name, fullPage = false) => {
        await page.screenshot({
          path: `outputs/${tag}/${name}-${locale}-${width}.png`,
          fullPage,
        });
        captured++;
      };
      const elementShot = async (selector, name) => {
        const target = page.locator(selector);
        const box = await target.boundingBox();
        await page.setViewportSize({
          width,
          height: Math.max(height, Math.ceil(box.height + 160)),
        });
        await target.screenshot({
          path: `outputs/${tag}/${name}-${locale}-${width}.png`,
        });
        captured++;
        await page.setViewportSize({ width, height });
      };
      await page.goto(base);
      await ready();
      await shot("home");
      await elementShot(".digital-copy", "engineering");
      await page.evaluate(() => scrollTo(0, 0));
      await page
        .getByRole("button", {
          name: locale === "mn" ? "Цэс" : "Menu",
          exact: true,
        })
        .click();
      await shot("menu");
      await page.keyboard.press("Escape");
      await page.goto(base + "expertise/");
      await ready();
      await shot("services", true);
      await page.goto(base + "projects/ikh-tamir/");
      await ready();
      await shot("detail", true);
      await elementShot(".project-detail aside", "facts");
      await page.goto(base + "innovation/");
      await ready();
      await shot("innovation");
      await page.goto(base + "contact/");
      await ready();
      await shot("contact", true);
      await page.locator(".contact-form .button").click();
      await shot("contact-errors", true);
      await page.goto(base + "team/");
      await ready();
      await elementShot(".team-grid", "team");
      await page.close();
    }
  }
  console.log(`Captured ${captured} UI review images in outputs/${tag}/.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
