import Link from "../lib/link";
import { categories, ui, type Locale, type Project } from "../content/site";
import { media } from "../content/media";
import { asset } from "../lib/paths";
export function ProjectImage({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const registered = media[project.slug];
  const image = registered
    ? {
        src: asset(registered.src),
        alt: registered.alt,
        kind: registered.kind,
        usageApproved: registered.usageApproved,
      }
    : project.image;
  return (
    <div
      className={`project-image ${image?.usageApproved ? "has-photo" : "awaiting-photo"} ${project.category}`}
    >
      {image?.usageApproved ? (
        <>
          <img
            src={image.src}
            alt={image.alt[locale]}
            loading="lazy"
            width={registered?.width || 1320}
            height={registered?.height || 824}
            style={{ objectPosition: registered?.position || "center" }}
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
        <ProjectImage project={project} locale={locale} />
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
}: {
  project: Project;
  locale: Locale;
}) {
  return (
    <article
      className={`project-card ${project.image?.usageApproved ? "photographic-project" : "textual-project"}`}
    >
      <Link href={`/${locale}/projects/${project.slug}`}>
        <ProjectImage project={project} locale={locale} />
        <div className="project-title">
          <h3>{project.name[locale]}</h3>
          <span aria-hidden="true">↗</span>
        </div>
        <div className="project-meta">
          <p>{project.location[locale]}</p>
          <p>{project.length || project.year}</p>
        </div>
        {project.role && <p className="small">{project.role[locale]}</p>}
      </Link>
    </article>
  );
}
