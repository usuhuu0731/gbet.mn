import Link from "../lib/link";
import { companyHistory } from "../content/company-history";
import { licences, licenceRegistry } from "../content/licences";
import {
  services,
  site,
  text,
  projects,
  type Locale,
  type Localized,
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
    <div className="licence-records">
      {licences.map((licence) => (
        <article
          className="credential-panel"
          data-licence={licence.id}
          key={licence.id}
        >
          <div>
            <p className="eyebrow">
              {locale === "mn" ? "ТУСГАЙ ЗӨВШӨӨРӨЛ" : "LICENCE RECORD"}
            </p>
            <h3>{licence.title[locale]}</h3>
            <ul className="licence-scopes">
              {licence.scopes.map((scope, index) => (
                <li key={scope.code || index}>
                  {scope.code && (
                    <span className="licence-scope-code">{scope.code}</span>
                  )}
                  <span>{scope.description[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
          <dl>
            <div>
              <dt>{locale === "mn" ? "Гэрчилгээ" : "Certificate"}</dt>
              <dd>{licence.number}</dd>
            </div>
            <div>
              <dt>{locale === "mn" ? "Олгосон огноо" : "Issue date"}</dt>
              <dd>
                <time dateTime={licence.issuedOn}>
                  {licence.issuedOn.replaceAll("-", ".")}
                </time>
              </dd>
            </div>
            <div>
              <dt>{locale === "mn" ? "Олгосон хугацаа" : "Granted term"}</dt>
              <dd>
                {licence.termYears} {locale === "mn" ? "жил" : "years"}
              </dd>
            </div>
            <div>
              <dt>{locale === "mn" ? "Регистр" : "Company registry"}</dt>
              <dd>{licenceRegistry}</dd>
            </div>
          </dl>
          <p className="small">
            {locale === "mn"
              ? "Компанийн ирүүлсэн гэрчилгээний мэдээлэл."
              : "Details from the certificate supplied by the company."}
            {licence.publicSource && (
              <>
                {" "}
                <a href={licence.publicSource} target="_blank" rel="noreferrer">
                  {locale === "mn"
                    ? "Яамны нийтэлсэн бүртгэл"
                    : "Published ministry register"}
                </a>
              </>
            )}
          </p>
        </article>
      ))}
    </div>
  );
}
export function Timeline({ locale }: { locale: Locale }) {
  const items: { year: string; title: Localized; source?: string }[] = [
    ...companyHistory.milestones,
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
          {i.source ? (
            <a
              className="small"
              href={i.source}
              target="_blank"
              rel="noreferrer"
            >
              {locale === "mn" ? "Эх сурвалж" : "Source record"}
            </a>
          ) : (
            <p className="small">
              {locale === "mn" ? "Компанийн түүх" : "Company history"}
            </p>
          )}
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
