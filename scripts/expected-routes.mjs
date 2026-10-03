import ts from "typescript";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
// Inspect authored route/content definitions, independently of the exported sitemap.
const source = ts.createSourceFile(
  "site.ts",
  await readFile(new URL("../content/site.ts", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest,
  true,
);
function array(name) {
  let found;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name)
      found = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(
    found && ts.isArrayLiteralExpression(found),
    `Expected ${name} array`,
  );
  return found.elements;
}
function property(node, name) {
  const p = node.properties?.find((p) => p.name?.getText(source) === name);
  assert.ok(p && ts.isStringLiteral(p.initializer), `Missing ${name}`);
  return p.initializer.text;
}
export const locales = array("locales").map((n) => n.text);
export const pages = array("nav").map((n) => property(n, "path"));
const projectNodes = [...array("projects")];
function additions(node) {
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText(source) === "projects" &&
    ["push", "unshift"].includes(node.expression.name.text)
  ) {
    assert.ok(
      node.arguments.every(ts.isObjectLiteralExpression),
      "Project additions must be literal records",
    );
    projectNodes.push(...node.arguments);
  }
  ts.forEachChild(node, additions);
}
additions(source);
export const slugs = projectNodes.map((n) => property(n, "slug"));
export const expectedRoutes = locales
  .flatMap((locale) => [
    ...pages.map((p) => `/${locale}/${p ? p + "/" : ""}`),
    ...slugs.map((slug) => `/${locale}/projects/${slug}/`),
  ])
  .sort();
assert.equal(
  new Set(expectedRoutes).size,
  expectedRoutes.length,
  "Duplicate authored routes",
);
