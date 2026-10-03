import sources from "./media-sources.json";
import generated from "./generated-media.json";
import type { Localized, Locale } from "./site";
export interface MediaVariant {
  src: string;
  width: number;
  height: number;
}
export interface MediaAsset {
  id: string;
  src: string;
  width: number;
  height: number;
  kind: "photograph" | "rendering" | "portrait" | "concept";
  alt: Localized;
  caption: Localized;
  position: string;
  mobilePosition?: string;
  source: string;
  usageApproved: boolean;
  credit?: Localized;
  variants: MediaVariant[];
  og?: Partial<Record<Locale, MediaVariant>>;
}
const prepared = generated as Record<
  string,
  {
    width: number;
    height: number;
    variants: MediaVariant[];
    og: Partial<Record<Locale, MediaVariant>>;
  }
>;
export const media: Record<string, MediaAsset> = Object.fromEntries(
  Object.entries(sources).map(([id, source]) => [
    id,
    {
      ...source,
      id,
      kind: source.kind as MediaAsset["kind"],
      ...prepared[id],
      variants: prepared[id]?.variants || [],
    },
  ]),
) as Record<string, MediaAsset>;
