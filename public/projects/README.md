# Owned project assets

Place approved photographs, renders and drawings under `<project-slug>/`, for example `ongi-river/hero.webp`. Prefer WebP/JPEG around 1600–2000 pixels wide; create responsive derivatives for galleries. Keep original engineering documents outside public unless explicitly cleared for publication.

Update the corresponding record in `content/site.ts` with local src, original source, copyrightOwner, usageApproved=true and accurate MN/EN alt text. An approval flag is a publication decision, not a copyright determination. Retain written permission privately. Do not hotlink or download news photos on the assumption that public availability grants reuse.

The current display uses `content/media-sources.json` as the central asset registry. Keep it synchronized with the project reference; register measured dimensions, desktop/mobile crop position, caption and quality here. Replacing a registered asset does not require editing page layouts. Staff portrait publication needs a separate approval and `kind: 'portrait'`; see `PROJECT_TEMPLATE.md`.

Unapproved/absent images render clear placeholders. PDF/PNG drawing thumbnails may be added here after approval; no private drawing upload or viewer endpoint exists in v1.

## Approved v1 imagery (2026-10-02)

The client confirmed that authorized project images were available and supplied the company portfolio PDF. Only three project pictures were extracted; the full PDF and private personnel pages are excluded from source and deployment.

- `ikh-tamir.webp` and mobile derivative: portfolio page 22, riverbank photograph; local WebP conversion, no AI retouching.
- `sonsgolon-render.webp`: page 4, design rendering, explicitly labeled as a rendering.
- `railway-construction.webp`: page 32, construction-stage photograph.

The client supplied these images for this Site. Photographer/render creator credits were not provided and are not invented. Supply credits when available. Keep each image mapped to its own project; do not substitute a similar bridge photograph. The original source and detailed claim review are private outside the Site checkout.

## Build pipeline

Run `npm run prepare:media`. Original source bytes are retained; generated WebP and project-specific MN/EN OG derivatives live in ignored `public/generated/`. Inputs are auto-oriented, EXIF is removed, resize never enlarges, and unchanged sources/settings reuse cached files. The exported `site/` contains only used derivatives and sanitized manifest; source photos and this README are not copied into the deployment artifact. The obsolete `ikh-tamir-mobile.webp` remains in the source checkout but is unused and not exported.

Check actual crops and detail at desktop, 4:3 mobile and high-DPR widths. Update `ogTitle` for an approved project-specific preview, using only verified names. See `PROJECT_TEMPLATE.md` for gallery/block maintenance.
