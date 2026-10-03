import type { CaseStudyBlock } from "../content/case-study";
import { media } from "../content/media";
import { projects, type Locale } from "../content/site";
import { MediaImage } from "./media-image";
import { ImageGallery } from "./image-gallery";
import Link from "../lib/link";
export function CaseStudy({
  blocks,
  locale,
}: {
  blocks: CaseStudyBlock[];
  locale: Locale;
}) {
  return (
    <div className="case-blocks">
      {blocks.map((block, index) => {
        if (block.type === "text")
          return (
            <section className="case-text" key={index}>
              {block.title && <h2>{block.title[locale]}</h2>}
              <p className="project-summary">{block.body[locale]}</p>
            </section>
          );
        if (block.type === "facts")
          return (
            <dl className="facts case-facts" key={index}>
              {block.items.map((item, i) => (
                <div key={i}>
                  <dt>{item.label[locale]}</dt>
                  <dd>{item.value[locale]}</dd>
                </div>
              ))}
            </dl>
          );
        if (block.type === "image" || block.type === "diagram") {
          const image = media[block.mediaId];
          return image?.usageApproved ? (
            <figure key={index} className="case-figure">
              <MediaImage
                id={image.id}
                locale={locale}
                sizes="(max-width: 767px) 90vw, 65vw"
              />
              <figcaption>
                {block.caption?.[locale] || image.caption[locale]}
              </figcaption>
            </figure>
          ) : null;
        }
        if (block.type === "gallery")
          return (
            <section key={index} className="case-section">
              {block.title && <h2>{block.title[locale]}</h2>}
              <ImageGallery ids={block.mediaIds} locale={locale} />
            </section>
          );
        if (block.type === "relatedProjects")
          return (
            <section key={index} className="related-projects">
              <p className="eyebrow">
                {locale === "mn" ? "ХОЛБОГДОХ ТӨСЛҮҮД" : "RELATED PROJECTS"}
              </p>
              {block.slugs.map((slug) => {
                const project = projects.find((p) => p.slug === slug);
                return project ? (
                  <Link
                    className="related-project"
                    key={slug}
                    href={`/${locale}/projects/${slug}`}
                  >
                    <h2>{project.name[locale]}</h2>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ) : null;
              })}
            </section>
          );
        return null;
      })}
    </div>
  );
}
