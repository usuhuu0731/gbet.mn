"use client";
import { asset, basePath } from "../lib/paths";
import Link from "../lib/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { nav, site, projects, type Locale } from "../content/site";
import { readFilters, filterQuery } from "../lib/project-filters";
import { useHydrated } from "../lib/use-hydrated";
import { CompanyAnniversary } from "./company-anniversary";
import { companyExperience } from "../content/company-history";
const primaryNav = ["projects", "expertise", "about"]
  .map((path) => nav.find((item) => item.path === path))
  .filter((item) => item !== undefined);

function fitMenuBelowHeader(header: HTMLElement | null) {
  if (!header) return;
  header.style.setProperty(
    "--menu-offset",
    `${Math.max(0, header.getBoundingClientRect().bottom)}px`,
  );
}
export function SiteHeader({ locale }: { locale: Locale }) {
  const { sinceYear, referenceYear } = companyExperience;
  const hasAnniversary = sinceYear !== null && referenceYear > sinceYear;
  const brandLabel = hasAnniversary
    ? `${site.name[locale]}, ${referenceYear - sinceYear} ${locale === "mn" ? "жилийн замнал" : "years of history"}, ${sinceYear}–${referenceYear}`
    : site.name[locale];
  const hydrated = useHydrated();
  const path = usePathname()
    .replace(new RegExp(`^${basePath}(?=/|$)`), "")
    .replace(/\/$/, "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const sync = () =>
      setQuery(
        path.endsWith("/projects")
          ? filterQuery(readFilters(window.location.search, projects))
          : "",
      );
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("gbet-filters", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("gbet-filters", sync);
    };
  }, [path]);
  const headerRef = useRef<HTMLElement>(null);
  const primaryNavRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const header = headerRef.current;
    const primary = primaryNavRef.current;
    const brand = header?.querySelector<HTMLElement>(".brand");
    const actions = header?.querySelector<HTMLElement>(".header-actions");
    if (!header || !primary || !brand || !actions) return;
    let active = true;
    const fitPrimaryNav = () => {
      if (!active) return;
      const leftEdge = brand.getBoundingClientRect().right;
      const rightEdge = actions.getBoundingClientRect().left;
      const width = primary.getBoundingClientRect().width;
      // Scale the wide-navigation breakpoint with the user's text size too.
      const minimumTextWidth =
        80 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const fits =
        window.matchMedia("(min-width: 1280px)").matches &&
        window.innerWidth >= minimumTextWidth &&
        width > 0 &&
        width + 48 <= rightEdge - leftEdge;
      primary.style.left = `${(leftEdge + rightEdge) / 2 - header.getBoundingClientRect().left}px`;
      if (!fits && primary.contains(document.activeElement)) {
        header.querySelector<HTMLButtonElement>(".menu-button")?.focus();
      }
      primary.dataset.fits = String(fits);
    };
    fitPrimaryNav();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(fitPrimaryNav);
    for (const element of [header, primary, brand, actions])
      observer?.observe(element);
    window.addEventListener("resize", fitPrimaryNav);
    void document.fonts.ready.then(fitPrimaryNav);
    return () => {
      active = false;
      observer?.disconnect();
      window.removeEventListener("resize", fitPrimaryNav);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const syncBounds = () => fitMenuBelowHeader(headerRef.current);
    syncBounds();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(syncBounds);
    if (headerRef.current) observer?.observe(headerRef.current);
    window.addEventListener("resize", syncBounds);
    window.addEventListener("scroll", syncBounds, { passive: true });
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        headerRef.current
          ?.querySelector<HTMLButtonElement>(".menu-button")
          ?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("resize", syncBounds);
      window.removeEventListener("scroll", syncBounds);
      observer?.disconnect();
    };
  }, [open]);
  return (
    <header
      ref={headerRef}
      onBlur={(event) => {
        if (
          open &&
          event.relatedTarget instanceof Node &&
          !headerRef.current?.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
      className={`header ${path === `/${locale}` ? "header-home" : ""} ${open ? "menu-open" : ""}`}
    >
      <Link
        href={`/${locale}`}
        className="brand"
        aria-label={brandLabel}
      >
        <img src={asset("/logo-mark.png")} alt="" width="44" height="44" />
        <span>
          GBET
          {hasAnniversary ? (
            <CompanyAnniversary locale={locale} />
          ) : (
            <small>CONSULTING ENGINEERS</small>
          )}
        </span>
      </Link>
      <nav
        ref={primaryNavRef}
        className="desktop-nav"
        aria-label={locale === "mn" ? "Үндсэн цэс" : "Main navigation"}
      >
        {primaryNav.map((n) => (
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
              href={path.replace(/^\/(mn|en)(?=\/|$)/, `/${l}`) + query}
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
          onClick={() => {
            if (!open) fitMenuBelowHeader(headerRef.current);
            setOpen(!open);
          }}
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
              aria-current={
                path === `/${locale}${n.path ? "/" + n.path : ""}`
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              <small aria-hidden="true">0{i + 1}</small>
              {n.name[locale]}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
