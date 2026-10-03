import type { Project } from "../content/site";
export const filterKeys = ["category", "year", "location", "status"] as const;
export type FilterKey = (typeof filterKeys)[number];
export type FilterState = Record<FilterKey, string>;
export const emptyFilters: FilterState = {
  category: "all",
  year: "all",
  location: "all",
  status: "all",
};
export function readFilters(search: string, projects: Project[]): FilterState {
  const query = new URLSearchParams(search);
  const options: Record<FilterKey, string[]> = {
    category: projects.map((p) => p.category),
    year: projects.filter((p) => p.year).map((p) => String(p.year)),
    location: projects.map((p) => p.locationId),
    status: projects.map((p) => p.statusId),
  };
  return Object.fromEntries(
    filterKeys.map((key) => [
      key,
      options[key].includes(query.get(key) || "") ? query.get(key)! : "all",
    ]),
  ) as FilterState;
}
export function filterQuery(state: FilterState): string {
  const query = new URLSearchParams();
  for (const key of filterKeys)
    if (state[key] !== "all") query.set(key, state[key]);
  return query.size ? "?" + query.toString() : "";
}
