import { MediaImage } from "../../components/media-image";
import Link from "../../lib/link";
import { ProjectFeature } from "../../components/projects";
import { TeamSection } from "../../components/team";
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
  return pageMetadata(locale, "", site.homeTitle[locale]);
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
        <div className="hero-visual">
          <MediaImage
            id="ikh-tamir"
            locale={l}
            priority
            className="hero-picture"
          />
          <div className="hero-shade" aria-hidden="true" />
          <Link
            href={`/${l}/projects/ikh-tamir`}
            className="hero-image-caption"
          >
            {l === "mn" ? "Их Тамирын голын гүүр" : "Ikh Tamir River Bridge"}
            <span>
              {l === "mn"
                ? "Архангай · Батцэнгэл / 198 м"
                : "Battsengel · Arkhangai / 198 m"}
            </span>
          </Link>
        </div>
        <div className="hero-editorial">
          <p className="eyebrow">
            <span className="hero-rule" aria-hidden="true" />
            {l === "mn"
              ? "МОНГОЛ УЛС / ГҮҮРИЙН ЗУРАГ ТӨСӨЛ"
              : "MONGOLIA / BRIDGE DESIGN"}
          </p>
          <h1>
            {l === "mn" ? "Гүүрийн\nинженерчлэл." : "Bridge\nengineering."}
          </h1>
          <p className="hero-description">
            {l === "mn"
              ? "Монголын гүүр, дэд бүтцийн зураг төслийн зөвлөх инженерүүд."
              : "Consulting engineers for Mongolia’s bridges and infrastructure."}
          </p>
          <div className="hero-actions">
            <Link className="button hero-project-link" href={`/${l}/projects`}>
              {l === "mn" ? "Бидний төслүүд" : "Discover our work"}
              <span className="cta-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link className="hero-contact-link" href={`/${l}/contact`}>
              {l === "mn" ? "Холбоо барих" : "Get in touch"}
              <span className="cta-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </div>
        <a href="#introduction" className="scroll-cue">
          {l === "mn" ? "Доош үзэх" : "Scroll to explore"}
          <span aria-hidden="true">↓</span>
        </a>
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
            02 / {l === "mn" ? "СОНГОСОН ТӨСЛҮҮД" : "SELECTED PROJECTS"}
          </p>
          <h2>{l === "mn" ? "Бидний ажил." : "Our work."}</h2>
          <Link className="text-link" href={`/${l}/projects`}>
            {l === "mn" ? "Бүх төсөл" : "All projects"} ↗
          </Link>
        </div>
        <div className="featured-projects">
          {projects
            .filter((p) => p.featured)
            .map((p, index) => (
              <ProjectFeature
                key={p.slug}
                project={p}
                locale={l}
                index={index}
              />
            ))}
        </div>
      </section>
      <section className="section expertise-section">
        <SectionHeading
          number="03"
          label={l === "mn" ? "ГҮҮРИЙН ИНЖЕНЕРЧЛЭЛ" : "BRIDGE ENGINEERING"}
          title={
            l === "mn" ? "Зураг төслийн чиглэлүүд." : "Engineering disciplines."
          }
        />
        <ExpertiseGrid locale={l} />
      </section>
      <section className="digital-design">
        <div className="digital-image">
          <MediaImage
            id="tavantolgoi-zuunbayan"
            locale={l}
            sizes="(max-width: 767px) 100vw, 55vw"
          />
        </div>
        <div className="digital-copy engineering-grid engineering-grid-dark">
          <p className="eyebrow">
            04 /{" "}
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
      <TeamSection locale={l} />
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
            alternateName: site.alternateNames,
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
export function generateStaticParams() {
  return ["mn", "en"].map((locale) => ({ locale }));
}
