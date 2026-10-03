import sharp from "sharp";
import assert from "node:assert/strict";
import { readFile, writeFile, stat, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const sources = JSON.parse(
  await readFile("content/media-sources.json", "utf8"),
);
const manifest = JSON.parse(
  await readFile("content/generated-media.json", "utf8"),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const results = [];
for (const [id, source] of Object.entries(sources)) {
  const input = "public" + source.src;
  const bytes = await readFile(input);
  const baseline = execFileSync(process.env.QA_GIT_PATH || "git", [
    "show",
    (process.env.QA_SOURCE_REF || "HEAD") + ":" + input,
  ]);
  assert.equal(hash(bytes), hash(baseline), `${id}: original bytes preserved`);
  if (!source.usageApproved) {
    assert.ok(!manifest[id]);
    continue;
  }
  for (const variant of manifest[id].variants) {
    const info = await sharp("public" + variant.src).metadata();
    assert.equal(info.width, variant.width);
    assert.equal(info.height, variant.height);
    assert.ok(
      info.width <= source.width && info.height <= source.height,
      "No upscale",
    );
    assert.ok(
      Math.abs(info.height - (source.height * info.width) / source.width) <= 1,
      "Aspect ratio preserved",
    );
    assert.equal(info.exif, undefined, "Private EXIF stripped");
  }
  results.push({
    id,
    sha256: hash(bytes),
    variants: manifest[id].variants.length,
  });
}
const files = Object.values(manifest).flatMap((m) =>
  [...m.variants, ...Object.values(m.og || {})].map((v) => "public" + v.src),
);
const modified = await Promise.all(
  files.map((file) => stat(file).then((s) => s.mtimeMs)),
);
execFileSync(process.execPath, ["scripts/prepare-media.mjs"]);
assert.deepEqual(
  await Promise.all(files.map((file) => stat(file).then((s) => s.mtimeMs))),
  modified,
  "Unchanged image outputs are cached",
);
await mkdir("outputs", { recursive: true });
await writeFile(
  "outputs/media-check.json",
  JSON.stringify({ results, cached: true }, null, 2),
);
console.log(
  `Passed ${results.length} originals and their responsive variants.`,
);
