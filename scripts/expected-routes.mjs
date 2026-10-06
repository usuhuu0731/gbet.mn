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
function initializer(node, name) {
  return node.properties.find((p) => p.name?.getText(source) === name)
    ?.initializer;
}
function localized(node, name) {
  const value = initializer(node, name);
  if (!value) return undefined;
  assert.ok(
    ts.isCallExpression(value) && value.expression.getText(source) === "text",
  );
  assert.equal(value.arguments.length, 2);
  assert.ok(value.arguments.every(ts.isStringLiteral));
  return { mn: value.arguments[0].text, en: value.arguments[1].text };
}
export const serviceRecords = array("services").map((node) => {
  const links = initializer(node, "projectSlugs");
  if (links) {
    assert.ok(ts.isArrayLiteralExpression(links));
    assert.ok(links.elements.every(ts.isStringLiteral));
  }
  return {
    id: property(node, "id"),
    title: localized(node, "title"),
    copy: localized(node, "copy"),
    projectSlugs: links ? links.elements.map((n) => n.text) : [],
  };
});
assert.equal(
  new Set(serviceRecords.map((s) => s.id)).size,
  serviceRecords.length,
  "Unique service IDs",
);
for (const service of serviceRecords) {
  assert.match(service.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(
    service.title?.mn &&
      service.title?.en &&
      service.copy?.mn &&
      service.copy?.en,
  );
  assert.ok(
    service.projectSlugs.every((slug) => slugs.includes(slug)),
    "Services link to authored projects",
  );
}
export const projectFacts = projectNodes.map((node) => {
  const length = initializer(node, "length");
  if (length) assert.ok(ts.isStringLiteral(length));
  return {
    slug: property(node, "slug"),
    length: length?.text,
    bridgeType: localized(node, "bridgeType"),
  };
});
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
