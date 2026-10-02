"use client";
import { Component, lazy, Suspense, useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { text, ui, type Locale } from "../content/site";
import type { Part } from "./bridge-scene";
const Scene = lazy(() => import("./bridge-scene"));
const all: Part[] = ["deck", "piers", "cables", "foundations"];
const names: Record<Part, ReturnType<typeof text>> = {
  deck: text("Тавцан", "Deck"),
  piers: text("Тулгуур", "Piers"),
  cables: text("Татлага", "Cables"),
  foundations: text("Суурь", "Foundations"),
};
class Boundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function BridgeViewer({
  locale,
  technical = false,
}: {
  locale: Locale;
  technical?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [parts, setParts] = useState<Part[]>(all);
  const [explore, setExplore] = useState(technical);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { rootMargin: "100px" },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(m.matches);
    change();
    m.addEventListener("change", change);
    const timer = setTimeout(() => {
      const canvas = document.createElement("canvas");
      try {
        const gl = canvas.getContext("webgl2");
        if (!gl) {
          setFailed(true);
          return;
        }
        const weak = navigator.hardwareConcurrency <= 2;
        setFailed(weak);
        setReady(!weak);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setFailed(true);
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      m.removeEventListener("change", change);
    };
  }, []);
  const fallback = (
    <div className="bridge-fallback">
      <img
        src="/bridge-fallback.png"
        alt={
          locale === "mn"
            ? "Татлагат гүүрийн концепц: тавцан, тулгуур, пилон, татлага, суурь."
            : "Cable-stayed bridge concept with a deck, piers, pylon, stay cables and foundations."
        }
      />
    </div>
  );
  return (
    <motion.div
      ref={containerRef}
      className={`bridge-viewer ${technical ? "technical" : ""}`}
      initial={false}
      animate={{ opacity: 1 }}
    >
      <div
        className="scene"
        role="img"
        aria-label={
          locale === "mn"
            ? "Гүүрийн бүтцийн боловсролын концепц. Бодит төсөл болон бүтээцийн тооцоо биш."
            : "Educational bridge structure concept; not a real project or structural analysis."
        }
      >
        {ready && visible && !failed && !reduced ? (
          <Boundary fallback={fallback}>
            <Suspense fallback={fallback}>
              <Scene
                parts={parts}
                animate={!technical}
                onFail={() => setFailed(true)}
              />
            </Suspense>
          </Boundary>
        ) : (
          fallback
        )}
      </div>
      <div className="scene-caption">
        <span>
          01 / {locale === "mn" ? "БҮТЦИЙН КОНЦЕПЦ" : "STRUCTURAL CONCEPT"}
        </span>
        <span>GBET / ENGINEERING</span>
      </div>
      <div className="viewer-controls">
        <button aria-expanded={explore} onClick={() => setExplore(!explore)}>
          {locale === "mn" ? "Бүтцийг судлах" : "Explore structure"}
          <span aria-hidden="true">{explore ? "−" : "+"}</span>
        </button>
        {explore && (
          <div className="part-controls">
            <button
              aria-pressed={parts.length === all.length}
              onClick={() => setParts(all)}
            >
              {locale === "mn" ? "Бүтэц" : "Structure"}
            </button>
            {all.map((p) => (
              <button
                key={p}
                aria-pressed={parts.includes(p)}
                onClick={() =>
                  setParts(
                    parts.includes(p)
                      ? parts.filter((x) => x !== p)
                      : [...parts, p],
                  )
                }
              >
                {names[p][locale]}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="concept-note">
        {ui.concept[locale]}
        {(failed || reduced) && explore && (
          <span>
            {" "}
            ·{" "}
            {locale === "mn"
              ? "Статик дүрслэл: хэсгийн сонголт 3D горимд ажиллана."
              : "Static view: component visibility is available in 3D mode."}
          </span>
        )}
      </p>
      {explore && (
        <div className="selected-parts" aria-live="polite">
          <span>
            {locale === "mn" ? "Сонгосон хэсгүүд: " : "Selected elements: "}
          </span>
          {parts.map((p) => names[p][locale]).join(" · ") ||
            (locale === "mn" ? "Сонголтгүй" : "None selected")}
        </div>
      )}
    </motion.div>
  );
}
