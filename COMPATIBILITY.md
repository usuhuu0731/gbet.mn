# Static export compatibility — 2026-10-03

The visual redesign and team pages shipped first on the established Vinext beta.5 lockfile. This upgrade is a separate change and does not remove the export adapter or change hosting.

| Package                                      | Design baseline | Compatibility candidate |
| -------------------------------------------- | --------------- | ----------------------- |
| vinext                                       | 1.0.0-beta.5    | 1.0.1                   |
| @vitejs/plugin-rsc                           | 0.5.26          | 0.5.34                  |
| vite                                         | 8.0.13          | 8.3.2                   |
| next / eslint-config-next                    | 16.3.4          | 16.3.8                  |
| react / react-dom / react-server-dom-webpack | 19.2.6          | 19.2.6                  |

Installation used normal peer resolution and a committed lockfile. No force or legacy-peer-deps flags. Next/Vite patch updates address advisories found during the dependency review; they do not establish that every advisory is resolved. The candidate audit still reports 17 findings (2 low, 9 moderate, 6 high) across the installed dependency graph, including build tooling. Review these separately before introducing a server or changing the deployment model. GitHub Pages publishes static files only.

## Validation

Node 24.19.0 / local Chromium on Windows:

- ESLint and TypeScript passed.
- Custom-domain and repository-prefix production builds passed.
- `scripts/finalize-pages.mjs` retained. Both configurations passed all 36 localized routes, canonical/hreflang, CSS/images/fonts, locale switches, filtering, forms, keyboard, responsive widths, 200% text and 12 axe cases.
- The Google ownership file and private-file exclusions passed.
- Vendor build warnings about ineffective dynamic imports in Vinext error components remain; no runtime page errors were found in the tested routes.

Synthetic local performance used the same menu interaction, gzip static server, 390×844 viewport, 4× CPU slowdown and 150 ms / 1.6 Mbps network profile. These are individual laboratory observations, not field Core Web Vitals or statistically conclusive comparisons.

| Mobile measurement     | Design baseline | Candidate |
| ---------------------- | --------------: | --------: |
| LCP                    |         2916 ms |   2924 ms |
| INP (menu interaction) |           32 ms |     40 ms |
| CLS                    |          <0.001 |    <0.001 |

The mobile LCP target of 2500 ms is not met. Desktop candidate LCP was 552 ms and CLS 0; INP did not produce a sample for its very short interaction, so the report stores null rather than zero. Browser output and screenshots are ignored local/CI artifacts in `outputs/`, never website assets.

## Migration and rollback

No database migration is needed. The adapter remains required for flat HTML conversion, trailing slashes and repository prefixes. A passing build alone is insufficient grounds to remove it. This validation applies to this static application, not universal Next.js/Vercel compatibility.

The prior deployed design merge is `454da055c7705c603478bcfabad96824b8adb9ec`. Revert the compatibility merge and run the same checks to restore its lockfile. The pre-redesign baseline is `31b2cd7a72dca12469d8b9052d790880e265e0c6`.

## Editorial refresh on the established lockfile

The 2026-10-03 editorial refresh started from `0fa7805111ac50715749dfc5287184dfafc1bb0e` on `design/editorial-redesign`. Vinext, React, Vite, RSC and Next versions were unchanged. Sharp 0.35.4 was explicitly declared as a development dependency; it was already present transitively. The lockfile change did not upgrade the dependency graph. The npm installation during that refresh reported 24 findings (2 low, 8 moderate, 14 high); this was a later registry audit observation, not the historical upgrade result above. No automatic audit fixes or forced peer resolution were applied.

The export adapter remains. The editorial release `a83d557c713d77a3ae5eb0a8cfcbb2bebece27f1` was deployed successfully to GitHub Pages on 2026-10-03 (workflow run `37127310713`) and verified on the live domain. The later 2026-10-06 UI refinement starts from that release on `design/ui-refinement`, with no dependency/lockfile, database, backend or hosting migration. Publication was separately requested on 2026-10-06 after local review; confirm its workflow and live verification in ignored `outputs/deployment-release-ui.json`. Route/filter/media checks are recorded in ignored `outputs/`; measurements belong in `PERFORMANCE.md`. Preserve private records outside this public repository. Revert the UI release commit and rebuild/test to roll back, without reset/clean or touching user scripts.

The final editorial checks pass both origins with 36 authored localized routes and 13 axe cases per origin. Source preservation, EXIF removal and responsive variants pass for all nine approved assets. See `REDESIGN_REVIEW.md` for the current review evidence and checks not performed.

## Editorial engineering — 2026-10-08 local revision

`design/editorial-engineering` starts from `761a1bd92071aa40892024bd25480a6a570cb65b`. The work was delivered for local review before the user's separate deployment request on 2026-10-08. This revision retains the dependency declarations, lockfile, media pipeline, static export adapter and GitHub Pages hosting. There is no database or hosting migration, and no new WebGL, animation or UI package. Verify publication through the workflow and live checks recorded in ignored `outputs/deployment-release-editorial.json`.

The additions use existing React, inline SVG, native anchors and CSS. The bridge diagram's text remains in static HTML without JavaScript; interactive selection activates after hydration. Desktop navigation measures available width and scales its minimum viewport with root text size, while the existing menu and footer provide the other navigation paths. Reduced-motion settings disable transitions. These behaviors require their own root and repository-prefix export checks; the historical validation counts above are not evidence for this revision.

Retain the baseline export and separate before/after capture and measurement files under ignored `outputs/`. `compare-ui-performance.mjs` accepts an optional third output path to preserve earlier reports. The diagram has a separate `QA_LAB_INTERACTION=schematic` mode; comparisons for the home/detail menu interaction must use the same mode and environment on both sides. Current results belong in PERFORMANCE and REDESIGN_REVIEW. Before any future release, record the live SHA, validate the production export and obtain the requested publication scope. Roll back a published revision by reverting its release commit and rebuilding/testing, preserving unrelated user files.

## Partner directory addition — 2026-10-08

The subsequent `feature/partner-organizations` change starts from published editorial release `4281483210361609040e1dbcb533ba0c0de02d99`. It adds a shared server-rendered name/link directory to home and about. It introduces no route, browser dependency, remote image, backend or database migration. The existing dependency lockfile, media pipeline, export adapter, metadata and Pages hosting remain in place. Official website links are ordinary external anchors and must never acquire the repository base path.

## Slideshow and staff selection — 2026-10-08

The subsequent certificate update replaces the single `credential` export with typed `licences` in `content/licences.ts`; the shared `CredentialPanel` renders both certificates on home/about/expertise. This is a content projection, not a database migration. The old hardcoded validity-range markup is replaced with printed issue date and granted term. A new supervision service feeds the existing service/form/metadata consumers. It adds no package, route, media asset, endpoint or hosting change.

This local follow-up retains the partner changes and adds React interaction islands for the project slideshow and selected staff profile. It uses the existing dependencies and media derivatives. No dependency, database, backend, route, DNS or hosting migration is required. Keep the export adapter and test both root and repository-prefix exports, including the team anchor links. The initial hero and selected profile remain in static HTML. The company subsequently confirmed operations from 1996 as “Ундрага” LLC and the GBET LLC name from 2006; the anniversary count uses that operating history and the explicit reference year 2026. Rebuild to advance it. The shared service registry now includes the confirmed road-design and engineering-norms entries, preserving existing IDs and project links. No legal founding-date property is inferred. Rollback of a later published change should use its recorded release commit, preserving partner content and unrelated user files.
