# GBET Consulting Engineers — GitHub Pages

MN/EN bridge engineering portfolio. This repository is the static GitHub Pages adaptation of the GBET Sites website. The existing Sites deployment remains separate.

## Run and publish

Use Node.js 24 and the committed lockfile:

```sh
npm ci
export GBET_REPOSITORY=usuhuu0731/gbet.mn
npm run lint
npx tsc --noEmit
npm run build
node scripts/serve-static.mjs
```

PowerShell: `$env:GBET_REPOSITORY='usuhuu0731/gbet.mn'`. Preview is `http://127.0.0.1:5174/gbet.mn/`. The strict static preview does not supply server rendering or an SPA fallback.

In repository Settings → Pages, select **GitHub Actions** as Source. Every push to `main` builds and deploys only `site/`. No personal token is required by the workflow. The workflow derives the repository prefix and canonical origin from `github.repository`.

## Static adaptation and migration

React/TypeScript, Tailwind and Vinext render 34 localized routes plus the root locale selector at build time. Root selection runs in the browser: saved language, browser English, then Mongolian. Every detail page has HTML for direct navigation. Standard anchor links preserve the repository prefix; language switching retains page/project identity.

`lib/paths.ts`, `lib/link.tsx`, `vite.config.ts` and `scripts/finalize-pages.mjs` implement repository paths and static metadata. Vinext beta's native basePath and trailingSlash settings did not prerender this application correctly; the export finalizer converts flat HTML into directory index files and emits sitemap, robots and manifest. Keep this adapter until a tested migration replaces it.

Native Next.js App Router migration requires replacing injected path constants with environment configuration, restoring Next Link/basePath handling, reviewing the locale redirect and metadata handlers, and independently testing static export. Vinext/Next/Vercel compatibility is not guaranteed. No database or database migration is required.

## Content, images and contact

Typed bilingual content is in `content/site.ts`. Publish only reviewed facts. Omitted dates, roles and measurements must remain omitted until approved. News, careers and unavailable biographies have honest empty states. Private provenance records and the full source brochure are deliberately outside this repository and deployment artifact.

GBET supplied its logo and confirmed permission to use project imagery from its company brochure. `public/projects/ikh-tamir*.webp` is project photography; `sonsgolon-render.webp` is explicitly identified as a rendering; `railway-construction.webp` is a construction photograph. Permission for this website does not grant unrelated reuse. Replace images only with authorized files, update bilingual alt text/captions, and preserve image dimensions. Local Inter fonts retain their bundled license and Cyrillic support.

The contact form validates in MN/EN and opens a `mailto` draft to the published company email; it does not send a message or claim delivery. A future endpoint needs an explicit implementation with error/progress states and a public privacy review. GitHub Pages supplies no backend. No CMS, analytics, login or paid assets are configured.

The engineering viewer is optional and not mounted in the photographic homepage. Retain the static engineering presentation unless a replacement reaches the approved visual quality. Dormant viewer source is not proof of a delivered interactive feature.

## Validation

## Search appearance

The Mongolian homepage title is “Зураг төсөл, технологи-инженерийн зөвлөх ГБЭТ ХХК”; it uses an absolute title to avoid repeating the company suffix. The root includes WebSite structured data with the company name. Google decides the displayed title and site name after crawling. Its site-name feature does not support the `/gbet.mn/` subdirectory on GitHub Pages; a dedicated domain or subdomain is needed for a separately recognized site name. After connecting an owned domain, verify it in Google Search Console, submit the sitemap, and request indexing for the homepage. No ownership verification or indexing submission has been performed by this repository.

Local static validation: 34 localized routes, filters, locale switching, form validation, skip link, menu keyboard operation, reduced motion, 320/390/768/1440 widths and 200% text enlargement passed; no page errors or failed asset requests. Production build, lint and TypeScript checks are required on each deployment. These checks are not a WCAG certification or field Core Web Vitals guarantee.

The deployed GitHub Pages site uses `https://gbet.mn`. The workflow sets `GBET_PUBLIC_ORIGIN=https://gbet.mn`, which selects root asset paths, canonical URLs, sitemap and an exported CNAME. Set this variable locally when testing the custom-domain build. Without it, the adapter still supports repository-prefixed GitHub Pages builds. DNS and repository Pages settings must agree with the build origin; changing DNS alone is insufficient. No database migration is involved.
