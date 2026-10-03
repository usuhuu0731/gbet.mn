# Static export compatibility — 2026-10-03

The visual redesign and team pages shipped first on the established Vinext beta.5 lockfile. This upgrade is a separate change and does not remove the export adapter or change hosting.

| Package | Design baseline | Compatibility candidate |
|---|---|---|
| vinext | 1.0.0-beta.5 | 1.0.1 |
| @vitejs/plugin-rsc | 0.5.26 | 0.5.34 |
| vite | 8.0.13 | 8.3.2 |
| next / eslint-config-next | 16.3.4 | 16.3.8 |
| react / react-dom / react-server-dom-webpack | 19.2.6 | 19.2.6 |

Installation used normal peer resolution and a committed lockfile. No force or legacy-peer-deps flags. Next/Vite patch updates address advisories found during the dependency review; they do not establish that every advisory is resolved. The candidate audit still reports 17 findings (2 low, 9 moderate, 6 high) across the installed dependency graph, including build tooling. Review these separately before introducing a server or changing the deployment model. GitHub Pages publishes static files only.

## Validation

Node 24.19.0 / local Chromium on Windows:

- ESLint and TypeScript passed.
- Custom-domain and repository-prefix production builds passed.
- `scripts/finalize-pages.mjs` retained. Both configurations passed all 36 localized routes, canonical/hreflang, CSS/images/fonts, locale switches, filtering, forms, keyboard, responsive widths, 200% text and 12 axe cases.
- The Google ownership file and private-file exclusions passed.
- Vendor build warnings about ineffective dynamic imports in Vinext error components remain; no runtime page errors were found in the tested routes.

Synthetic local performance used the same menu interaction, gzip static server, 390×844 viewport, 4× CPU slowdown and 150 ms / 1.6 Mbps network profile. These are individual laboratory observations, not field Core Web Vitals or statistically conclusive comparisons.

| Mobile measurement | Design baseline | Candidate |
|---|---:|---:|
| LCP | 2916 ms | 2924 ms |
| INP (menu interaction) | 32 ms | 40 ms |
| CLS | <0.001 | <0.001 |

The mobile LCP target of 2500 ms is not met. Desktop candidate LCP was 552 ms and CLS 0; INP did not produce a sample for its very short interaction, so the report stores null rather than zero. Browser output and screenshots are ignored local/CI artifacts in `outputs/`, never website assets.

## Migration and rollback

No database migration is needed. The adapter remains required for flat HTML conversion, trailing slashes and repository prefixes. A passing build alone is insufficient grounds to remove it. This validation applies to this static application, not universal Next.js/Vercel compatibility.

The prior deployed design merge is `454da055c7705c603478bcfabad96824b8adb9ec`. Revert the compatibility merge and run the same checks to restore its lockfile. The pre-redesign baseline is `31b2cd7a72dca12469d8b9052d790880e265e0c6`.
