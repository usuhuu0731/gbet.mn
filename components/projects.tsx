import Link from "../lib/link";
import { categories, ui, type Locale, type Project } from "../content/site";
export function ProjectImage({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const image = project.image;
  return (
    <div
      className={`project-image ${image?.usageApproved ? "has-photo" : "awaiting-photo"} ${project.category}`}
    >
      {image?.usageApproved ? (
        <>
          <img src={image.src} alt={image.alt[locale]} loading="lazy" />
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
