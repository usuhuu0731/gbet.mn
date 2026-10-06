import Link from "../lib/link";
import {
  credential,
  services,
  site,
  text,
  projects,
  type Locale,
} from "../content/site";
export function SectionHeading({
  number,
  label,
  title,
}: {
  number: string;
  label: string;
  title: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number}</span>
        {label}
      </p>
      <h2>{title}</h2>
    </div>
  );
}
export function ExpertiseGrid({ locale }: { locale: Locale }) {
  return (
    <div className="expertise-grid">
      {services.map((s, i) => (
        <details key={s.id} id={`service-${s.id}`} open={i === 0}>
          <summary>
            <span className="section-number" aria-hidden="true">
              0{i + 1}
            </span>
            <span className="service-title">{s.title[locale]}</span>
            <span className="service-toggle" aria-hidden="true" />
          </summary>
          <div className="service-panel">
            <p>{s.copy[locale]}</p>
            {!!s.projectSlugs?.length && (
              <div className="service-projects">
                {s.projectSlugs.map((slug) => {
                  const project = projects.find((p) => p.slug === slug);
                  return project ? (
                    <Link key={slug} href={`/${locale}/projects/${slug}`}>
                      {project.name[locale]} <span aria-hidden="true">↗</span>
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
export function CredentialPanel({ locale }: { locale: Locale }) {
  return (
    <div className="credential-panel">
      <div>
        <p className="eyebrow">
          {locale === "mn" ? "ТУСГАЙ ЗӨВШӨӨРЛИЙН БҮРТГЭЛ" : "LICENCE RECORD"}
        </p>
        <h3>
          {locale === "mn"
            ? "Гүүр, туннель. Хотын зам. ТЭЗҮ."
            : "Bridges & tunnels. Urban roads. Feasibility."}
        </h3>
      </div>
      <dl>
        <div>
          <dt>{locale === "mn" ? "Гэрчилгээ" : "Licence"}</dt>
          <dd>{credential.number}</dd>
        </div>
        <div>
          <dt>{locale === "mn" ? "Бүртгэсэн хугацаа" : "Recorded validity"}</dt>
          <dd>2022.04.01 — 2027.04.01</dd>
        </div>
        <div>
          <dt>{locale === "mn" ? "Регистр" : "Registry"}</dt>
          <dd>{credential.registry}</dd>
        </div>
      </dl>
      <p className="small">
        {credential.caveat[locale]}{" "}
        <a href={credential.source} target="_blank" rel="noreferrer">
          {locale === "mn" ? "Яамны бүртгэл" : "Ministry register"}
        </a>
      </p>
    </div>
  );
}
export function Timeline({ locale }: { locale: Locale }) {
  const items = [
    {
      year: "2013",
      title: text(
        "MG модуль гүүрийн хамтын ажиллагаа",
        "MG Modular Bridge collaboration",
      ),
      source: "https://www.srp-mongolia.mn/en/projects/mg-modular-bridge",
    },
    {
      year: "2021",
      title: text(
        "Онгийн болон Орхоны Онгоцтойн гүүр ашиглалтад орсон",
        "Ongi and Orkhon / Ongotstoi bridges opened",
      ),
      source: "https://mrt.gov.mn/i/2804",
    },
    {
      year: "2026",
      title: text(
        "Энхтайваны болон Туулын төмөр замын гүүрийн зураг төслийн бүртгэл",
        "Peace Bridge and Tuul railway bridge design records",
      ),
      source: "https://magadlal.rtdc.gov.mn/planInfoList/page:11",
    },
  ];
  return (
    <div className="timeline">
      {items.map((i) => (
        <article key={i.year}>
          <span>{i.year}</span>
          <h3>{i.title[locale]}</h3>
          <a className="small" href={i.source} target="_blank" rel="noreferrer">
            {locale === "mn" ? "Эх сурвалж" : "Source record"}
          </a>
        </article>
      ))}
    </div>
  );
}
export function ContactCTA({ locale }: { locale: Locale }) {
  return (
    <section className="contact-cta">
      <p className="eyebrow">
        {locale === "mn" ? "ДАРААГИЙН ХОЛБОЛТ" : "THE NEXT CONNECTION"}
      </p>
      <h2>
        {locale === "mn"
          ? "Инженерийн сорилтоо\nхамтдаа ярилцъя."
          : "Let’s discuss your\nengineering challenge."}
      </h2>
      <Link href={`/${locale}/contact`} className="button">
        {locale === "mn" ? "Төсөл эхлүүлэх" : "Start a conversation"}
        <span className="cta-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <a className="text-link" href={`mailto:${site.email}`}>
        {site.email}
      </a>
    </section>
  );
}
