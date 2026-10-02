"use client";
import { useState } from "react";
import { categories, ui, type Locale, type Project } from "../content/site";
import { ProjectCard } from "./projects";
export function ProjectFilter({
  projects,
  locale,
}: {
  projects: Project[];
  locale: Locale;
}) {
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");
  const filtered = projects.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (year === "all" || String(p.year) === year) &&
      (location === "all" || p.location[locale] === location) &&
      (status === "all" || p.status[locale] === status),
  );
  return (
    <>
      <div className="filters">
        <div
          className="filter-tabs"
          aria-label={locale === "mn" ? "Төслийн төрөл" : "Project category"}
        >
          {[
            ["all", ui.all[locale]],
            ...Object.entries(categories).map(([key, value]) => [
              key,
              value[locale],
            ]),
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filter-selects">
          {[
            {
              name: locale === "mn" ? "Он" : "Year",
              value: year,
              set: setYear,
              values: [
                ...new Set(
                  projects
                    .filter((p) => p.year !== undefined)
                    .map((p) => String(p.year)),
                ),
              ]
                .sort()
                .reverse(),
            },
            {
              name: locale === "mn" ? "Байршил" : "Location",
              value: location,
              set: setLocation,
              values: [...new Set(projects.map((p) => p.location[locale]))],
            },
            {
              name: locale === "mn" ? "Төлөв" : "Status",
              value: status,
              set: setStatus,
              values: [...new Set(projects.map((p) => p.status[locale]))],
            },
          ].map((f) => (
            <label key={f.name}>
              {f.name}
              <select
                aria-label={f.name}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
              >
                <option value="all">{ui.all[locale]}</option>
                {f.values.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          ))}
          <button
            className="reset"
            onClick={() => {
              setCategory("all");
              setYear("all");
              setLocation("all");
              setStatus("all");
            }}
          >
            {locale === "mn" ? "Цэвэрлэх" : "Reset"}
          </button>
        </div>
      </div>
      <p className="results-count" aria-live="polite">
        {filtered.length} {locale === "mn" ? "төсөл" : "projects"}
      </p>
      <div className="project-grid">
        {filtered.map((p) => (
          <ProjectCard key={p.slug} project={p} locale={locale} />
        ))}
      </div>
      {!filtered.length && (
        <p className="empty">
          {locale === "mn"
            ? "Энэ сонголтод тохирох төсөл олдсонгүй. Шүүлтүүрээ өөрчилнө үү."
            : "No projects match these filters. Try another selection."}
        </p>
      )}
    </>
  );
}
