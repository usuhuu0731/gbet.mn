import { chromium } from "playwright";
import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";
import { createStaticServer } from "./serve-static.mjs";
import { basePath, origin } from "./site-config.mjs";

// A 1440x900 physical surface at 200% browser zoom has a 720x450 CSS viewport.
// This emulates its layout and pixel density, not the browser toolbar setting.
const viewport = { width: 720, height: 450 };
const server = createStaticServer().listen(0, "127.0.0.1");
await once(server, "listening");
const browser = await chromium.launch({
  executablePath: process.env.QA_BROWSER_PATH,
});
const tag = basePath ? "prefix" : "root";
const checks = [];
await mkdir("outputs", { recursive: true });
try {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  for (const locale of ["mn", "en"])
    for (const route of [
      "",
      "about/",
      "team/",
      "contact/",
      "expertise/",
      "innovation/",
      "projects/ikh-tamir/",
    ]) {
      await page.goto(
        `http://127.0.0.1:${server.address().port}${basePath}/${locale}/${route}`,
      );
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${locale}/${route} at emulated 200%`,
      );
      const heading = page.getByRole("heading", { level: 1 });
      await heading.scrollIntoViewIfNeeded();
      assert.ok(await heading.isVisible());
      await page
        .getByRole("button", {
          name: locale === "mn" ? "Цэс" : "Menu",
          exact: true,
        })
        .click();
      await page.locator("#expanded-menu a").last().scrollIntoViewIfNeeded();
      assert.ok(await page.locator("#expanded-menu a").last().isVisible());
      const menu = await page.locator("#expanded-menu").boundingBox();
      assert.ok(
        menu.y >= 0 && menu.y + menu.height <= viewport.height + 1,
        "Menu stays inside the viewport",
      );
      await page.keyboard.press("Escape");
      if (route === "expertise/") {
        await page
          .locator(".expertise-grid details")
          .nth(1)
          .locator("summary")
          .press("Enter");
        assert.equal(
          await page.locator(".expertise-grid details[open]").count(),
          2,
        );
      }
      if (route === "projects/ikh-tamir/") {
        await page.locator(".gallery-open").click();
        const box = await page.locator("dialog").boundingBox();
        assert.ok(
          box.x >= 0 &&
            box.y >= 0 &&
            box.width <= viewport.width &&
            box.height <= viewport.height + 1,
        );
        assert.ok(await page.locator(".dialog-close").isVisible());
        await page.keyboard.press("Escape");
      }
      await page.screenshot({
        path: `outputs/zoom-${tag}-${locale}-${route ? route.split("/")[0] : "home"}.png`,
      });
      checks.push({ locale, route, overflow: false });
    }
  await writeFile(
    `outputs/zoom-${tag}.json`,
    JSON.stringify(
      {
        origin,
        viewport,
        deviceScaleFactor: 2,
        method:
          "Emulated 200% layout/pixel density; native toolbar zoom not verified",
        checks,
      },
      null,
      2,
    ),
  );
  console.log(
    `Passed ${checks.length} emulated 200% layout/menu/dialog cases (${origin}).`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
