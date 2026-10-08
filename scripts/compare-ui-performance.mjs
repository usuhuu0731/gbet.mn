import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const beforePath = process.argv[2] || "outputs/performance-ui-before.json";
const afterPath = process.argv[3] || "outputs/performance-ui-after.json";
const outputPath = process.argv[4] || "outputs/ui-performance-comparison.json";
const before = JSON.parse(await readFile(beforePath, "utf8"));
const after = JSON.parse(await readFile(afterPath, "utf8"));
for (const key of [
  "origin",
  "browser",
  "node",
  "cache",
  "desktop",
  "mobile",
  "interaction",
])
  assert.equal(after[key], before[key], `Comparable ${key}`);
const key = (row) => `${row.device}/${row.locale}/${row.route}`;
assert.deepEqual(
  after.summaries.map(key).sort(),
  before.summaries.map(key).sort(),
);
const comparisons = after.summaries.map((row) => {
  const old = before.summaries.find((candidate) => key(candidate) === key(row));
  assert.equal(row.runs, 5);
  assert.equal(old.runs, 5);
  assert.equal(row.LCP.samples, 5);
  assert.equal(old.LCP.samples, 5);
  return {
    case: key(row),
    before: old.LCP,
    after: row.LCP,
    lcpChangePercent: (row.LCP.median / old.LCP.median - 1) * 100,
    lcpRegressionGate: row.LCP.median <= old.LCP.median * 1.05,
    absoluteLcpTarget: row.LCP.median <= 2500,
    cls: row.CLS,
    clsGate: row.CLS.max <= 0.1,
    inp: row.INP,
    observedInpGate: row.INP ? row.INP.max <= 200 : null,
  };
});
const report = {
  beforePath,
  afterPath,
  comparisons,
  note: "Five-run local lab comparison; unavailable INP is null, not zero. Not field CWV or statistical significance.",
};
await writeFile(outputPath, JSON.stringify(report, null, 2));
assert.ok(
  comparisons.every((row) => row.lcpRegressionGate),
  "LCP regression exceeds 5%; see report",
);
assert.ok(
  comparisons.every((row) => row.clsGate),
  "CLS target exceeded",
);
assert.ok(
  comparisons.every((row) => row.observedInpGate !== false),
  "Sampled INP target exceeded",
);
console.log(
  `Passed the 5% LCP regression and measured CLS/INP gates in ${comparisons.length} cases. Missing INP samples remain unavailable.`,
);
