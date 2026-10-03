"use client";
import { useState, useEffect } from "react";
import { categories, ui, type Locale, type Project } from "../content/site";
import {
  readFilters,
  filterQuery,
  emptyFilters,
  type FilterKey,
} from "../lib/project-filters";
import { ProjectCard } from "./projects";
import { useHydrated } from "../lib/use-hydrated";
export function ProjectFilter({
  projects,
  locale,
}: {
  projects: Project[];
  locale: Locale;
}) {
  const hydrated = useHydrated();
  const [filters, setFilters] = useState(emptyFilters);
  useEffect(() => {
    const sync = () =>
      setFilters(readFilters(window.location.search, projects));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [projects]);
  function update(key: FilterKey, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    window.history.pushState(
      null,
      "",
      window.location.pathname + filterQuery(next),
    );
    window.dispatchEvent(new Event("gbet-filters"));
  }
  const { category, year, location, status } = filters;
  const filtered = projects.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (year === "all" || String(p.year) === year) &&
      (location === "all" || p.locationId === location) &&
      (status === "all" || p.statusId === status),
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
              disabled={!hydrated}
              onClick={() => update("category", value)}
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
              set: (value: string) => update("year", value),
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
              set: (value: string) => update("location", value),
              values: [...new Set(projects.map((p) => p.locationId))],
            },
            {
              name: locale === "mn" ? "Төлөв" : "Status",
              value: status,
              set: (value: string) => update("status", value),
              values: [...new Set(projects.map((p) => p.statusId))],
            },
          ].map((f) => (
            <label key={f.name}>
              {f.name}
              <select
                aria-label={f.name}
                value={f.value}
                disabled={!hydrated}
                onChange={(e) => f.set(e.target.value)}
              >
                <option value="all">{ui.all[locale]}</option>
                {f.values.map((v) => (
                  <option key={v} value={v}>
                    {projects.find((p) => p.locationId === v)?.location[
                      locale
                    ] ||
                      projects.find((p) => p.statusId === v)?.status[locale] ||
                      v}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            className="reset"
            disabled={!hydrated}
            onClick={() => {
              setFilters(emptyFilters);
              window.history.pushState(null, "", window.location.pathname);
              window.dispatchEvent(new Event("gbet-filters"));
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
