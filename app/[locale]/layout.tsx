import { asset, basePath } from "../../lib/paths";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/chrome";
import { SiteFooter } from "../../components/footer";
import { site, locales, type Locale } from "../../content/site";
import "../globals.css";
import "../../components/header-navigation.css";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale === "en" ? "en" : "mn";
  return {
    metadataBase: new URL(site.origin),
    title: { default: site.name[l], template: `%s | ${site.name[l]}` },
    description: site.description[l],
    icons: { icon: asset("/favicon.ico") },
    manifest: asset("/manifest.webmanifest"),
  };
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  return (
    <html lang={l}>
      <head>
        <link rel="stylesheet" href={asset("/fonts/inter.css")} />
        <link
          rel="preload"
          href={`${basePath}/fonts/inter-${l === "mn" ? "cyrillic" : "latin"}-400-normal.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {l === "mn" && (
          <link
            rel="preload"
            href={`${basePath}/fonts/inter-cyrillic-ext-400-normal.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <a className="skip" href="#main">
          {l === "mn" ? "Үндсэн агуулга руу" : "Skip to content"}
        </a>
        <SiteHeader locale={l} />
        {children}
        <SiteFooter locale={l} />
      </body>
    </html>
  );
}
