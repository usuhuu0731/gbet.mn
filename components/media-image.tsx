import type { CSSProperties } from "react";
import { media } from "../content/media";
import type { Locale } from "../content/site";
import { asset } from "../lib/paths";
export function MediaImage({
  id,
  locale,
  priority = false,
  sizes = "100vw",
  className = "",
}: {
  id: string;
  locale: Locale;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const image = media[id];
  if (!image?.usageApproved || !image.variants.length) return null;
  const fallback = image.variants.at(-1)!;
  return (
    <picture
      className={`responsive-picture ${className}`}
      style={
        {
          "--image-position": image.position,
          "--image-mobile-position": image.mobilePosition || image.position,
        } as CSSProperties
      }
    >
      <img
        src={asset(fallback.src)}
        srcSet={image.variants
          .map((v) => `${asset(v.src)} ${v.width}w`)
          .join(", ")}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt[locale]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
