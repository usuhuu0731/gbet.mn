import { asset } from "../../lib/paths";
import Link from "../../lib/link";
import { ProjectCard } from "../../components/projects";
import {
  SectionHeading,
  ExpertiseGrid,
  CredentialPanel,
  Timeline,
  ContactCTA,
} from "../../components/sections";
import { projects, site, type Locale } from "../../content/site";
import { pageMetadata } from "../../lib/metadata";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return pageMetadata(
    locale,
    "",
    site.homeTitle[locale],
  );
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: l } = await params;
  return (
    <main id="main" className="portfolio-home">
      <section className="image-hero">
        <picture>
          <source
            media="(max-width: 640px)"
            srcSet={asset("/projects/ikh-tamir-mobile.webp")} 
          />
          <img
            className="hero-photograph"
            src={asset("/projects/ikh-tamir.webp")} 
            alt={
              l === "mn"
                ? "Их Тамирын голын төмөрбетон гүүр"
                : "Reinforced concrete bridge over the Ikh Tamir River"
            }
            width="1846"
            height="1153"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-editorial">
          <p className="eyebrow">GBET / CONSULTING ENGINEERS</p>
          <h1>
            {l === "mn"
              ? "Гүүрээр\nхолбогдох Монгол."
              : "Engineering\nconnections."}
          </h1>
          <Link className="hero-project-link" href={`/${l}/projects`}>
            {l === "mn" ? "Бидний төслүүд" : "Discover our work"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="hero-caption">
          <Link href={`/${l}/projects/ikh-tamir`}>
            {l === "mn" ? "Их Тамирын голын гүүр" : "Ikh Tamir River Bridge"}
            <small>
              {l === "mn"
                ? "Архангай · Батцэнгэл / 198 м"
                : "Battsengel · Arkhangai / 198 m"}
            </small>
          </Link>
          <a href="#introduction" className="scroll-cue">
            {l === "mn" ? "Доош үзэх" : "Scroll to explore"}{" "}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section className="section intro editorial-intro" id="introduction">
        <p className="eyebrow">
          {l === "mn" ? "ГБЭТ ХХК / МОНГОЛ УЛС" : "GBET / MONGOLIA"}
        </p>
        <div>
          <h2>
            {l === "mn"
              ? "Гүүрийн зураг төсөл.\nИнженерийн харах өнцөг."
              : "Bridge design.\nAn engineering perspective."}
          </h2>
          <div className="intro-copy">
            <p>{site.description[l]}</p>
            <Link className="text-link" href={`/${l}/about`}>
              {l === "mn" ? "Компанийн тухай" : "About the company"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section selected-work" id="selected-work">
        <div className="work-heading">
          <p className="eyebrow">
            {l === "mn" ? "СОНГОСОН ТӨСЛҮҮД" : "SELECTED PROJECTS"}
          </p>
          <h2>{l === "mn" ? "Бидний ажил." : "Our work."}</h2>
          <Link className="text-link" href={`/${l}/projects`}>
            {l === "mn" ? "Бүх төсөл" : "All projects"} ↗
          </Link>
        </div>
        <div className="featured-projects">
          {projects
            .filter((p) => p.featured)
            .map((p) => (
              <ProjectCard key={p.slug} project={p} locale={l} />
            ))}
        </div>
      </section>
      <section className="section expertise-section">
        <SectionHeading
          number="04"
          label={l === "mn" ? "ГҮҮРИЙН ИНЖЕНЕРЧЛЭЛ" : "BRIDGE ENGINEERING"}
          title={
            l === "mn" ? "Зураг төслийн чиглэлүүд." : "Engineering disciplines."
          }
        />
        <ExpertiseGrid locale={l} />
      </section>
      <section className="digital-design">
        <div className="digital-image">
          <img
            src={asset("/projects/railway-construction.webp")} 
            alt={
              l === "mn"
                ? "Төмөр замын гүүрийн барилгын үе"
                : "Railway bridge under construction"
            }
            width="1320"
            height="824"
            loading="lazy"
          />
        </div>
        <div className="digital-copy">
          <p className="eyebrow">
            {l === "mn" ? "ИНЖЕНЕРЧЛЭЛ / ЗУРАГ ТӨСӨЛ" : "ENGINEERING / DESIGN"}
          </p>
          <h2>
            {l === "mn"
              ? "Зураг төслөөс\nбүтээн байгуулалт руу."
              : "From drawings\nto structures."}
          </h2>
          <p>
            {l === "mn"
              ? "Тавантолгой–Зүүнбаян төмөр замын гүүр. Компанийн танилцуулгын барилгын үеийн гэрэл зураг."
              : "A bridge on the Tavantolgoi–Zuunbayan railway. Construction-stage photography from the company portfolio."}
          </p>
          <Link className="text-link" href={`/${l}/innovation`}>
            {l === "mn" ? "Инженерчлэлийн тухай" : "Explore engineering"} ↗
          </Link>
        </div>
      </section>
      <section className="section credentials-history">
        <SectionHeading
          number="06"
          label={
            l === "mn" ? "МЭРГЭЖЛИЙН БҮРТГЭЛ / ЗАМНАЛ" : "CREDENTIALS / HISTORY"
          }
          title={
            l === "mn" ? "Баримтад суурилсан замнал." : "A documented record."
          }
        />
        <CredentialPanel locale={l} />
        <Timeline locale={l} />
      </section>
      <ContactCTA locale={l} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name[l],
            url: `${site.origin}/${l}`,
            description: site.description[l],
            email: site.email,
            logo: `${site.origin}/logo.jpg`,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}

export const dynamicParams = false;
export function generateStaticParams() { return ["mn", "en"].map(locale => ({locale})); }
