import { chromium } from "playwright";
import { once } from "node:events";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createStaticServer } from "./serve-static.mjs";
import { basePath } from "./site-config.mjs";
import assert from "node:assert/strict";
const vitalsSource = await readFile(
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
  for (const mobile of [false, true]) {
    // A binding preserves final visibilitychange measurements across navigation.
    const probe = await browser.newPage({
      viewport: mobile
        ? { width: 390, height: 844 }
        : { width: 1440, height: 900 },
    });
    probe.on("pageerror", (error) =>
      console.error("Performance probe:", String(error)),
    );
    const cd = await probe.context().newCDPSession(probe);
    if (mobile) {
      await cd.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cd.send("Network.enable");
      await cd.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 200000,
        uploadThroughput: 93750,
        connectionType: "cellular4g",
      });
    }
    const metrics = {};
    let lcpElement;
    await probe.exposeFunction("recordVital", (metric) => {
      metrics[metric.name] = metric.value;
      if (metric.name === "LCP") lcpElement = metric.element;
    });
    await probe.addInitScript({
      content:
        vitalsSource +
        "\n" +
        `for (const name of ['LCP','CLS','INP']) webVitals['on'+name](metric => window.recordVital({name,value:metric.value,element:metric.entries.at(-1)?.element?.tagName}),{reportAllChanges:true,durationThreshold:16});`,
    });
    await probe.goto(
      `http://127.0.0.1:${server.address().port}${basePath}/mn/`,
      { waitUntil: "networkidle" },
    );
    await probe.evaluate(() => document.fonts.ready);
    await probe.getByRole("button", { name: "Цэс", exact: true }).click();
    await probe.getByRole("button", { name: "Хаах", exact: true }).click();
    await probe.waitForTimeout(600);
    const resources = await probe.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((r) => ({
          name: r.name.split("/").at(-1),
          start: Math.round(r.startTime),
          end: Math.round(r.responseEnd),
          bytes: r.transferSize,
        }))
        .filter((r) => r.bytes > 0),
    );
    await probe.goto("about:blank");
    await probe.waitForTimeout(200);
    for (const name of ["LCP", "CLS"])
      assert.equal(
        typeof metrics[name],
        "number",
        `Missing ${name} measurement`,
      );
    results.push({
      device: mobile ? "mobile" : "desktop",
      cpuSlowdown: mobile ? 4 : 1,
      network: mobile
        ? "150ms latency; 1.6Mbps down / 0.75Mbps up"
        : "local loopback, unthrottled",
      ...metrics,
      INP: metrics.INP ?? null,
      lcpElement,
      resources,
    });
    await probe.close();
  }
  await mkdir("outputs", { recursive: true });
  const report = {
    environment: "Synthetic local Chromium; not field Core Web Vitals",
    interaction: "Open and close navigation menu",
    results,
  };
  await writeFile(
    "outputs/performance-lab.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
