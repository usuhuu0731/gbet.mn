# GBET Consulting Engineers

Bilingual Mongolian/English engineering portfolio at https://gbet.mn. GitHub Pages deploys only the static `site/` artifact. The earlier Sites deployment is separate.

## Build, preview, and checks

Use Node 24 with the committed lockfile. No forced peer dependency installation.

```sh
npm ci
export GBET_REPOSITORY=usuhuu0731/gbet.mn
export GBET_PUBLIC_ORIGIN=https://gbet.mn
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run check:site
npm run check:zoom
node scripts/serve-static.mjs
```

PowerShell uses `$env:GBET_REPOSITORY='usuhuu0731/gbet.mn'` and `$env:GBET_PUBLIC_ORIGIN='https://gbet.mn'`. Preview: http://127.0.0.1:5174/mn/. `QA_BROWSER_PATH` can point to an existing Chromium executable; CI installs Playwright's matching browser. `QA_BASE_URL` optionally checks a deployed site; otherwise the test starts its own strict static server.

Without `GBET_PUBLIC_ORIGIN`, repository-prefixed GitHub Pages export remains supported. Build and test with the same configuration. Never change domain DNS without matching the Pages settings and exported origin. `CNAME`, canonical, hreflang, robots, sitemap and manifest derive from this configuration.

The workflow validates pull requests, and deploys successful main/manual builds. Checks compare authored locale/page/project routes against the full export, six staff members, filters, locale preservation, mailto form validation, keyboard navigation, reduced motion, responsive widths, 200% text enlargement, emulated 200% layout/pixel density, private artifact exclusions and automated axe checks. Screenshots/reports are CI artifacts, not public website assets. These checks are not a full WCAG certification or field Core Web Vitals guarantee.

Client-only controls are disabled until hydration can handle the first action. Home headings, images, CTAs, footer navigation and the complete initial project list remain in exported HTML. A delayed-script test exercises this behavior. Browser QA waits for the document and actual UI/image readiness; unrelated long-polling is not a readiness signal. Latest measured performance and its limitations are in [PERFORMANCE.md](PERFORMANCE.md).

## Visual and content system

The [Korean BANDI website](https://bandiconsult.com/index.php) is the primary design reference for large engineering imagery, editorial hierarchy, whitespace and restrained interaction. sbp/Arup inform information relationships only. No reference code, photography or copy is reused. `app/globals.css` is one coherent responsive layout system, replacing the previous stack of overrides. Hero, featured project, detail and staff layouts are reviewed in both languages at desktop/mobile sizes. Avoid repeating empty case-study headings; render only approved blocks.

The original requirement for an interactive 3D hero and structure viewer is superseded for this release. Static photography/design imagery is the engineering presentation. Unmounted demo viewers and unused starter UI components were removed; a future 3D feature needs a separately approved quality review. The mobile hero uses a full-width 4:3 bridge photograph followed by heading and CTAs on paper; desktop uses text over the photograph. Restrained CSS interactions and cross-document root transitions respect reduced motion. No animation library is installed.

- `content/site.ts`: reviewed projects, services, navigation and site identity. Keep missing years/roles/measurements omitted.
- `content/licences.ts`: public certificate transcription, shared by home/about/expertise. The supplied certificates record `2022/01/006` (issued 2022-04-01, five years; feasibility studies, urban roads/structures, bridges/tunnels) and `2026/03/017` (issued 2026-01-27, five years; technical/technological supervision consultancy for road/structure construction and repair). The latter also supports the supervision service and contact choice. Show printed issue dates and terms, not an inferred current status or expiry date. Activity codes appear only where printed; legal article references are not service codes. Keep the original scans, signatures, seals and private source records outside the repository and deployment.
- `content/team.ts`: company-supplied current names and roles; approved biographies only. Latin name spellings await confirmation, so EN retains the supplied Cyrillic names.
- `content/media-sources.json`: approved source images, real dimensions, bilingual alt/caption, focal positions and per-image quality. `content/media.ts` supplies the typed public registry with generated responsive variants. Portrait permission is independent of professional-information approval.
- `content/partners.ts`: company-supplied partner names and official website links, shared by the home/about server-rendered sections. The 2026-10-08 list contains six organizations named by the client. Official websites establish organization identity, not independent evidence of a GBET contract or endorsement. Do not add project/contract claims, dates, logos or structured-data affiliations without supporting information. Private verification records stay outside the repository.

Add an authorized portrait to `public/team/`, register a `kind: 'portrait'` asset in `content/media-sources.json` with `usageApproved: true`, then set the member's `portraitId`. Unapproved/missing assets automatically use a 4:5 graphite placeholder. All six current staff profiles now use company-supplied portraits. See `public/team/README.md`. Do not generate substitutes for missing staff portraits or publish diploma scans, personal identifiers, signatures or private contacts. Do not fabricate employees or biographies.

The director's message component is ready but `directorMessage.approved` is false and its public paragraph list is empty. Keep drafts and review records outside this repository. After company review, copy the approved MN/EN paragraphs into `content/team.ts` and enable publication. A disabled flag is not sufficient protection for an unapproved draft stored in a public module.

Project files were supplied by GBET with permission for this website. Rendering/photo distinctions are explicit. Creator credits remain unconfirmed; permission does not grant unrelated reuse. See `public/projects/README.md` and `PROJECT_TEMPLATE.md` for replacements. Do not hotlink external imagery. Self-hosted Inter supports Mongolian Ө/Ү and retains its OFL licence.

## Project slideshow and people selector — 2026-10-08

The later client request supersedes the static-only hero direction for this revision. `ProjectSlideshow` uses the existing three approved project images with project-specific names, locations and links; the Sonsgolon image is identified as a design rendering. Ikh Tamir alone is exported as the initial eager/high-priority hero image. Other slides load on demand while the current image remains visible. Rotation is seven seconds, with previous/next, direct selection and pause/play controls. Focus or manual selection stops rotation until explicitly restarted. Hover, offscreen and hidden-page states suspend it; reduced motion disables autoplay and fades. No JavaScript leaves the first image, caption and links usable.

Home/about use `TeamSelector` for a large selected portrait and six choices with permanently visible names and roles. The complete `/team/` directory is retained. Without JavaScript the choices link to the corresponding team anchors. Existing portraits, image permissions and Cyrillic names are unchanged. No animation dependency is added.

`content/company-history.ts` controls the header anniversary badge and shared home/about history. The company confirmed that operations began as “Ундрага” LLC in 1996 and continued under the GBET LLC name from 2006. `sinceYear: 1996` and `referenceYear: 2026` display 30 years of operating history. Both stages appear in the timeline and introduction; this does not assert that GBET was incorporated in 1996, and no `foundingDate` is added to structured data. The original logo asset is unchanged. The count is a calendar-year difference, not an assertion that an exact anniversary date has passed. Rebuild and review the header when advancing the reference year. A null starting year still disables the badge.

The same company clarification confirms road design, bridge design, feasibility studies and development of road/bridge engineering norms. These lead the service list, followed by the existing specialist capabilities. Services feed home/expertise accordions, contact choices and Service metadata; do not invent completed norm titles, approval authority, project examples or certifications. The predecessor's name retains its supplied Cyrillic spelling in the English copy.

Run `node scripts/check-showcase.mjs` after the production build and repeat under the repository-prefix configuration. It covers manual/automatic project changes, pause and motion behavior, SSR/no-JavaScript fallback, team selections, 320/390/1440px, 200% text and scoped axe. The Pages workflow now runs this check alongside existing site/zoom/media checks. Evidence is written to ignored `outputs/slideshow-review/`. The user separately authorized publication of the partner, slideshow, staff selection, anniversary/history and certificate changes on 2026-10-08. The previous live SHA is `4281483210361609040e1dbcb533ba0c0de02d99`; confirm workflow success and live smoke in ignored `outputs/deployment-release-showcase.json` before reporting publication complete. Roll back by reverting this release and rebuilding/testing, preserving unrelated user scripts.

## Contact and search

The contact form opens a mailto draft; it does not send or store messages. GitHub Pages has no backend. A future endpoint requires an explicit implementation with error/progress states; setting a URL alone is not a complete integration. No CMS, analytics, database, authentication or paid assets are configured.

The MN homepage title remains “Зураг төсөл, технологи-инженерийн зөвлөх ГБЭТ ХХК”. Company aliases appear in appropriate visible copy and WebSite/ProfessionalService data. Preserve `public/google9a26a91e934cf80c.html`: Search Console ownership was verified and MN/EN indexing was requested on 2026-10-02. Sitemap submission reported “Couldn't fetch” despite direct HTTP/XML checks; successful Google processing remains unconfirmed. Google selects displayed titles and search positions; this implementation makes no indexing/ranking promise.

## Compatibility and migration

The redesign was implemented and deployed on Vinext beta.5 / plugin-rsc 0.5.26 / React 19.2.6 first. The separate compatibility upgrade uses Vinext 1.0.1, plugin-rsc 0.5.34, Vite 8.3.2 and Next/eslint-config-next 16.3.8 while preserving React 19.2.6 and the export adapter. See [COMPATIBILITY.md](COMPATIBILITY.md) for checks, measurements and rollback. Registry availability and a passing build do not demonstrate static-export compatibility. Never use `--force` or `--legacy-peer-deps` to conceal dependency conflicts.

Vinext's native basePath/trailingSlash settings did not export this application correctly. Keep `scripts/finalize-pages.mjs`: it converts flat HTML into route/index.html, preserves the Google verification file, and creates static metadata. Removing it requires explicit replacement tests for custom domain, repository prefix, redirects, direct detail links, images/CSS/fonts and invalid routes.

Native Next App Router migration requires reviewing injected path constants, anchor/basePath handling, locale selection, metadata/static handlers and export output. Compatibility with Next/Vercel is not guaranteed. No database migration is needed.

The redesign was reviewed locally on `design/editorial-redesign`, then separately authorized for publication on 2026-10-03. The previous successful live SHA is `0fa7805111ac50715749dfc5287184dfafc1bb0e` (Pages run `37091601397`). A main push triggers the existing GitHub Pages production workflow. Confirm the release's build/deploy result and live smoke test before reporting publication complete; retain the result in the ignored `outputs/deployment-release.json`. Roll back by reverting the release commit and rebuilding/testing the export. Source PDFs and all private provenance, personnel and draft records remain outside the repository and deployment.

## Responsive media and case studies

Sharp 0.35.4 is a direct development dependency; other framework versions are unchanged. `npm run prepare:media` runs before dev/build/lint/typecheck/site/media/capture/lab QA. A fresh checkout must prepare media before invoking `tsc` directly. Sources stay byte-for-byte intact. The generator auto-orients, strips EXIF, avoids upscaling, creates WebP widths and MN/EN project OG images, and caches outputs by input bytes, settings and Sharp versions. Generated JSON and `public/generated/` are ignored. Never store private rights documents in the public registry.

The export adapter excludes source project/portrait images, unused font subsets, starter assets and obsolete generated variants from `site/`. It keeps the used Inter subsets and OFL license. Only needed derivatives, approved OG images and the sanitized dimensions/URL manifest are published. No source PDF is included.

`ProjectImage` accepts `priority`: initial home/detail imagery uses eager/high; lower imagery is lazy/auto. No extra hand-authored image preload is used. `CaseStudyBlock` supports text, image, gallery, diagram, facts and related projects. Optional `Project.caseStudy` contains publication-ready blocks only. Default details use the existing approved summary and related projects. The initial detail photo opens a native dialog; the modal does not request a second image until opened.

Filters use locale-independent category/year/location/status query values. Locale switches preserve these values, reload and browser history restore them, and canonical URLs omit queries. Internal route anchors include trailing slashes; the strict preview redirect also preserves query strings.

## Local review and repeatable QA

Current scope, evidence, remaining approvals and review files are listed in [REDESIGN_REVIEW.md](REDESIGN_REVIEW.md).

```sh
npm run lint
npm run typecheck
npm run build
npm run check:site
npm run check:zoom
npm run check:media
QA_REPORT_TAG=after npm run capture:design
QA_REPORT_TAG=after QA_LAB_RUNS=5 npm run measure:lab
```

PowerShell sets these using `$env:QA_REPORT_TAG='after'` and `$env:QA_LAB_RUNS='5'`. `QA_GIT_PATH` optionally selects Git for source-byte checks, and `QA_SOURCE_REF` selects the baseline commit (default HEAD). `QA_SITE_DIR` optionally serves an ignored snapshot instead of `site/`. Export origin uses `GBET_PUBLIC_ORIGIN`. Reports are local/CI-only in `outputs/`. QA performs no external mail submission.

Test the repository-prefix configuration separately by clearing `GBET_PUBLIC_ORIGIN`, rebuilding, and running site QA; then restore the custom-domain build. QA uses authored route definitions, strict 404s, direct refresh, metadata, URL filters, native dialog Escape/focus return, no-JS content, delayed hydration, responsive reflow, 200% text and axe. It is not WCAG certification. Synthetic menu INP is not real-user INP; absent samples remain null.

## UI refinement — 2026-10-06

The five-part UI refinement starts from the deployed editorial release `a83d557c713d77a3ae5eb0a8cfcbb2bebece27f1` on `design/ui-refinement`. It was completed and checked locally before the separate publication request on 2026-10-06. The release uses the existing main-triggered GitHub Pages workflow; deployment and live verification evidence belong in ignored `outputs/deployment-release-ui.json`. The existing team composition, six portraits, approved copy, routes and SEO remain. Dependency declarations, lockfile and the export adapter are unchanged. No library source was copied: the research informed original CSS/native HTML rather than installing UI libraries.

Services now have stable `id` and optional `projectSlugs` fields. Keep IDs unique and locale-independent. The native `details/summary` rows render all approved text into static HTML, start with the first row open, allow several open rows and work without JavaScript. Related project links are authored with the service rather than inferred from its array position. No new examples should be invented for services without approved project records.

Detail highlights read the existing length/type fields verbatim and omit missing values; those fields are not duplicated in the smaller facts rail. A decorative 48/192px CSS grid appears only behind the engineering copy/heading. It is not a project drawing. Shared CTA feedback keeps labels and control dimensions stable. Form feedback explicitly distinguishes errors, information, pending and endpoint success; the configured mailto draft remains informational and never reports delivery.

The numbered menu uses three/two/one columns at 1024/768px breakpoints. It remains a non-modal navigation panel with Escape, focus return and focus-exit closure. While open, its available height follows the actual header bounds through ResizeObserver and window resize/scroll events; listeners are removed when it closes. This matters when 200% text enlargement increases header height. Reduced-motion preferences disable visual transitions.

Capture the current UI with `QA_REPORT_TAG=ui-after node scripts/capture-ui.mjs` (PowerShell: set `$env:QA_REPORT_TAG='ui-after'` first). It captures home, services, facts/detail, engineering, menu, form and the unchanged team in both locales at 390/1440 widths. `QA_LAB_INTERACTION=accordion` selects five-run service-disclosure measurements using `scripts/measure-lab.mjs`; the default menu measurement and its original two routes remain unchanged. Measurements should run without parallel builds or browser QA. See PERFORMANCE and the UI section of REDESIGN_REVIEW for actual results and limitations.

## Editorial engineering — 2026-10-08 local review

This revision was completed for local review on `design/editorial-engineering`, based on release `761a1bd92071aa40892024bd25480a6a570cb65b`. The user separately authorized production deployment on 2026-10-08. Dependencies, lockfile, media pipeline, export adapter and GitHub Pages hosting remain unchanged; no database migration is required. The release uses the existing main-triggered Pages workflow. Confirm CI, deployment and live smoke before declaring publication complete; retain the release evidence in ignored `outputs/deployment-release-editorial.json`. The historical release records above remain applicable to their respective versions.

The October 8 editorial baseline used each approved project image once: Ikh Tamir in the hero, Sonsgolon as the selected case study, and the railway photograph in engineering. The subsequent requested project slideshow extends the hero with those same approved images; the initial static HTML still contains only the Ikh Tamir slide. Other selected projects use text links. The project index preserves authored order and URL filters, with one large image followed by two image features and compact text rows for records without approved photographs. Those detail pages start with facts and approved copy instead of a large empty image panel.

`ProjectImage.presentation` accepts `feature`, `index-feature`, `index` or `detail` (default). It selects responsive image sizes for the actual placement; image availability still comes from the existing media registry. The primary desktop links are Projects, Expertise and About. After hydration they appear only at a viewport of at least 1280px, at least 80 times the computed root font size, and sufficient measured clearance between brand and actions. ResizeObserver and font readiness recalculate the fit; the existing menu handles narrower or enlarged-text layouts. Footer navigation remains available without JavaScript.

The engineering page adds a generic SVG bridge diagram with superstructure, pier and foundation controls. It illustrates structural relationships rather than a GBET project's geometry or calculation results. All descriptions are exported as readable HTML; controls activate after hydration. Reduced motion disables its transitions. The SVG uses original code and adds no rendering or animation dependency. Team content and portrait layouts are preserved.

Use distinct report tags to retain previous review evidence. The editorial capture script produces 52 screenshots across MN/EN and 390/1440px layouts, with a capture manifest. Run measurements without concurrent builds or browser QA:

```sh
QA_REPORT_TAG=editorial-after node scripts/capture-editorial.mjs
QA_REPORT_TAG=editorial-after QA_LAB_RUNS=5 npm run measure:lab
QA_REPORT_TAG=editorial-schematic QA_LAB_RUNS=5 QA_LAB_INTERACTION=schematic npm run measure:lab
node scripts/compare-ui-performance.mjs outputs/performance-editorial-before.json outputs/performance-editorial-after.json outputs/editorial-performance-comparison.json
```

PowerShell sets the same variables with `$env:QA_REPORT_TAG='editorial-after'`, `$env:QA_LAB_RUNS='5'` and, for the schematic run, `$env:QA_LAB_INTERACTION='schematic'`. Clear `QA_LAB_INTERACTION` before a default menu comparison. Schematic measurements visit engineering and select piers, foundations and deck; menu and accordion modes retain their earlier behavior. The optional third comparison argument changes only the report destination, so the October 6 comparison need not be overwritten. Current check outcomes and measurement limitations belong in REDESIGN_REVIEW and PERFORMANCE; these usage instructions do not assert a completed test run.
