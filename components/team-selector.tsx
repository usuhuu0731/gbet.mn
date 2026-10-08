"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { Locale } from "../content/site";
import { useHydrated } from "../lib/use-hydrated";
import "./team-selector.css";

interface TeamSelectorMember {
  id: string;
  name: string;
  role: string;
  href: string;
  portrait: ReactNode;
  thumbnail: ReactNode;
}

// Portrait slots are rendered by the server. Only profile selection needs JavaScript.
export function TeamSelector({
  members,
  locale,
  contactHref,
}: {
  members: TeamSelectorMember[];
  locale: Locale;
  contactHref: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hydrated = useHydrated();
  const profileId = `${useId()}-profile`;
  const controls = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = members[selectedIndex];
  if (!selected) return null;

  return (
    <div className="team-selector" data-enhanced={hydrated}>
      <article className="team-selected-profile" id={profileId}>
        <div className="team-selected-portrait">{selected.portrait}</div>
        <div className="team-selected-copy">
          <span className="eyebrow">
            {locale === "mn" ? "ГБЭТ / МАНАЙ БАГ" : "GBET / OUR PEOPLE"}
          </span>
          <h3>{selected.name}</h3>
          <p className="team-selected-role">{selected.role}</p>
          <div className="team-selected-links">
            <a className="text-link" href={selected.href}>
              {locale === "mn" ? "Багтай танилцах" : "Meet the team"}
              <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href={contactHref}>
              {locale === "mn" ? "Холбоо барих" : "Get in touch"}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </article>
      <div className="team-selector-directory">
        <p className="team-selector-instruction">
          {locale === "mn"
            ? "Инженерчлэл. Хамтын ажиллагаа."
            : "Engineering. Collaboration."}
        </p>
        <ul
          className="team-selector-list"
          aria-label={locale === "mn" ? "Багийн гишүүд" : "Team members"}
        >
          {members.map((member, index) => {
            const content = (
              <>
                <span className="team-selector-thumbnail" aria-hidden="true">
                  {member.thumbnail}
                </span>
                <span className="team-selector-name">{member.name}</span>
                <span className="team-selector-role">{member.role}</span>
              </>
            );
            return (
              <li key={member.id}>
                {hydrated ? (
                  <button
                    type="button"
                    className="team-selector-choice"
                    aria-pressed={selectedIndex === index}
                    aria-controls={profileId}
                    ref={(element) => {
                      controls.current[index] = element;
                    }}
                    onClick={() => setSelectedIndex(index)}
                    onKeyDown={(event) => {
                      let next: number;
                      if (
                        event.key === "ArrowRight" ||
                        event.key === "ArrowDown"
                      )
                        next = (index + 1) % members.length;
                      else if (
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowUp"
                      )
                        next = (index - 1 + members.length) % members.length;
                      else if (event.key === "Home") next = 0;
                      else if (event.key === "End") next = members.length - 1;
                      else return;
                      event.preventDefault();
                      setSelectedIndex(next);
                      controls.current[next]?.focus();
                    }}
                  >
                    {content}
                  </button>
                ) : (
                  <a className="team-selector-choice" href={member.href}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <span className="team-selector-announcement" role="status">
        {selectedIndex > 0 || hydrated
          ? `${selected.name} · ${selected.role}`
          : ""}
      </span>
    </div>
  );
}
