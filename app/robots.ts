import { site } from "../content/site";
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.origin}/sitemap.xml`,
  };
}
