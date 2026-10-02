import { site, services, type Locale } from "../content/site";
export function StructuredData({
  locale,
  path,
  title,
  servicePage = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  servicePage?: boolean;
}) {
  const url = `${site.origin}/${locale}/${path}`;
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: locale === "mn" ? "Нүүр" : "Home",
      item: `${site.origin}/${locale}`,
    },
  ];
  if (path.startsWith("projects/"))
    items.push({
      "@type": "ListItem",
      position: 2,
      name: locale === "mn" ? "Төслүүд" : "Projects",
      item: `${site.origin}/${locale}/projects`,
    });
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: title,
    item: url,
  });
  const data: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    },
  ];
  if (servicePage)
    for (const s of services)
      data.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.title[locale],
        description: s.copy[locale],
        provider: {
          "@type": "Organization",
          name: site.name[locale],
          url: `${site.origin}/${locale}`,
        },
      });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
