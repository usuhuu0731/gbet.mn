"use client";
import { useRef, useState, useId, type ReactNode } from "react";
import type { Locale } from "../content/site";
import { media } from "../content/media";
import { MediaImage } from "./media-image";
import { useHydrated } from "../lib/use-hydrated";
export function ImageGallery({
  ids,
  locale,
  children,
}: {
  ids: string[];
  locale: Locale;
  children?: ReactNode;
}) {
  const approved = ids.filter((id) => media[id]?.usageApproved);
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId(),
    hydrated = useHydrated();
  if (!approved.length) return null;
  const current = media[approved[index]];
  const move = (step: number) =>
    setIndex((i) => (i + step + approved.length) % approved.length);
  const open = (i: number) => {
    setIndex(i);
    setIsOpen(true);
    dialog.current?.showModal();
  };
  return (
    <div className="gallery">
      {children || (
        <div className="gallery-strip">
          {approved.map((id) => (
            <MediaImage
              key={id}
              id={id}
              locale={locale}
              sizes="(max-width: 767px) 90vw, 60vw"
            />
          ))}
        </div>
      )}
      <button
        ref={trigger}
        disabled={!hydrated}
        type="button"
        className="gallery-open"
        aria-haspopup="dialog"
        onClick={() => open(0)}
      >
        {locale === "mn" ? "Зураг дэлгэрүүлэх" : "Expand image"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <dialog
        ref={dialog}
        className="image-dialog"
        aria-labelledby={titleId}
        onClose={() => {
          setIsOpen(false);
          trigger.current?.focus();
        }}
        onKeyDown={(e) => {
          if (approved.length < 2) return;
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        <div className="dialog-bar">
          <h2 id={titleId}>
            {locale === "mn" ? "Төслийн дүрслэл" : "Project imagery"}
          </h2>
          <button
            type="button"
            autoFocus
            className="dialog-close"
            onClick={() => dialog.current?.close()}
          >
            {locale === "mn" ? "Хаах" : "Close"}{" "}
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <figure>
          {isOpen && (
            <MediaImage id={current.id} locale={locale} sizes="90vw" priority />
          )}
          <figcaption>
            {current.caption[locale]}
            {current.credit && <span>{current.credit[locale]}</span>}
          </figcaption>
        </figure>
        {approved.length > 1 && (
          <div className="dialog-controls">
            <button type="button" onClick={() => move(-1)}>
              {locale === "mn" ? "Өмнөх" : "Previous"}
            </button>
            <span aria-live="polite">
              {index + 1} / {approved.length}
            </span>
            <button type="button" onClick={() => move(1)}>
              {locale === "mn" ? "Дараах" : "Next"}
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
