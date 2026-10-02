import LocaleRedirect from "../../components/locale-redirect";
import { site } from "../../content/site";
export const metadata = {
  title: site.homeTitle.mn,
  description: site.description.mn,
  alternates: { canonical: `${site.origin}/` },
  openGraph: { title: site.homeTitle.mn, siteName: site.name.mn, url: `${site.origin}/`, type: "website" },
};
export default function Entry() {
  return <>
    <LocaleRedirect />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name.mn,
      alternateName: [site.name.en, "GBET"],
      url: `${site.origin}/`,
    }).replace(/</g, "\\u003c")}} />
  </>;
}
