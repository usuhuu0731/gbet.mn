"use client";
import { asset, basePath } from "../lib/paths";
import Link from "../lib/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { nav, site, type Locale } from "../content/site";
import { useHydrated } from "../lib/use-hydrated";
export function SiteHeader({ locale }: { locale: Locale }) {
  const hydrated = useHydrated();
  const path = usePathname()
    .replace(new RegExp(`^${basePath}(?=/|$)`), "")
    .replace(/\/$/, "");
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        headerRef.current
          ?.querySelector<HTMLButtonElement>(".menu-button")
          ?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header
      ref={headerRef}
      className={`header ${path === `/${locale}` ? "header-home" : ""} ${open ? "menu-open" : ""}`}
    >
      <Link
        href={`/${locale}`}
        className="brand"
        aria-label={site.name[locale]}
      >
        <img src={asset("/logo-mark.png")} alt="" width="44" height="44" />
        <span>
          GBET<small>CONSULTING ENGINEERS</small>
        </span>
      </Link>
      <nav
        className="desktop-nav"
        aria-label={locale === "mn" ? "Үндсэн цэс" : "Main navigation"}
      >
        {nav.slice(1, 5).map((n) => (
          <Link
            key={n.path}
            href={`/${locale}/${n.path}`}
            aria-current={path === `/${locale}/${n.path}` ? "page" : undefined}
          >
            {n.name[locale]}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <div
          className="language"
          aria-label={locale === "mn" ? "Хэл сонгох" : "Language"}
        >
          {(["mn", "en"] as const).map((l) => (
            <Link
              key={l}
              href={path.replace(/^\/(mn|en)(?=\/|$)/, `/${l}`)}
              lang={l}
              aria-current={locale === l ? "true" : undefined}
              onClick={() => {
                document.cookie = `gbet-locale=${l}; Path=${basePath || "/"}; Max-Age=31536000; SameSite=Lax`;
                setOpen(false);
              }}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <Link className="header-contact" href={`/${locale}/contact`}>
          {locale === "mn" ? "Холбоо барих" : "Get in touch"}
        </Link>
        <button
          className="menu-button"
          aria-expanded={open}
          aria-controls="expanded-menu"
          disabled={!hydrated}
          onClick={() => setOpen(!open)}
        >
          {open
            ? locale === "mn"
              ? "Хаах"
              : "Close"
            : locale === "mn"
              ? "Цэс"
              : "Menu"}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </div>
      {open && (
        <nav
          id="expanded-menu"
          className="mega-menu"
          aria-label={locale === "mn" ? "Бүх хуудас" : "All pages"}
        >
          {nav.map((n, i) => (
            <Link
              key={n.path}
              href={`/${locale}${n.path ? "/" + n.path : ""}`}
              onClick={() => setOpen(false)}
            >
              <small>0{i + 1}</small>
              {n.name[locale]}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <p className="eyebrow">GBET / CONSULTING ENGINEERS</p>
          <h2>
            {locale === "mn"
              ? "Холболтыг инженерчилнэ."
              : "Engineering connections."}
          </h2>
        </div>
        <Link className="button light" href={`/${locale}/contact`}>
          {locale === "mn" ? "Төслийн талаар ярилцах" : "Discuss a project"}
        </Link>
      </div>
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
