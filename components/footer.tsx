import Link from "../lib/link";
import { nav, site, type Locale } from "../content/site";
export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <p>{site.description[locale]}</p>
        <nav aria-label={locale === "mn" ? "Доод цэс" : "Footer navigation"}>
          {nav.slice(1).map((n) => (
            <Link key={n.path} href={`/${locale}/${n.path}`}>
              {n.name[locale]}
            </Link>
          ))}
        </nav>
        <div>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p>{site.address[locale]}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.name[locale]}
        </span>
        <span>GBET LLC · gbet.mn · ULAANBAATAR, MONGOLIA</span>
      </div>
    </footer>
  );
}
