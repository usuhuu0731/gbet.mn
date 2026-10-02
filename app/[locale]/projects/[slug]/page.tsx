import Link from "../../../../lib/link";
import { notFound } from "next/navigation";
import {
  projects,
  ui,
  categories,
  text,
  type Locale,
} from "../../../../content/site";
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
  const facts = [
    [text("Захиалагч", "Client"), p.client?.[l]],
    [text("ГБЭТ-ийн үүрэг", "GBET role"), p.role?.[l]],
    [text("Бүртгэлийн он", "Record year"), p.year ? String(p.year) : undefined],
    [text("Төлөв", "Status"), p.status[l]],
    [text("Урт", "Length"), p.length],
    [text("Бүтцийн төрөл", "Structure type"), p.bridgeType?.[l]],
    [text("Үйлчилгээ", "Services"), categories[p.category][l]],
  ];
  const sections = [
    text("Сорилт", "Challenge"),
    text("Инженерийн аргачлал", "Engineering approach"),
    text("Бүтцийн концепц", "Structural concept"),
    text("Гүйцэтгэл", "Delivery"),
    text("Үр дүн", "Outcome"),
    text("Галерей ба зураг", "Gallery & drawings"),
  ];
  return (
    <main id="main">
      <section className="page-heading">
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
      <section className="detail-hero">
        <ProjectImage project={p} locale={l} />
      </section>
      <section className="section project-detail">
        <aside>
          <p className="eyebrow">
            {l === "mn" ? "ТӨСЛИЙН МЭДЭЭЛЭЛ" : "PROJECT FACTS"}
          </p>
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
        <div>
          <p className="project-summary">{p.summary[l]}</p>
          {sections.map((s, i) => (
            <section className="case-section" key={i}>
              <span className="section-number">0{i + 1}</span>
              <h2>{s[l]}</h2>
              <p>{ui.pending[l]}</p>
              {i === 5 && (
                <div className="drawing-empty">
                  {l === "mn"
                    ? "Баталгаажсан зураг, гэрэл зураг болон техникийн материал нэмэх хэсэг."
                    : "Reserved for approved photographs, drawings and technical material."}
                </div>
              )}
            </section>
          ))}
        </div>
      </section>
      <ContactCTA locale={l} />
      <StructuredData locale={l} path={`projects/${slug}`} title={p.name[l]} />
    </main>
  );
}

export const dynamicParams = false;
export function generateStaticParams() { return ["mn", "en"].flatMap(locale => projects.map(p => ({locale,slug:p.slug}))); }
