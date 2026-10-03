import type { Localized, Project } from "./site";
// Only publication-ready blocks belong here; private drafts stay outside the repo.
export type CaseStudyBlock =
  | { type: "text"; title?: Localized; body: Localized }
  | { type: "image" | "diagram"; mediaId: string; caption?: Localized }
  | { type: "gallery"; mediaIds: string[]; title?: Localized }
  | { type: "facts"; items: { label: Localized; value: Localized }[] }
  | { type: "relatedProjects"; slugs: string[] };
export function projectBlocks(
  project: Project,
  all: Project[],
): CaseStudyBlock[] {
  if (project.caseStudy) return project.caseStudy;
  const related = all
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 2);
  return [
    { type: "text", body: project.summary },
    ...(related.length
      ? [
          {
            type: "relatedProjects" as const,
            slugs: related.map((p) => p.slug),
          },
        ]
      : []),
  ];
}
