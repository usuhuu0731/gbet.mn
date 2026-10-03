import sharp from "sharp";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
const sources = JSON.parse(
  await readFile("content/media-sources.json", "utf8"),
);
const output = path.resolve("public/generated");
const cacheDir = path.resolve(".cache/media");
await mkdir(output, { recursive: true });
await mkdir(cacheDir, { recursive: true });
const manifest = {};
const xml = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
for (const [id, item] of Object.entries(sources)) {
  if (!item.usageApproved) continue;
  try {
    if (!/^[a-z0-9-]+$/.test(id)) throw Error("Invalid media ID");
    if (!["photograph", "portrait", "rendering", "concept"].includes(item.kind))
      throw Error("Invalid kind");
    for (const locale of ["mn", "en"])
      if (!item.alt[locale] || !item.caption[locale])
        throw Error(`Missing ${locale} alt/caption`);
    const input = path.resolve("public", "." + item.src);
    if (!input.startsWith(path.resolve("public") + path.sep))
      throw Error("Source outside public");
    const bytes = await readFile(input);
    const meta = await sharp(bytes).metadata();
    const rotated = meta.orientation >= 5;
    const width = rotated ? meta.height : meta.width,
      height = rotated ? meta.width : meta.height;
    if (width !== item.width || height !== item.height)
      throw Error(
        `Registered ${item.width}x${item.height}; actual ${width}x${height}`,
      );
    const hash = createHash("sha256")
      .update(bytes)
      .update(JSON.stringify(item))
      .update(JSON.stringify(sharp.versions))
      .update("pipeline-v1")
      .digest("hex")
      .slice(0, 16);
    const cacheFile = path.join(cacheDir, `${id}-${hash}.json`);
    let cached;
    try {
      cached = JSON.parse(await readFile(cacheFile, "utf8"));
      await Promise.all(
        [...cached.variants, ...Object.values(cached.og || {})].map((v) =>
          access(path.join("public", v.src)),
        ),
      );
    } catch {
      cached = null;
    }
    if (cached) {
      manifest[id] = cached;
      continue;
    }
    const requested =
      item.kind === "portrait" ? [320, 480, 640] : [480, 768, 1024, 1440, 1920];
    const widths = [...new Set(requested.map((w) => Math.min(w, width)))].sort(
      (a, b) => a - b,
    );
    const variants = [];
    for (const w of widths) {
      const filename = `${id}-${hash}-${w}.webp`;
      const info = await sharp(bytes)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: item.quality, effort: 4 })
        .toFile(path.join(output, filename));
      variants.push({
        src: `/generated/${filename}`,
        width: info.width,
        height: info.height,
      });
    }
    const og = {};
    if (item.ogTitle)
      for (const locale of ["mn", "en"]) {
        const title = item.ogTitle[locale].split("\n");
        const overlay = Buffer.from(
          `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade" x2="0" y2="1"><stop offset="0" stop-color="#10202a" stop-opacity="0"/><stop offset="1" stop-color="#10202a" stop-opacity="0.96"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/><rect x="56" y="394" width="52" height="4" fill="#003dff"/><text x="56" y="446" font-family="Arial,sans-serif" font-size="20" fill="white" letter-spacing="3">GBET / CONSULTING ENGINEERS</text>${title.map((line, i) => `<text x="56" y="${513 + i * 54}" font-family="Arial,sans-serif" font-size="44" fill="white">${xml(line)}</text>`).join("")}</svg>`,
        );
        const filename = `og-${id}-${locale}-${hash}.jpg`;
        await sharp(bytes)
          .rotate()
          .resize({
            width: 1200,
            height: 630,
            fit: "cover",
            position: "centre",
            withoutEnlargement: true,
          })
          .composite([{ input: overlay }])
          .jpeg({ quality: 90 })
          .toFile(path.join(output, filename));
        og[locale] = {
          src: `/generated/${filename}`,
          width: 1200,
          height: 630,
        };
      }
    manifest[id] = { width, height, variants, og };
    await writeFile(cacheFile, JSON.stringify(manifest[id]));
  } catch (error) {
    throw Error(`Media ${id}: ${error.message}`, { cause: error });
  }
}
const json = JSON.stringify(manifest, null, 2) + "\n";
await writeFile("content/generated-media.json", json);
// This manifest contains public variant URLs and dimensions only.
await writeFile(path.join(output, "media-manifest.json"), json);
console.log(
  `Prepared ${Object.keys(manifest).length} approved assets (cached inputs skipped).`,
);
