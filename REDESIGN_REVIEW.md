# Local editorial redesign review — 2026-10-03

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

Approved Latin staff spellings, photographer/creator credits and director-message paragraphs are still missing. Founding-year and Naadamchid measurement conflicts remain in private review and unpublished. No new biography, staff credential, project image or technical outcome is invented. Original source resolution limits large/high-DPR rendering; further imagery requires company-approved source files.

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
