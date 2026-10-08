import Link from "../../../../lib/link";
import { notFound } from "next/navigation";
import {
  projects,
  ui,
  categories,
  text,
  type Locale,
} from "../../../../content/site";
import { CaseStudy } from "../../../../components/case-study";
import { ImageGallery } from "../../../../components/image-gallery";
import { projectBlocks } from "../../../../content/case-study";
import { media } from "../../../../content/media";
import { ProjectImage } from "../../../../components/projects";
import { ContactCTA } from "../../../../components/sections";
import { pageMetadata } from "../../../../lib/metadata";
import { StructuredData } from "../../../../components/structured-data";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return pageMetadata(
    locale,
    `projects/${slug}`,
    p?.name[locale] || "GBET",
    p?.summary[locale],
    media[slug]?.og?.[locale]?.src,
  );
}
export default async function Detail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale: l, slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const hasImage = Boolean(media[p.slug]?.usageApproved);
  const nextProject =
    projects[
      (projects.findIndex((project) => project.slug === slug) + 1) %
        projects.length
    ];
  const facts = [
    [text("Захиалагч", "Client"), p.client?.[l]],
    [text("ГБЭТ-ийн үүрэг", "GBET role"), p.role?.[l]],
    [text("Бүртгэлийн он", "Record year"), p.year ? String(p.year) : undefined],
    [text("Төлөв", "Status"), p.status[l]],
    [text("Үйлчилгээ", "Services"), categories[p.category][l]],
  ];
  return (
    <main
      id="main"
      className={hasImage ? "detail-with-image" : "detail-without-image"}
    >
      <section className="page-heading detail-heading">
        <nav
          className="breadcrumbs"
          aria-label={l === "mn" ? "Хуудасны зам" : "Breadcrumb"}
        >
          <Link href={`/${l}`}>{l === "mn" ? "Нүүр" : "Home"}</Link>
          <span>/</span>
          <Link href={`/${l}/projects`}>
            {l === "mn" ? "Төслүүд" : "Projects"}
          </Link>
        </nav>
        <p className="eyebrow">
          {p.location[l]}
          {p.year ? ` / ${p.year}` : ""}
        </p>
        <h1>{p.name[l]}</h1>
      </section>
      {hasImage && (
        <section className="detail-hero">
          <ImageGallery ids={[p.slug]} locale={l}>
            <ProjectImage
              project={p}
              locale={l}
              priority
              presentation="detail"
            />
          </ImageGallery>
          <p className="detail-caption">{media[p.slug].caption[l]}</p>
        </section>
      )}
      <section className="section project-detail">
        <aside>
          {!hasImage && <p className="detail-photo-note">{ui.photo[l]}</p>}
          <p className="eyebrow">
            {l === "mn" ? "ТӨСЛИЙН МЭДЭЭЛЭЛ" : "PROJECT FACTS"}
          </p>
          {(p.length || p.bridgeType) && (
            <dl className="facts-highlights">
              {p.length && (
                <div className="highlight-length">
                  <dt>{l === "mn" ? "Урт" : "Length"}</dt>
                  <dd>{p.length}</dd>
                </div>
              )}
              {p.bridgeType && (
                <div className="highlight-type">
                  <dt>{l === "mn" ? "Бүтцийн төрөл" : "Structure type"}</dt>
                  <dd>{p.bridgeType[l]}</dd>
                </div>
              )}
            </dl>
          )}
          <dl className="facts">
            {facts
              .filter(([, value]) => value)
              .map(([label, value], i) => (
                <div key={i}>
                  <dt>{(label as ReturnType<typeof text>)[l]}</dt>
                  <dd>{value as string}</dd>
                </div>
              ))}
          </dl>
          {p.source && (
            <a
              href={p.source}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              {ui.source[l]}
            </a>
          )}
          <p className="small">{p.sourceNote[l]}</p>
        </aside>
        <CaseStudy blocks={projectBlocks(p, projects)} locale={l} />
      </section>
      <section className="case-next">
        <div>
          <p className="eyebrow">
            {l === "mn" ? "ДАРААГИЙН ТӨСӨЛ" : "NEXT PROJECT"}
          </p>
          <h2>
            <Link href={`/${l}/projects/${nextProject.slug}`}>
              {nextProject.name[l]}
            </Link>
          </h2>
        </div>
        <Link className="text-link" href={`/${l}/projects/${nextProject.slug}`}>
          {l === "mn" ? "Үзэх" : "Explore"} <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <ContactCTA locale={l} />
      <StructuredData locale={l} path={`projects/${slug}`} title={p.name[l]} />
    </main>
  );
}

export const dynamicParams = false;
export function generateStaticParams() {
  return ["mn", "en"].flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}
