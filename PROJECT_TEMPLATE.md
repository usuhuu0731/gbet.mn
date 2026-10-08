# Content and media maintenance

## Project

Create a stable slug in `content/site.ts` and supply MN/EN name, location and summary. Include only approved role, year, client, status, bridge type and dimensions. Missing fields remain absent, including in metadata. Keep all nine existing project URLs stable.

Keep claim-by-claim evidence, dates, contradictions and publication decisions in the private review folder outside this repository. Do not put confidential evidence in JSON, public assets, disabled frontend objects or source commits. Existing founding-year and Naadamchid measurement conflicts remain unpublished.

Register approved imagery in `content/media-sources.json` under the project slug: public-relative path, measured width/height, photograph/rendering/concept kind, MN/EN alt text and crop position. Preserve the matching project's image record for its source/type reference. Keep concepts separate from actual project records. New image files require explicit rights for this website; never hotlink or copy reference-site pictures.

Keep adequate original pixels and the correct EXIF orientation. Register the actual oriented width/height, bilingual alt/caption, `position` and optional `mobilePosition`, quality and website approval. Portrait variants use 320/480/640px; project variants use 480/768/1024/1440/1920px capped at original width. Sharp never enlarges sources. Existing source bytes remain unchanged; derivatives, cache and manifests are generated before build/QA.

The phone hero is 4:3 and does not reuse the obsolete full-height crop. Check its main bridge structure at 320/390/768/1440 widths and higher device pixel ratios. Review colors and fine concrete/steel detail before reducing an individual image's quality. A new source needs permission before entering public/ or this public repository.

## Case study blocks

`Project.caseStudy` is optional. The discriminated union in `content/case-study.ts` supports `text` (`body`, optional `title`), `image`/`diagram` (`mediaId`, optional `caption`), `gallery` (`mediaIds`, optional `title`), `facts` (localized label/value items), and `relatedProjects` (`slugs`). Keep only publication-ready blocks in this data; no draft flags or unreviewed hidden text. Missing fields/sections are omitted. Without custom blocks, the detail uses its existing summary and related projects, with a facts rail and an approved initial image when available. Without an approved photograph, omit the image panel and gallery trigger; retain the compact photography note, facts and text.

Gallery IDs must refer to approved media from that project. One approved photograph is enough for a useful zoom dialog; never duplicate it to imply a larger gallery or substitute another bridge. The dialog has close/Escape, keyboard previous/next for multiple images, captions, native focus containment and focus return. A new gallery should be exercised with keyboard and touch after entry.

OG previews use approved imagery and the supplied `ogTitle.mn/en` (explicit line breaks are supported). Use a source at least 1200×630 for this compositor; images without an OG entry use the brand fallback. Do not fabricate photographer credits or put private provenance in captions.

## Team

Add only approved current staff to `content/team.ts`, with stable id, MN/EN professional name and role. Preserve supplied spelling until a Latin version is confirmed. Biographies are optional and must be reviewed.

Home/about selectors read the same team array. Keep each name and role visible with its thumbnail; do not make identity depend on hover. The first member is the default large profile. Check keyboard selection and no-JavaScript links to `/team/#id` after reordering. The separate full directory stays available.

Portraits: get separate website-publication permission, place the image in `public/team/`, register it in `content/media-sources.json` with kind `portrait`, and set `portraitId` on the member. Use the supplied portrait with a reviewed 4:5 crop and accurate alt text; do not synthesize identities or alter the image to force a neutral background. Update dimensions from the actual file. Missing/unapproved portraits use the graphite placeholder automatically. Source identity/diploma scans never belong in public/team.

Keep images awaiting permission outside this repository and public/. A false display flag does not protect a publicly served file.

## Header anniversary and rotating project images

The company confirmed operating history from “Ундрага” LLC in 1996 and the GBET LLC name from 2006. Maintain both stages in `content/company-history.ts`; the badge counts operating history from 1996. Do not treat this as a GBET incorporation date or add an assumed `foundingDate` to structured data. Review the explicit reference year before publication; the static badge does not update itself at New Year. Keep private evidence outside this repository.

The homepage slideshow list uses existing project slugs and the media registry. Only approved image variants may be selected. Preserve photograph/rendering labels, actual project captions and locale links. Only the first image should be present in initial HTML; subsequent images load on request. Every added slide must work with manual controls, pause, reduced motion, slow/failed image loads and keyboard focus. Keep the existing 4:3 mobile composition and test long captions at 200% text size.

## Licence records

Maintain the sanitized text in `content/licences.ts`. Transcribe certificate numbers, issue dates, printed terms and activity wording from supplied evidence. Keep activity codes distinct from statutory article references. A printed term is not a live standing check; do not label a certificate as currently active or generate a legal expiry date from arithmetic. A public-source link is optional and must support that record. Never fabricate a source URL for a privately supplied certificate. Original scans, signatures, seals and legal-reference source images stay outside the repository and `public/`.

## Partner organizations

Maintain the public name/link list in `content/partners.ts`; `PartnersSection` renders it on both the home and about pages in MN/EN without client JavaScript. Confirm the intended organization when names are ambiguous. Preserve the supplied legal form in MN and use the verified English name or a plain translation without guessing a legal suffix. Links point to the organization's website, not evidence of a partnership. The client confirmed the six initial entries on 2026-10-08, including the Urban Planning and Research Institute. Add separately approved local logos only if provided; the current design uses typography and no external image requests. Keep source documents and private relationship verification outside public content and repository history.

## Director's message

The message is a publication-approved company statement, not an invented quotation. Review the private MN/EN draft first. Copy approved paragraphs into `directorMessage.paragraphs` and set `approved:true`. Until then keep the public array empty. The layout is already implemented on the about page.

## Contact and release

The current mailto transport cannot report delivery. Implement and test a backend separately before connecting an endpoint. Document payload handling, errors, progress and privacy; GitHub Pages itself cannot receive submissions.

Keep the domain origin, Pages settings and CNAME consistent. Preserve the Google verification file. Validate existing and new routes, filters, locale switching, form states, keyboard, axe, reduced motion, 200% text and image loading. The route check derives its expected set from authored content; verify both custom-domain and repository-prefix exports when adding/removing a route. Use stable `locationId` and `statusId` values shared across languages. No database migration is required.

## Editorial presentation maintenance — 2026-10-08

The `design/editorial-engineering` revision starts from `761a1bd92071aa40892024bd25480a6a570cb65b` and was first delivered for local review. The user separately requested deployment on 2026-10-08; its CI, deployment and live verification evidence belongs in ignored `outputs/deployment-release-editorial.json`. Dependencies, lockfile, media generation, export adapter and hosting are unchanged.

The initial homepage imagery is Ikh Tamir in the hero, Sonsgolon in the feature and the railway in engineering. The later requested slideshow can present those same three approved images in the hero on demand; retain only the first slide in initial HTML. Use text links for additional selected projects. The project index derives photographic or text-only presentation from approved media in the registry and preserves authored order, total count and filter behavior. Do not add a second image-availability flag or restore large blank image cards. `ProjectImage.presentation` chooses `feature`, `index-feature`, `index` or `detail`; review its responsive `sizes` against the actual gutter and column width when changing a placement.

The generic SVG on engineering is explanatory content, not project media. Keep that distinction in its caption, retain MN/EN descriptions without JavaScript, and preserve keyboard selection and reduced-motion behavior. Do not add project dimensions, performance claims or invented calculation results to the diagram. Header edits must retain measured desktop-link clearance, enlarged-text collapse and the complete menu. Team identity, roles, portrait rights and crops remain governed by the existing approval rules above.

`scripts/capture-editorial.mjs` captures 52 before/after views across both languages and desktop/mobile sizes; select a unique `QA_REPORT_TAG` for each review. Use `QA_LAB_INTERACTION=schematic` for separate diagram interaction measurements and the optional third argument to `scripts/compare-ui-performance.mjs` for a new comparison report path. Commands and environment setup are in README. Capture counts describe the script's coverage, not a claim that a particular revision has passed review.
