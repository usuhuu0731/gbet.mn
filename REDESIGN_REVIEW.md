# Editorial engineering review — 2026-10-08

## Later local follow-up: partners, slideshow and people

This release was prepared on `feature/partner-organizations`, based on deployed `4281483210361609040e1dbcb533ba0c0de02d99`. It preserves the six-partner home/about directory and adds the requested project slideshow and staff selector. Only the three existing approved project images and six supplied portraits are used. Dependency declarations/lockfile, routes, metadata, export adapter, hosting and source assets are unchanged. All six pre-existing user scripts retain their recorded hashes. No database migration is needed. After local review, the user separately authorized deployment of these additions and the subsequent history/certificate updates on 2026-10-08. The Pages workflow includes the focused showcase check; publication and live verification are recorded in ignored `outputs/deployment-release-showcase.json`.

Final lint, TypeScript, root build and repository-prefix build pass. The existing site suite passes for both configurations: 36 localized routes, 33 axe cases, no recorded runtime or asset errors. Focused showcase checks pass no-JavaScript fallback, 320/390/1440 widths, 200% text, six staff choices, keyboard, reduced motion, manual/automatic slideshow changes and explicit resume. Failed-image recovery passes in the prefix run. Six scoped axe cases per configuration have no violations. The additional 48 slider layout cases check 320/768/1024/1440 widths, both locales, normal/200% text and all three captions; an intermediate caption/CTA overlap was corrected before final builds.

Local evidence: `outputs/showcase-site-check-root.json`, `outputs/showcase-site-check-prefix.json`, `outputs/slideshow-review/review.json`, `outputs/slideshow-review/review-prefix.json`, and `outputs/slider-intermediate-review/results.json`. Eight baseline captures and sixteen updated hero/team captures are in `outputs/slideshow-review/`. Root preview has been restored at port 5178. Browser automation used the installed Chromium; physical devices, other browser engines, screen readers and a new performance benchmark were not tested for this follow-up. Existing performance figures are historical measurements, not measurements of the new slideshow.

The company subsequently confirmed operations from 1996 as “Ундрага” LLC and the GBET LLC name from 2006. The badge now uses `sinceYear: 1996` and reference year 2026 to display 30 years of operating history. Both milestones and the distinction between the names are visible on home/about. Road design and engineering norms join the existing service registry; no norm titles or approval authority are invented. The pending director-message and Latin staff-name approvals remain unchanged.

The history/services follow-up passes lint, TypeScript and both production export configurations. The root and prefix site suites each pass 36 routes and 33 axe cases with no runtime/asset errors (`outputs/history-site-check-root.json`, `outputs/history-site-check-prefix.json`). Focused checks cover 16 MN/EN header cases at 320/390/768/1440px with normal/200% text, four timeline captures, both new contact choices, eight Service entries and no-JavaScript anniversary/history content. Screenshots and the focused report are in `outputs/history-review/`; inspected mobile/enlarged-text headers and the desktop timeline have no overlap or clipping. No dependency or migration changes, performance remeasurement, push or deployment accompanied this content update.

## Current local delivery

### Certificate records follow-up

The two supplied certificate photographs support the public text records in `content/licences.ts`: `2022/01/006`, issued 2022-04-01 for five years, with activity codes 2.8.1.1 / 2.8.1.4 / 2.8.1.7; and `2026/03/017`, issued 2026-01-27 for five years, for technical and technological supervision consultancy during road/structure construction and repair. The latter has no visible activity code; statutory article numbers are not used as codes. The UI displays printed issue dates and granted terms without inferring expiry/current standing. The supervision scope becomes the ninth service and a contact-form choice. Original photographs, signatures, seals and attachment paths are excluded from the repository and static output.

Final lint, TypeScript and both root/prefix production builds pass. Each site suite passes 36 localized routes and 33 axe cases with no runtime/asset errors (`outputs/licences-site-check-root.json`, `outputs/licences-site-check-prefix.json`). Focused review passes 18 home/about/expertise viewport/locale cases, six scoped axe captures, two no-JavaScript cases, service/form/schema checks and attachment-exclusion scans. Mobile 200% dates remain on one line after a numeric-row wrap adjustment. The six screenshots and report are in `outputs/licences-review/`. Source media, lockfile, user scripts and the export adapter are preserved. No new performance measurement, migration, push or deployment was performed.

Branch `design/editorial-engineering` starts at `761a1bd92071aa40892024bd25480a6a570cb65b`. The changes were first delivered uncommitted for local review. The user separately authorized deployment on 2026-10-08. Pre-release GitHub checks confirmed main and the successful live Pages deployment at that same SHA (workflow `37425065164`, deployment `6877484575`). The release uses the existing hosting without DNS or access changes; its final SHA, workflow, deployment and live smoke evidence belongs in ignored `outputs/deployment-release-editorial.json`. This section describes the current work; earlier release records below are historical.

The homepage now uses each of the three approved project assets once: Ikh Tamir in the hero, Sonsgolon as the sole large case study, and railway construction in the engineering section. The hero shade is concentrated behind copy, leaving the right-hand concrete structure clearer. Mobile retains the continuous 4:3 image and paper copy composition. Two text links preserve access to the other featured projects.

The archive preserves all nine records and their order: one full-width image, two images below, then six numbered text records. Filters retain query/history/locale behavior. Image-free details start with the project title and facts instead of an empty hero. About, services, engineering and contact use distinct arrangements on the same paper/white/graphite palette. Mobile timeline years appear intact above their descriptions. Form/select borders were darkened after visual review found insufficient boundary contrast (the final border has approximately 3.50:1 against white and 3.20:1 against paper).

Desktop primary links appear at 1280px when their measured labels fit, with a breakpoint that also responds to root text size. At 200% text they collapse into the existing menu. The new general SVG bridge explanation highlights superstructure, piers or foundations. All three explanations exist in static HTML without JavaScript; it is explicitly an explanatory diagram, with no claimed project geometry, dimensions or computed results. No WebGL, animation dependency or external asset was added.

Package declarations, lockfile, original image bytes, media registry/pipeline, export adapter, team information and metadata helpers remain unchanged. The four before/after MN/EN desktop/mobile team-grid captures are byte-identical. SHA-256 checks confirm the six existing untracked user scripts are unchanged. No database migration is required.

## Verification and visual evidence

- ESLint, TypeScript, production build and responsive media checks passed. All nine approved originals and cached derivatives passed preservation, dimensions/no-upscale and EXIF checks.
- Root (`https://gbet.mn`) and repository-prefix (`https://usuhuu0731.github.io/gbet.mn`) exports each passed 36 authored localized routes, 33 axe cases, eight desktop-navigation cases, 14 expanded-menu cases and 18 emulated 200% layout cases. The exporter additionally writes the root entry; authored route counts are derived from content, not a fixed assertion.
- Coverage includes metadata/canonical/hreflang/OG, sitemap/robots/CNAME/Google verification, direct nested refresh and 404, assets/fonts, filter queries/history/language switching, mailto validation, gallery Escape/focus return, 320px reflow, 200% text, 44px tested controls, reduced motion and delayed/disabled JavaScript.
- Added assertions verify one occurrence of each homepage project image, one Sonsgolon feature, the archive's full-width/two-column arrangement, no large image placeholders on unillustrated records/details, intact mobile years, and schematic controls/explanations in both locales. Export scanning found no configured private/unapproved markers or source PDFs. No new private records entered source or artifacts.
- Production snapshots contain 52 matched screenshots per version in `outputs/editorial-baseline-review/` and `outputs/editorial-after-review/`. Hero, feature, archive, illustrated/unillustrated detail, engineering, about, contact, timeline and team were sampled in MN/EN at 390/1440px. Final border corrections were checked after the prototype review. The visual direction retains BANDI's project-led editorial hierarchy without reusing its content or design assets.

The MN homepage is 8,376px tall at 390px (baseline 9,640; −13.1%) and 7,251px at 1440px (baseline 8,914; −18.7%). The MN archive is 4,764px / 4,391px (baseline 6,325 / 6,221; −24.7% / −29.4%). These are screenshot geometry comparisons, not performance metrics. Large imagery remains; the reduction comes primarily from removing repetition and empty image panels.

Evidence: `outputs/editorial-site-check-root.json`, `outputs/editorial-site-check-prefix.json`, `outputs/editorial-zoom-root.json`, `outputs/editorial-zoom-prefix.json`, `outputs/editorial-media-check.json`, `outputs/editorial-preservation.json` and corresponding build/check logs. The immutable baseline export is `outputs/editorial-baseline-site/`. See [PERFORMANCE.md](PERFORMANCE.md) for fresh five-run before/after results and measured limitations. Reports and screenshots are ignored local artifacts, not public assets.

The fresh 40-before/40-after home/detail batches pass the 5% LCP median regression gate in all eight conditions. Current mobile medians are 2588–2736ms, so the 2500ms absolute target remains unmet. All current CLS samples are 0; observed menu INP is 24–56ms. A separate 20-load schematic batch records INP 24–48ms and CLS 0; its mobile LCP medians of 2616/2620ms also exceed 2500ms. Missing menu INP samples remain unavailable. Full median/min/max and raw results are in PERFORMANCE; no field CWV guarantee is made.

## Limits and publication boundary

Chromium was tested on Windows. Firefox, Safari/WebKit, physical phones, native toolbar zoom, screen-reader behavior and field CWV were not verified. The 200% text and emulated viewport/DPR checks do not claim native toolbar testing or full WCAG 2.2 AA certification. The supplied project images remain limited to 1320–1846px source widths; no artificial upscaling was introduced. Multi-image gallery navigation still lacks an approved same-project multi-image dataset. Latin staff spellings, creator credits and director-message approval remain outstanding and were not invented.

The desktop measured navigation needs hydration to appear; exported footer links, headings, images, project records and schematic explanations remain available without JavaScript. The contact form still opens a mailto draft and does not claim delivery. Publication is now authorized by the user's separate deployment request. Confirm CI, Pages deployment and live routes before reporting completion. To roll back a published release, revert its release commit and rebuild/test before deploying the revert. Preserve user scripts; do not reset or clean the shared checkout.

---

# Historical local editorial redesign review — 2026-10-03

## Review state

Review branch: `design/editorial-redesign`, created at `0fa7805111ac50715749dfc5287184dfafc1bb0e`. The original implementation request ended at local review. The user separately authorized publication on 2026-10-03. The previous successful live deployment is that same SHA, Pages deployment `6822460151`, workflow run `37091601397`, at `https://gbet.mn/`. Stage only reviewed redesign files; do not use a blanket add that includes the user's scripts. The release uses the existing Pages workflow and custom domain without a hosting migration or DNS/access change. Record the final release SHA, workflow result and live checks in ignored `outputs/deployment-release.json`.

The six existing untracked scripts remain untouched: `domain-proof.mjs`, `domain-qa.mjs`, `functional-qa.mjs`, `inspect-layout.mjs`, `live-proof.mjs`, `upload-inventory.py` under `scripts/`.

## Result

The unified graphite/paper/blue design has a photograph-led desktop hero, one continuous 4:3 photo/text mobile hero with two CTAs, large asymmetrical project features, approved engineering examples, static engineering imagery, six 4:5 staff profiles and a quiet contact/footer. Existing content, project slugs, MN/EN and logo are retained. The prior mandatory 3D hero/viewer requirement is superseded for this release; no interactive 3D is included.

Details now contain approved facts, one initial image with a native zoom dialog, the approved summary, related projects and contact links. Five repeated empty headings and the unnecessary second photograph are removed. Publication-ready `CaseStudyBlock` data can extend the page without invented content. Filters use stable IDs and query parameters, survive reload/back/forward and language changes, and retain the unfiltered canonical URL. The contact form still opens a mail draft and never reports delivery.

The Sharp pipeline keeps nine registered originals byte-for-byte, auto-orients derivatives, strips EXIF, avoids upscaling, caches unchanged inputs and creates responsive WebP plus approved MN/EN OG previews. A sanitized variant/dimensions manifest is published. Source images, stale variants and unused font subsets are excluded from the static artifact; Inter's used subsets and OFL licence remain. Gallery image bytes load only when the dialog opens.

## Dependency and migration review

Vinext 1.0.1, React 19.2.6, Vite 8.3.2, RSC 0.5.34, Next 16.3.8 and the export adapter remain. Node 24.19.0 was used. Sharp 0.35.4 is the sole new direct devDependency; it was already transitive, and the lockfile diff adds only its root declaration. No forced installation or automatic audit fix was applied. The installation reported 24 audit findings (2 low, 8 moderate, 14 high); those remain unresolved observations of the existing graph.

No database, backend or hosting migration is needed. Native Next/Vercel compatibility is not guaranteed. See `COMPATIBILITY.md` and `README.md` for migration boundaries and rollback. Vendor ineffective-dynamic-import warnings remain in successful build logs.

## Validation evidence

- ESLint, TypeScript, production build and source/variant/cache checks passed on Node 24. The nine registered source hashes match the starting HEAD; variants have no EXIF and no enlargement.
- Root (`https://gbet.mn`) and repository prefix (`https://usuhuu0731.github.io/gbet.mn`) exports pass 36 authored localized routes and 13 axe cases each. Expected routes come from authored locale/nav/project definitions, including array additions, rather than a hardcoded count.
- Checks cover direct nested links/refresh, strict 404, query-preserving redirects, canonical/hreflang/OG, sitemap/robots/CNAME/manifest, Google ownership file, CSS/fonts/images, filters, all six staff, localized form validation, keyboard/Escape/focus return, touch controls, 320px reflow, 200% text and reduced motion. High-DPR selection uses the actual variant pixels rather than density-corrected `naturalWidth`.
- Root and prefix pass 10 additional cases each at an emulated 200% browser layout: 720×450 CSS viewport, DPR 2, equivalent to a 1440×900 physical surface. Header menu and image dialog remain accessible. This verifies equivalent layout/pixel density; the browser's native toolbar zoom setting was not confirmed.
- Known private/unapproved markers are scanned across HTML, JS, JSON, RSC/TXT payloads, maps, CSS, XML and manifest. Private-document paths/PDFs are excluded. No source maps are published. This is a regression guard for known material, not automatic approval of future claims.

Evidence: `outputs/site-check-root.json`, `outputs/site-check-prefix.json`, `outputs/media-check.json`, `outputs/zoom-root.json`, `outputs/zoom-prefix.json` and their corresponding logs. These files are ignored local/CI artifacts and are not website assets.

## Visual review

[The Korean BANDI reference](https://bandiconsult.com/index.php) was reviewed before implementation and reopened for the final comparison. Its large engineering imagery and restrained interface remain the primary reference. No code, photographs, words or exact transitions were copied. sbp/Arup informed information relationships without mixing visual systems.

Before/after production captures are in `outputs/before/` and `outputs/after/`: home, Sonsgolon feature, Ikh Tamir detail, team grid and director profile in MN/EN at 390/1440 widths. Full feature captures reserve extra viewport height to include the entire facts row. Hero captures retain 390×844 and 1440×900. Both sets have 20 images. Representative crops, portrait faces, Mongolian words, captions, whitespace and readability were inspected. Automated tests are not the visual-quality verdict or full WCAG certification.

## Five-run performance comparison

| Mobile LCP median   |  Before |   Final |
| ------------------- | ------: | ------: |
| MN home             | 3736 ms | 2900 ms |
| EN home             | 3752 ms | 2796 ms |
| MN Ikh Tamir detail | 4656 ms | 2820 ms |
| EN Ikh Tamir detail | 4416 ms | 2772 ms |

The mobile 2500 ms goal is unmet. Final CLS is 0 in all measured loads. Sampled menu INP is within 200 ms. Desktop EN medians increased slightly; the complete median/min/max and sample counts are in `PERFORMANCE.md`, with raw 40-run batches in `outputs/performance-before.json` and `outputs/performance-after-final.json`. These are laboratory observations, not real-user Core Web Vitals. The single-run preload probe did not establish useful benefit and that hint was removed.

## Remaining approval and verification

Approved Latin staff spellings, photographer/creator credits and director-message paragraphs are still missing. The operating-history distinction was subsequently clarified by the company as recorded above; the Naadamchid measurement conflict remains in private review and unpublished. No new biography, staff credential, project image or technical outcome is invented. Original source resolution limits large/high-DPR rendering; further imagery requires company-approved source files.

Firefox, Safari/WebKit, physical phones, native browser-toolbar 200% zoom and field CWV were not tested. Production/live-host smoke results are recorded separately with the authorized release. The actual data currently supplies one image per project, so multi-image previous/next is implemented but has not been exercised with an approved same-project multi-image dataset. This release does not claim complete WCAG 2.2 AA certification.

## Authorized publication and rollback

The actual previous live SHA was verified through GitHub's successful Pages deployment before publication. Use the tested custom-domain export, the existing main-triggered Pages workflow, and confirm the deployed SHA plus a live smoke test. Publication is complete only after these checks pass. Revert the release commit to roll back, then rebuild/test both export configurations and confirm the new deployment. Preserve user scripts and private records; do not reset/clean the checkout to roll back local edits.

## UI refinement review — 2026-10-06

The editorial redesign was subsequently published as `a83d557c713d77a3ae5eb0a8cfcbb2bebece27f1` and verified live. The new UI work begins at that exact release on `design/ui-refinement`. It was delivered as an uncommitted local review before the user's separate 2026-10-06 deployment request. All six pre-existing untracked scripts remain untouched. Package/dependency declarations, lockfile, media sources, team data and portrait composition are unchanged; all four MN/EN 390/1440 team-grid captures are byte-identical before/after.

The implemented scope is five UI refinements: native service disclosures with stable IDs/project associations, approved length/type highlights without duplicate facts, decorative static engineering grids, consistent CTA/form feedback and larger numbered navigation. All service descriptions render into static HTML; no library, animation framework, remote asset or backend was added. Approved copy and metadata are preserved. The menu was corrected after a targeted 200% text test showed that using only the nominal header height let its panel extend below the viewport. It now follows the actual header bounds while open and removes its observer/listeners when closed.

Validation passes ESLint, TypeScript, production build and media checks (nine unchanged originals, their derivatives, EXIF stripping and caching). Root and repository-prefix exports each pass all 36 authored localized routes, 25 axe cases, 10 additional menu breakpoint/short-viewport/200% text checks, and 14 emulated 200% layout cases. Coverage includes native accordion Enter/Space, independently open rows without JavaScript, authored service IDs/slugs, all project highlight presence/absence and duplicate-label checks, localized form error/information states, source exclusions, metadata/assets, nested refresh/404, query filters, language switching, focus/Escape and reduced motion. This is not a WCAG certification.

Before/after captures are in `outputs/ui-before/` and `outputs/ui-after/`, 40 images each: home, services, engineering, detail/facts, menu, contact/error and unchanged team. Representative desktop/mobile MN/EN views were visually reviewed. The first baseline capture log incorrectly printed 36; directory inventory confirms 40 images, and the capturer now reports the actual counter. Reports/screenshots and the baseline snapshot remain ignored local artifacts.

The fresh 40-before/40-after performance batches meet the maximum 5% LCP median regression gate in all eight scenarios; the largest increase is +3.1% in desktop MN home. Mobile home/detail medians remain 2592–2776ms, above the 2500ms target. Twenty separate native disclosure loads were measured after the change. All measured final CLS values are 0; observed menu/disclosure INP is 24–40ms, with missing desktop samples kept unavailable. PERFORMANCE contains median/min/max, sample counts and raw evidence. No claim of statistical significance or field CWV is made.

Evidence files: `outputs/ui-site-check-root.json`, `outputs/ui-site-check-prefix.json`, `outputs/ui-zoom-root.json`, `outputs/ui-zoom-prefix.json`, `outputs/ui-media-check.json`, `outputs/ui-performance-comparison.json` and the three `performance-ui-*.json` batches. Firefox/WebKit, physical phones, native browser-toolbar zoom, screen-reader behavior and live-host smoke were not tested for this local refinement. Native toolbar zoom is distinguished from the completed 200% text enlargement and equivalent viewport/DPR checks. No new image or staff approval is needed for the implemented UI; existing missing Latin spellings, creator credits and director-message approvals remain outside its scope.

The user separately requested publication on 2026-10-06. Before release, GitHub main and the successful live Pages deployment were confirmed at `a83d557c713d77a3ae5eb0a8cfcbb2bebece27f1` (run `37127310713`, deployment `6828373839`). Only reviewed UI/documentation/QA files are included; private artifacts and the six user scripts stay outside the commit. Confirm CI, deployment and a live smoke test before reporting publication complete; retain the release evidence in ignored `outputs/deployment-release-ui.json`. Revert the UI release commit to roll back; preserve user scripts and private records. Native Next/Vercel compatibility is not asserted, and no database or hosting migration is required.
