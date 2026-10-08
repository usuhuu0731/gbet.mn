"use client";

import { useId, useState } from "react";
import type { Locale } from "../content/site";
import { useHydrated } from "../lib/use-hydrated";
import "./bridge-schematic.css";

type BridgePart = "deck" | "piers" | "foundations";

const parts: {
  id: BridgePart;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}[] = [
  {
    id: "deck",
    title: { mn: "Алгасал байгууламж", en: "Superstructure" },
    description: {
      mn: "Алгасал байгууламж нь зорчих хэсгийг түшиж, түүнд үйлчлэх ачааллыг тулгуурт дамжуулна.",
      en: "The superstructure supports the crossing and transfers its loads to the supports below.",
    },
  },
  {
    id: "piers",
    title: { mn: "Тулгуур", en: "Piers" },
    description: {
      mn: "Тулгуур нь алгасал байгууламжийг түшиж, түүнээс ирэх ачааллыг суурьт дамжуулна.",
      en: "The piers support the superstructure and transfer its loads to the foundations.",
    },
  },
  {
    id: "foundations",
    title: { mn: "Суурь", en: "Foundations" },
    description: {
      mn: "Суурь нь гүүрийн бүтцээс ирэх ачааллыг ул хөрсөнд дамжуулна.",
      en: "The foundations transfer loads from the bridge structure into the supporting ground.",
    },
  },
];

// A fixed axonometric projection, in illustration units, keeps each face aligned.
// This is an educational diagram, not a structural model or project geometry.
const point = (x: number, y: number, z: number) =>
  `${58 + x * 1.15 + y * 0.65},${360 - x * 0.32 + y * 0.46 - z}`;

function Block({
  x,
  y,
  z,
  length,
  width,
  height,
  className = "",
}: {
  x: number;
  y: number;
  z: number;
  length: number;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <g className={`bridge-block ${className}`}>
      <polygon
        className="bridge-face-end"
        points={[
          point(x, y, z),
          point(x, y + width, z),
          point(x, y + width, z + height),
          point(x, y, z + height),
        ].join(" ")}
      />
      <polygon
        className="bridge-face-front"
        points={[
          point(x, y + width, z),
          point(x + length, y + width, z),
          point(x + length, y + width, z + height),
          point(x, y + width, z + height),
        ].join(" ")}
      />
      <polygon
        className="bridge-face-top"
        points={[
          point(x, y, z + height),
          point(x + length, y, z + height),
          point(x + length, y + width, z + height),
          point(x, y + width, z + height),
        ].join(" ")}
      />
    </g>
  );
}

export function BridgeSchematic({ locale }: { locale: Locale }) {
  const instanceId = useId();
  const hydrated = useHydrated();
  const [selected, setSelected] = useState<BridgePart>("deck");
  const headingId = `${instanceId}-heading`;
  const diagramTitleId = `${instanceId}-diagram-title`;
  const diagramCaptionId = `${instanceId}-diagram-caption`;
  const supportPositions = [18, 190, 362, 530];

  return (
    <section className="bridge-schematic" aria-labelledby={headingId}>
      <header className="bridge-schematic-heading">
        <p className="eyebrow">
          {locale === "mn" ? "БҮТЦИЙН ЛОГИК" : "STRUCTURAL PRINCIPLES"}
        </p>
        <h2 id={headingId}>
          {locale === "mn"
            ? "Бүтцийн ерөнхий тайлбар."
            : "Understanding the structure."}
        </h2>
      </header>
      <div className="bridge-schematic-layout">
        <figure className="bridge-schematic-figure">
          <div className="bridge-schematic-drawing">
            <svg
              viewBox="12 2 820 440"
              width="820"
              height="440"
              role="img"
              aria-labelledby={diagramTitleId}
              aria-describedby={diagramCaptionId}
            >
              <title id={diagramTitleId}>
                {locale === "mn"
                  ? "Алгасал байгууламж, тулгуур, суурийг харуулсан гүүрийн ерөнхий схем"
                  : "An illustrative bridge showing its superstructure, piers and foundations"}
              </title>
              <g className="bridge-datum" aria-hidden="true">
                <polygon
                  points={[
                    point(-16, -28, -1),
                    point(582, -28, -1),
                    point(582, 142, -1),
                    point(-16, 142, -1),
                  ].join(" ")}
                />
                {supportPositions.map((x) => (
                  <line
                    key={x}
                    x1={58 + x * 1.15 - 9}
                    y1={360 - x * 0.32 - 7}
                    x2={58 + x * 1.15 + 82}
                    y2={360 - x * 0.32 + 61}
                  />
                ))}
              </g>
              <g
                data-bridge-part="foundations"
                data-active={selected === "foundations"}
              >
                {supportPositions.map((x) => (
                  <Block
                    key={x}
                    x={x - 22}
                    y={5}
                    z={0}
                    length={52}
                    width={100}
                    height={15}
                  />
                ))}
              </g>
              <g data-bridge-part="piers" data-active={selected === "piers"}>
                {supportPositions.map((x) => (
                  <g key={x}>
                    <Block
                      x={x - 2}
                      y={25}
                      z={15}
                      length={12}
                      width={60}
                      height={95}
                    />
                    <Block
                      x={x - 10}
                      y={12}
                      z={110}
                      length={28}
                      width={86}
                      height={13}
                    />
                  </g>
                ))}
              </g>
              <g data-bridge-part="deck" data-active={selected === "deck"}>
                {[9, 36, 63, 90].map((y) => (
                  <Block
                    key={y}
                    x={0}
                    y={y}
                    z={123}
                    length={560}
                    width={10}
                    height={15}
                    className="bridge-girder"
                  />
                ))}
                <Block
                  x={0}
                  y={0}
                  z={138}
                  length={560}
                  width={110}
                  height={10}
                />
                <path
                  className="bridge-centerline"
                  d={`M${point(7, 55, 148.5)} L${point(553, 55, 148.5)}`}
                />
                {[0, 106].map((y) => (
                  <Block
                    key={y}
                    x={0}
                    y={y}
                    z={148}
                    length={560}
                    width={4}
                    height={8}
                  />
                ))}
              </g>
            </svg>
          </div>
          <figcaption id={diagramCaptionId}>
            {locale === "mn"
              ? "Тайлбарлах зориулалттай ерөнхий схем. ГБЭТ-ийн тодорхой төслийн геометр, хэмжээсийг илэрхийлэхгүй."
              : "A general explanatory diagram. It does not represent the geometry or dimensions of a specific GBET project."}
          </figcaption>
        </figure>
        <div
          className="bridge-schematic-parts"
          role="group"
          aria-label={
            locale === "mn"
              ? "Гүүрийн бүтцийн хэсгүүд"
              : "Bridge structural parts"
          }
        >
          {parts.map((part, index) => {
            const descriptionId = `${instanceId}-${part.id}-description`;
            return (
              <div
                className="bridge-schematic-part"
                key={part.id}
                data-active={selected === part.id}
              >
                <button
                  type="button"
                  disabled={!hydrated}
                  data-bridge-control={part.id}
                  aria-pressed={selected === part.id}
                  aria-describedby={descriptionId}
                  onClick={() => setSelected(part.id)}
                >
                  <span className="bridge-part-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span>{part.title[locale]}</span>
                  <span className="bridge-part-marker" aria-hidden="true" />
                </button>
                <p id={descriptionId}>{part.description[locale]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
