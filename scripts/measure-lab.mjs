import { chromium } from "playwright";
import { once } from "node:events";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createStaticServer } from "./serve-static.mjs";
import { basePath, origin } from "./site-config.mjs";
import assert from "node:assert/strict";

const runs = Number(process.env.QA_LAB_RUNS || 5);
assert.ok(Number.isInteger(runs) && runs > 0);
const tag = process.env.QA_REPORT_TAG || "after";
assert.match(tag, /^[a-z0-9-]+$/);
const interaction = process.env.QA_LAB_INTERACTION || "menu";
assert.ok(["menu", "accordion"].includes(interaction));
const measuredRoutes =
  interaction === "accordion" ? ["expertise/"] : ["", "projects/ikh-tamir/"];
const vitals = await readFile(
  new URL(
    "../node_modules/web-vitals/dist/web-vitals.iife.js",
    import.meta.url,
  ),
  "utf8",
);
const server = createStaticServer().listen(0, "127.0.0.1");
await once(server, "listening");
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.QA_BROWSER_PATH,
});
const results = [];
try {
  for (const mobile of [false, true])
    for (const locale of ["mn", "en"])
      for (const route of measuredRoutes) {
        for (let run = 1; run <= runs; run++) {
          // Fresh contexts and a disabled HTTP cache make before/after runs comparable.
          const context = await browser.newContext({
            viewport: mobile
              ? { width: 390, height: 844 }
              : { width: 1440, height: 900 },
            reducedMotion: "reduce",
          });
          const page = await context.newPage();
          const cd = await context.newCDPSession(page);
          await cd.send("Network.enable");
          await cd.send("Network.setCacheDisabled", { cacheDisabled: true });
          if (mobile) {
            await cd.send("Emulation.setCPUThrottlingRate", { rate: 4 });
            await cd.send("Network.emulateNetworkConditions", {
              offline: false,
              latency: 150,
              downloadThroughput: 200000,
              uploadThroughput: 93750,
              connectionType: "cellular4g",
            });
          }
          const metrics = {},
            errors = [];
          let lcpElement = null;
          page.on("pageerror", (error) => errors.push(String(error)));
          await page.exposeFunction("recordVital", (metric) => {
            metrics[metric.name] = metric.value;
            if (metric.name === "LCP") lcpElement = metric.element;
          });
          await page.addInitScript({
            content:
              vitals +
              "\n" +
              `for(const name of ['LCP','CLS','INP']) webVitals['on'+name](metric=>window.recordVital({name,value:metric.value,element:metric.entries.at(-1)?.element?.tagName}),{reportAllChanges:true,durationThreshold:16});`,
          });
          await page.goto(
            `http://127.0.0.1:${server.address().port}${basePath}/${locale}/${route}`,
            { waitUntil: "networkidle" },
          );
          await page.evaluate(() => document.fonts.ready);
          if (interaction === "accordion") {
            const row = page.locator("#service-bridge-rehabilitation summary");
            await row.click();
            await row.click();
          } else {
            await page
              .getByRole("button", {
                name: locale === "mn" ? "Цэс" : "Menu",
                exact: true,
              })
              .click();
            await page
              .getByRole("button", {
                name: locale === "mn" ? "Хаах" : "Close",
                exact: true,
              })
              .click();
          }
          await page.waitForTimeout(600);
          const resources = await page.evaluate(() =>
            performance
              .getEntriesByType("resource")
              .map((r) => ({
                name: new URL(r.name).pathname,
                start: Math.round(r.startTime),
                end: Math.round(r.responseEnd),
                bytes: r.transferSize,
              }))
              .filter((r) => r.bytes > 0),
          );
          await page.goto("about:blank");
          await page.waitForTimeout(200);
          for (const name of ["LCP", "CLS"])
            assert.equal(typeof metrics[name], "number", `Missing ${name}`);
          assert.deepEqual(errors, []);
          results.push({
            device: mobile ? "mobile" : "desktop",
            locale,
            route: route || "home",
            run,
            ...metrics,
            INP: metrics.INP ?? null,
            lcpElement,
            resources,
          });
          console.log(
            `${tag} ${mobile ? "mobile" : "desktop"}/${locale}/${route || "home"} ${run}/${runs}: LCP ${Math.round(metrics.LCP)} ms`,
          );
          await context.close();
        }
      }
  const summaries = [];
  for (const device of ["desktop", "mobile"])
    for (const locale of ["mn", "en"])
      for (const route of measuredRoutes.map((route) => route || "home")) {
        const group = results.filter(
          (r) =>
            r.device === device && r.locale === locale && r.route === route,
        );
        const summary = { device, locale, route, runs: group.length };
        for (const name of ["LCP", "CLS", "INP"]) {
          const values = group
            .map((r) => r[name])
            .filter((v) => v !== null)
            .sort((a, b) => a - b);
          const n = values.length;
          summary[name] = n
            ? {
                median:
                  n % 2
                    ? values[(n - 1) / 2]
                    : (values[n / 2 - 1] + values[n / 2]) / 2,
                min: values[0],
                max: values[n - 1],
                samples: n,
              }
            : null;
        }
        summaries.push(summary);
      }
  await mkdir("outputs", { recursive: true });
  await writeFile(
    `outputs/performance-${tag}.json`,
    JSON.stringify(
      {
        tag,
        origin,
        date: new Date().toISOString(),
        browser: browser.version(),
        node: process.version,
        environment: "Synthetic local Chromium; not field Core Web Vitals",
        cache: "Fresh context and disabled cache per run",
        desktop: "1440x900; loopback; unthrottled",
        mobile: "390x844; 4x CPU; 150ms latency; 1.6Mbps down / 0.75Mbps up",
        interaction:
          interaction === "accordion"
            ? "Open and close native bridge rehabilitation disclosure after fonts and network settle"
            : "Open and close navigation menu after fonts and network settle",
        results,
        summaries,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
