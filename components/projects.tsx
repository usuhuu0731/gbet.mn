import Link from "../lib/link";
import { categories, ui, type Locale, type Project } from "../content/site";
import { media } from "../content/media";
import { MediaImage } from "./media-image";
import type { CSSProperties } from "react";

type ProjectPresentation = "feature" | "index-feature" | "index" | "detail";
const imageSizes: Record<ProjectPresentation, string> = {
  feature:
    "(max-width: 392px) calc(100vw - 44px), (min-width: 1600px) 1336px, 88.8vw",
  "index-feature":
    "(max-width: 392px) calc(100vw - 44px), (min-width: 1600px) 1336px, 88.8vw",
  index:
    "(max-width: 392px) calc(100vw - 44px), (max-width: 767px) 88.8vw, (min-width: 1600px) 648px, calc(44.4vw - 20px)",
  detail: "(max-width: 767px) 100vw, 89vw",
};
export function ProjectImage({
  project,
  locale,
  priority = false,
  presentation = "detail",
}: {
  project: Project;
  locale: Locale;
  priority?: boolean;
  presentation?: ProjectPresentation;
}) {
  const registered = media[project.slug];
  const image = registered
    ? {
        src: registered.src,
        alt: registered.alt,
        kind: registered.kind,
        usageApproved: registered.usageApproved,
      }
    : undefined;
  return (
    <div
      className={`project-image ${image?.usageApproved ? "has-photo" : "awaiting-photo"} ${project.category}`}
      data-presentation={presentation}
      style={
        registered
          ? ({
              "--project-aspect": `${registered.width} / ${registered.height}`,
            } as CSSProperties)
          : undefined
      }
    >
      {image?.usageApproved ? (
        <>
          <MediaImage
            id={project.slug}
            locale={locale}
            priority={priority}
            sizes={imageSizes[presentation]}
          />
          <span className="photo-kind">
            {image.kind === "rendering"
              ? locale === "mn"
                ? "Зураг төслийн дүрслэл"
                : "Design rendering"
              : locale === "mn"
                ? "Төслийн гэрэл зураг"
                : "Project photograph"}
          </span>
        </>
      ) : (
        <>
          <span className="project-index">
            GBET{project.year ? ` / ${project.year}` : ""}
          </span>
          <div className="project-type">
            {categories[project.category][locale]}
          </div>
          <strong>{project.length || "GBET"}</strong>
          <span className="image-note">{ui.photo[locale]}</span>
        </>
      )}
    </div>
  );
}

export function ProjectFeature({
  project,
  locale,
  index,
}: {
  project: Project;
  locale: Locale;
  index: number;
}) {
  return (
    <article className={`project-feature feature-${index + 1}`}>
      <Link
        className="feature-image-link"
        href={`/${locale}/projects/${project.slug}`}
        aria-label={project.name[locale]}
      >
        <ProjectImage
          project={project}
          locale={locale}
          presentation="feature"
        />
        <span className="feature-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="feature-caption">
        <span className="feature-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="eyebrow">{categories[project.category][locale]}</p>
          <h3>
            <Link href={`/${locale}/projects/${project.slug}`}>
              {project.name[locale]}
            </Link>
          </h3>
          <p className="feature-location">
            {project.location[locale]}
            {project.year ? ` / ${project.year}` : ""}
          </p>
        </div>
        <div className="feature-description">
          <p>{project.summary[locale]}</p>
          <div className="feature-facts">
            {project.length && <span>{project.length}</span>}
            {project.bridgeType && <span>{project.bridgeType[locale]}</span>}
            {project.role && <span>{project.role[locale]}</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
export function ProjectCard({
  project,
  locale,
  index,
  featuredImage = false,
}: {
  project: Project;
  locale: Locale;
  index: number;
  featuredImage?: boolean;
}) {
  const hasImage = Boolean(media[project.slug]?.usageApproved);
  return (
    <article
      className={`project-card ${hasImage ? "photographic-project" : "textual-project"}`}
    >
      <Link href={`/${locale}/projects/${project.slug}`}>
        {hasImage ? (
          <ProjectImage
            project={project}
            locale={locale}
            presentation={featuredImage ? "index-feature" : "index"}
          />
        ) : (
          <span className="project-register-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <div className="project-title">
          <h3>{project.name[locale]}</h3>
          <span aria-hidden="true">↗</span>
        </div>
        <div className="project-meta">
          <p>{project.location[locale]}</p>
          <p>{[project.year, project.length].filter(Boolean).join(" / ")}</p>
        </div>
        {project.role && <p className="small">{project.role[locale]}</p>}
        {!hasImage && (
          <p className="project-register-note">{ui.photo[locale]}</p>
        )}
      </Link>
    </article>
  );
}
