import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["app/[[]locale]/layout.tsx"],
    rules: { "@next/next/no-css-tags": "off" }, // Local font stylesheet avoids Vinext's unresolved CSS asset rebasing.
  },
  {
    files: [
      "components/chrome.tsx",
      "components/projects.tsx",
      "components/team.tsx",
      "app/[[]locale]/page.tsx",
      "app/[[]locale]/[[]page]/page.tsx",
    ],
    rules: { "@next/next/no-img-element": "off" }, // Local pre-sized assets; no external image optimizer in Sites.
  },
]);

export default eslintConfig;
