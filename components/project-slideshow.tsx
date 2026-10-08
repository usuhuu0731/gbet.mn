"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import type { Locale } from "../content/site";
import type { MediaVariant } from "../content/media";
import Link from "../lib/link";
import { asset } from "../lib/paths";
import { useHydrated } from "../lib/use-hydrated";
import "./project-slideshow.css";

export interface ProjectSlide {
  slug: string;
  name: string;
  facts: string;
  image: {
    width: number;
    height: number;
    alt: string;
    position: string;
    mobilePosition?: string;
    variants: MediaVariant[];
    rendering: boolean;
  };
}

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const reducedMotionSnapshot = () => window.matchMedia(motionQuery).matches;
const serverReducedMotionSnapshot = () => true;
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const visibilitySnapshot = () => document.visibilityState === "visible";
const serverVisibilitySnapshot = () => false;

/** Only the first photograph is rendered on the server. Later images are
 * requested on demand, and the current photograph stays visible until loaded. */
export function ProjectSlideshow({
  locale,
  slides,
}: {
  locale: Locale;
  slides: ProjectSlide[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const loaded = useRef(new Set<number>());
  const pointerPlaybackIntent = useRef<boolean | null>(null);
  const automaticRequest = useRef(false);
  const hydrated = useHydrated();
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    reducedMotionSnapshot,
    serverReducedMotionSnapshot,
  );
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    visibilitySnapshot,
    serverVisibilitySnapshot,
  );
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState([0]);
  const [pending, setPending] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const playing =
    hydrated &&
    !paused &&
    !reducedMotion &&
    !hovered &&
    inView &&
    pageVisible &&
    slides.length > 1;

  const requestSlide = useCallback((index: number, automatic = false) => {
    automaticRequest.current = automatic;
    setFailed(false);
    if (loaded.current.has(index)) {
      setActive(index);
      setPending(null);
      return;
    }
    setPending(index);
    setMounted((current) =>
      current.includes(index) ? current : [...current, index],
    );
  }, []);

  useEffect(() => {
    const hero = root.current?.closest(".image-hero");
    if (!hero) return;
    const firstImage = root.current?.querySelector("img");
    if (firstImage?.complete && firstImage.naturalWidth) loaded.current.add(0);
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const focus = () => setPaused(true);
    const preferenceChanged = () => setPaused(true);
    const query = window.matchMedia(motionQuery);
    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25),
      { threshold: 0.25 },
    );
    observer.observe(hero);
    hero.addEventListener("mouseenter", enter);
    hero.addEventListener("mouseleave", leave);
    hero.addEventListener("focusin", focus);
    // A preference change never restarts a slideshow the visitor stopped.
    query.addEventListener("change", preferenceChanged);
    return () => {
      observer.disconnect();
      hero.removeEventListener("mouseenter", enter);
      hero.removeEventListener("mouseleave", leave);
      hero.removeEventListener("focusin", focus);
      query.removeEventListener("change", preferenceChanged);
    };
  }, []);

  useEffect(() => {
    if (!playing || pending !== null) return;
    const timer = window.setTimeout(
      () => requestSlide((active + 1) % slides.length, true),
      7000,
    );
    return () => window.clearTimeout(timer);
  }, [active, pending, playing, requestSlide, slides.length]);

  const select = (index: number) => {
    setPaused(true);
    requestSlide((index + slides.length) % slides.length);
  };
  const current = slides[active];
  if (!current) return null;
  const wantsPlayback = !paused && !reducedMotion;
  const copy =
    locale === "mn"
      ? {
          region: "Онцлох төслийн зургууд",
          previous: "Өмнөх төсөл",
          next: "Дараагийн төсөл",
          pause: "Зураг солигдохыг зогсоох",
          play: "Зургийг автоматаар солих",
          rendering: "Зураг төслийн дүрслэл",
          error: "Дараагийн зураг ачаалагдсангүй. Өөр зураг сонгоно уу.",
        }
      : {
          region: "Selected project photographs",
          previous: "Previous project",
          next: "Next project",
          pause: "Pause slideshow",
          play: "Play slideshow",
          rendering: "Design rendering",
          error: "The next image could not load. Please select another image.",
        };

  return (
    <div
      ref={root}
      className="hero-visual project-slideshow"
      role="region"
      aria-roledescription={locale === "mn" ? "Зургийн цомог" : "carousel"}
      aria-label={copy.region}
      aria-busy={pending !== null}
      data-active-project={current.slug}
      data-playing={playing}
    >
      {mounted.map((index) => {
        const slide = slides[index];
        const image = slide.image;
        const fallback = image.variants.at(-1)!;
        return (
          <picture
            key={slide.slug}
            className={`responsive-picture project-slide-picture ${index === 0 ? "hero-picture" : ""}`}
            data-active={index === active}
            style={
              {
                "--image-position": image.position,
                "--image-mobile-position":
                  image.mobilePosition || image.position,
              } as CSSProperties
            }
          >
            {/* Static export uses the existing local responsive media pipeline. */}
            <img
              src={asset(fallback.src)}
              srcSet={image.variants
                .map((variant) => `${asset(variant.src)} ${variant.width}w`)
                .join(", ")}
              sizes="100vw"
              width={image.width}
              height={image.height}
              alt={image.alt}
              aria-hidden={index !== active}
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              onLoad={() => {
                loaded.current.add(index);
                if (pending === index) {
                  // A slow image must not advance after the visitor paused,
                  // hid the tab, left the hero, or enabled reduced motion.
                  if (!automaticRequest.current || playing) setActive(index);
                  setPending(null);
                }
              }}
              onError={() => {
                if (pending === index || index === active) {
                  setPaused(true);
                  setFailed(true);
                  setPending(null);
                }
                if (index !== active)
                  setMounted((current) => current.filter((i) => i !== index));
              }}
            />
          </picture>
        );
      })}
      <div className="hero-shade" aria-hidden="true" />
      <div className="slideshow-caption" aria-live={playing ? "off" : "polite"}>
        <Link
          href={`/${locale}/projects/${current.slug}`}
          className="hero-image-caption"
        >
          {current.name}
          <span>{current.facts}</span>
          {current.image.rendering && (
            <span className="slide-rendering-label">{copy.rendering}</span>
          )}
        </Link>
      </div>
      {hydrated && slides.length > 1 && (
        <div className="slideshow-controls" aria-label={copy.region}>
          <button
            type="button"
            aria-label={copy.previous}
            onClick={() => select(active - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <div className="slideshow-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.slug}
                type="button"
                aria-label={slide.name}
                aria-pressed={active === index}
                onClick={() => select(index)}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label={copy.next}
            onClick={() => select(active + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
          {!reducedMotion && (
            <button
              className="slideshow-play"
              type="button"
              aria-label={wantsPlayback ? copy.pause : copy.play}
              onPointerDown={() => {
                // Focus pauses rotation before click; retain the pointer's
                // original intent so the first pause click cannot restart it.
                pointerPlaybackIntent.current = wantsPlayback;
              }}
              onClick={() => {
                setPaused(pointerPlaybackIntent.current ?? !paused);
                pointerPlaybackIntent.current = null;
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                {wantsPlayback ? (
                  <>
                    <path d="M3 2h3v12H3z" />
                    <path d="M10 2h3v12h-3z" />
                  </>
                ) : (
                  <path d="M4 2l10 6-10 6z" />
                )}
              </svg>
            </button>
          )}
        </div>
      )}
      {failed && (
        <p className="slideshow-error" role="status">
          {copy.error}
        </p>
      )}
    </div>
  );
}
