import { locales, nav, projects, site } from "../content/site";
export default function sitemap() {
  return locales.flatMap((locale) => [
    ...nav.map((n) => ({
      url: `${site.origin}/${locale}${n.path ? "/" + n.path : ""}`,
    })),
    ...projects.map((p) => ({
      url: `${site.origin}/${locale}/projects/${p.slug}`,
    })),
  ]);
}
