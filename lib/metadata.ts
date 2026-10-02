import type { Metadata } from "next";
import { site, type Locale } from "../content/site";
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description = site.description[locale],
): Metadata {
  const suffix = path ? `/${path}` : "";
  const url = `${site.origin}/${locale}${suffix}/`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        mn: `${site.origin}/mn${suffix}/`,
        en: `${site.origin}/en${suffix}/`,
        "x-default": `${site.origin}/mn${suffix}/`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name[locale],
      locale: locale === "mn" ? "mn_MN" : "en_US",
      alternateLocale: locale === "mn" ? "en_US" : "mn_MN",
      type: "website",
      images: [
        {
          url: `${site.origin}/opengraph.jpg`,
          width: 1200,
          height: 630,
          alt: site.name[locale],
        },
      ],
    },
  };
}
