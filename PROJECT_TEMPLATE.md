# Content and media maintenance

## Project

Create a stable slug in `content/site.ts` and supply MN/EN name, location and summary. Include only approved role, year, client, status, bridge type and dimensions. Missing fields remain absent, including in metadata. Keep all nine existing project URLs stable.

Keep claim-by-claim evidence, dates, contradictions and publication decisions in the private review folder outside this repository. Do not put confidential evidence in JSON, public assets, disabled frontend objects or source commits. Existing founding-year and Naadamchid measurement conflicts remain unpublished.

Register approved imagery in `content/media.ts` under the project slug: public-relative path, measured width/height, photograph/rendering/concept kind, MN/EN alt text and crop position. Preserve the matching project's image record for its source/type reference. Keep concepts separate from actual project records. New image files require explicit rights for this website; never hotlink or copy reference-site pictures.

Use WebP with enough source pixels for its display. For a full-height mobile hero, check the cropped region's effective resolution rather than choosing a source by width alone. The current hero retains its original source on phones because the smaller 900×562 derivative visibly upscaled; an authorized portrait crop can later reduce bytes while retaining detail. Check crop at 320/390/768/1440 widths. Run `npm run build` and `npm run check:site` after replacing assets.

## Team

Add only approved current staff to `content/team.ts`, with stable id, MN/EN professional name and role. Preserve supplied spelling until a Latin version is confirmed. Biographies are optional and must be reviewed.

Portraits: get separate website-publication permission, place the image in `public/team/`, register it in `content/media.ts` with kind `portrait`, and set `portraitId` on the member. Use a 4:5 portrait, consistent neutral background and reviewed alt text. Update dimensions from the actual file. Missing/unapproved portraits use the graphite placeholder automatically. Source identity/diploma scans never belong in public/team.

Keep images awaiting permission outside this repository and public/. A false display flag does not protect a publicly served file.

## Director's message

The message is a publication-approved company statement, not an invented quotation. Review the private MN/EN draft first. Copy approved paragraphs into `directorMessage.paragraphs` and set `approved:true`. Until then keep the public array empty. The layout is already implemented on the about page.

## Contact and release

The current mailto transport cannot report delivery. Implement and test a backend separately before connecting an endpoint. Document payload handling, errors, progress and privacy; GitHub Pages itself cannot receive submissions.

Keep the domain origin, Pages settings and CNAME consistent. Preserve the Google verification file. Validate existing and new routes, filters, locale switching, form states, keyboard, axe, reduced motion, 200% text and image loading. Update the route-count assertion if intentionally adding/removing a page. No database migration is required.
