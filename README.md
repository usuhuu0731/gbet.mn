# GBET Consulting Engineers

Bilingual Mongolian/English engineering portfolio at https://gbet.mn. GitHub Pages deploys only the static `site/` artifact. The earlier Sites deployment is separate.

## Build, preview, and checks

Use Node 24 with the committed lockfile. No forced peer dependency installation.

```sh
npm ci
export GBET_REPOSITORY=usuhuu0731/gbet.mn
export GBET_PUBLIC_ORIGIN=https://gbet.mn
npm run lint
npx tsc --noEmit
npm run build
npx playwright install chromium
npm run check:site
node scripts/serve-static.mjs
```

PowerShell uses `$env:GBET_REPOSITORY='usuhuu0731/gbet.mn'` and `$env:GBET_PUBLIC_ORIGIN='https://gbet.mn'`. Preview: http://127.0.0.1:5174/mn/. `QA_BROWSER_PATH` can point to an existing Chromium executable; CI installs Playwright's matching browser. `QA_BASE_URL` optionally checks a deployed site; otherwise the test starts its own strict static server.

Without `GBET_PUBLIC_ORIGIN`, repository-prefixed GitHub Pages export remains supported. Build and test with the same configuration. Never change domain DNS without matching the Pages settings and exported origin. `CNAME`, canonical, hreflang, robots, sitemap and manifest derive from this configuration.

The workflow validates pull requests, and deploys successful main/manual builds. Checks include 36 localized routes, six staff members, filters, locale preservation, mailto form validation, keyboard navigation, reduced motion, responsive widths, 200% text enlargement, private artifact exclusions and automated axe checks. Screenshots/reports are CI artifacts, not public website assets. These checks are not a full WCAG certification or field Core Web Vitals guarantee.

Client-only controls are disabled until hydration can handle the first action. A delayed-script test exercises this behavior. Browser QA waits for the document and actual UI/image readiness; unrelated long-polling is not a readiness signal. Latest measured performance and its limitations are in [PERFORMANCE.md](PERFORMANCE.md).

## Visual and content system

The Korean BANDI website is the primary design reference for large engineering imagery, editorial hierarchy, whitespace and restrained interaction. sbp/Arup inform information relationships only. No reference code, photography or copy is reused. `app/globals.css` is one coherent responsive layout system, replacing the previous stack of overrides. Initial hero, featured project and staff layouts must be reviewed at desktop/mobile sizes before extending the design.

The original requirement for an interactive 3D hero and structure viewer is superseded for this release. Static photography/design imagery is the engineering presentation. Unmounted demo viewers and unused starter UI components were removed; a future 3D feature needs a separately approved quality review. Restrained image transitions use CSS and respect reduced motion.

- `content/site.ts`: reviewed projects, services, navigation and site identity. Keep missing years/roles/measurements omitted.
- `content/team.ts`: company-supplied current names and roles; approved biographies only. Latin name spellings await confirmation, so EN retains the supplied Cyrillic names.
- `content/media.ts`: replaceable images, dimensions, bilingual alt text, crop position and website-use approval. Portrait permission is independent of professional-information approval.

Add an authorized portrait to `public/team/`, register a `kind: 'portrait'` asset with `usageApproved: true`, then set the member's `portraitId`. Unapproved/missing assets automatically use a 4:5 graphite placeholder. Do not use synthetic portraits, diploma scans, personal identifiers, signatures or private contacts. Do not fabricate employees or biographies.

The director's message component is ready but `directorMessage.approved` is false and its public paragraph list is empty. Keep drafts and review records outside this repository. After company review, copy the approved MN/EN paragraphs into `content/team.ts` and enable publication. A disabled flag is not sufficient protection for an unapproved draft stored in a public module.

Project files were supplied by GBET with permission for this website. Rendering/photo distinctions are explicit. Creator credits remain unconfirmed; permission does not grant unrelated reuse. See `public/projects/README.md` and `PROJECT_TEMPLATE.md` for replacements. Do not hotlink external imagery. Self-hosted Inter supports Mongolian Ө/Ү and retains its OFL licence.

## Contact and search

The contact form opens a mailto draft; it does not send or store messages. GitHub Pages has no backend. A future endpoint requires an explicit implementation with error/progress states; setting a URL alone is not a complete integration. No CMS, analytics, database, authentication or paid assets are configured.

The MN homepage title remains “Зураг төсөл, технологи-инженерийн зөвлөх ГБЭТ ХХК”. Company aliases appear in appropriate visible copy and WebSite/ProfessionalService data. Preserve `public/google9a26a91e934cf80c.html`: Search Console ownership was verified and MN/EN indexing was requested on 2026-10-02. Sitemap submission reported “Couldn't fetch” despite direct HTTP/XML checks; successful Google processing remains unconfirmed. Google selects displayed titles and search positions; this implementation makes no indexing/ranking promise.

## Compatibility and migration

The redesign was implemented and deployed on Vinext beta.5 / plugin-rsc 0.5.26 / React 19.2.6 first. The separate compatibility upgrade uses Vinext 1.0.1, plugin-rsc 0.5.34, Vite 8.3.2 and Next/eslint-config-next 16.3.8 while preserving React 19.2.6 and the export adapter. See [COMPATIBILITY.md](COMPATIBILITY.md) for checks, measurements and rollback. Registry availability and a passing build do not demonstrate static-export compatibility. Never use `--force` or `--legacy-peer-deps` to conceal dependency conflicts.

Vinext's native basePath/trailingSlash settings did not export this application correctly. Keep `scripts/finalize-pages.mjs`: it converts flat HTML into route/index.html, preserves the Google verification file, and creates static metadata. Removing it requires explicit replacement tests for custom domain, repository prefix, redirects, direct detail links, images/CSS/fonts and invalid routes.

Native Next App Router migration requires reviewing injected path constants, anchor/basePath handling, locale selection, metadata/static handlers and export output. Compatibility with Next/Vercel is not guaranteed. No database migration is needed.

Deploy by merging a tested change into main. Roll back by reverting its merge commit; keep the previous live SHA in the handoff record. Source PDFs and all private provenance, personnel and draft records remain outside the repository and deployment.
