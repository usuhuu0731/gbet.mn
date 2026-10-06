import { MediaImage } from "../../../components/media-image";
import { media } from "../../../content/media";
import { notFound } from "next/navigation";
import Link from "../../../lib/link";
import {
  nav,
  projects,
  site,
  text,
  ui,
  type Locale,
} from "../../../content/site";
import { pageMetadata } from "../../../lib/metadata";
import { ProjectFilter } from "../../../components/project-filter";
import { ContactForm } from "../../../components/contact-form";
import {
  SectionHeading,
  ExpertiseGrid,
  CredentialPanel,
  Timeline,
  ContactCTA,
} from "../../../components/sections";

import { StructuredData } from "../../../components/structured-data";
import {
  TeamGrid,
  TeamSection,
  DirectorMessage,
} from "../../../components/team";
const valid = nav.map((n) => n.path).filter(Boolean);
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; page: string }>;
}) {
  const { locale, page } = await params;
  const n = nav.find((n) => n.path === page);
  return pageMetadata(locale, page, n?.name[locale] || "GBET");
}
export default async function ContentPage({
  params,
}: {
  params: Promise<{ locale: Locale; page: string }>;
}) {
  const { locale: l, page } = await params;
  if (!valid.includes(page)) notFound();
  const n = nav.find((n) => n.path === page)!;
  const engineeringImage = media["tavantolgoi-zuunbayan"];
  const titles: Record<string, ReturnType<typeof text>> = {
    team: text("Шийдлийн цаадах\nхүмүүс.", "The people behind\nthe design."),
    about: text(
      "Гүүрийн инженерчлэлд\nтөвлөрсөн компани.",
      "A practice focused\non bridge engineering.",
    ),
    expertise: text(
      "Нарийвчлалтай зураг.\nБодит хэрэгцээнд нийцсэн шийдэл.",
      "Considered design.\nPurposeful infrastructure.",
    ),
    projects: text(
      "Холболт бүрийн\nцаана инженерчлэл бий.",
      "Behind every connection,\nthere is engineering.",
    ),
    innovation: text(
      "Бүтцийг ойлгох.\nШийдлийг хөгжүүлэх.",
      "Understanding structures.\nDeveloping solutions.",
    ),
    news: text(
      "Мэдээ,\nинженерийн тэмдэглэл.",
      "News &\nengineering insights.",
    ),
    careers: text(
      "Инженерчлэлийн\nдараагийн алхам.",
      "Your next step\nin engineering.",
    ),
    contact: text(
      "Төслийн талаар\nярилцъя.",
      "Let’s talk\nabout your project.",
    ),
  };
  return (
    <main id="main" className={`content-page page-${page}`}>
      <section
        className={`page-heading heading-${page}${page === "innovation" ? " engineering-grid" : ""}`}
      >
        <p className="eyebrow">GBET / {n.name[l]}</p>
        <h1>{titles[page][l]}</h1>
        {["about", "expertise"].includes(page) && <p>{site.description[l]}</p>}
      </section>
      {page === "projects" && (
        <section className="section page-content">
          <ProjectFilter projects={projects} locale={l} />
        </section>
      )}
      {page === "team" && (
        <section className="section page-content team-page">
          <p className="team-introduction">
            {l === "mn"
              ? "ГБЭТ ХХК-ийн удирдлага, инженерчлэл болон төслийн гүйцэтгэлийн баг."
              : "The leadership, engineering and project delivery team at GBET."}
          </p>
          <TeamGrid locale={l} />
        </section>
      )}
      {page === "about" && (
        <>
          <section className="section intro">
            <p className="eyebrow">
              01 / {l === "mn" ? "БИДНИЙ ТУХАЙ" : "WHO WE ARE"}
            </p>
            <div>
              <h2>
                {l === "mn"
                  ? "Зөвлөх инженер.\nГүүрийн зураг төсөл."
                  : "Consulting engineers.\nBridge design."}
              </h2>
              <p>{site.description[l]}</p>
              <p>
                {l === "mn"
                  ? "ГБЭТ-ийн гүүрийн зураг төслийн үүргийг Онгийн болон Орхон голын Онгоцтойн гүүрийн тухай яамны нийтлэлүүд тэмдэглэсэн."
                  : "Ministry publications record GBET’s design role on the Ongi River and Orkhon / Ongotstoi bridges."}
              </p>
              <Link className="text-link" href={`/${l}/projects`}>
                {ui.projects[l]}
              </Link>
            </div>
          </section>
          <section className="section">
            <SectionHeading
              number="02"
              label={
                l === "mn" ? "ИНЖЕНЕРИЙН ЗАРЧИМ" : "ENGINEERING PHILOSOPHY"
              }
              title={
                l === "mn"
                  ? "Зорилго. Нөхцөл. Бүтэц."
                  : "Purpose. Context. Structure."
              }
            />
            <div className="editorial-grid">
              <article>
                <h3>{l === "mn" ? "Монголын нөхцөл" : "Mongolian context"}</h3>
                <p>
                  {l === "mn"
                    ? "Гүүрийн зураг төсөлд газар орны нөхцөл, усны горим, улирлын өөрчлөлт, ашиглалт болон арчлалтын хэрэгцээг хамтад нь авч үзэх шаардлагатай."
                    : "Bridge design must consider terrain, river conditions, seasonal variation, operation and maintenance together."}
                </p>
              </article>
              <article>
                <h3>
                  {l === "mn"
                    ? "Техникийн тодорхой байдал"
                    : "Technical clarity"}
                </h3>
                <p>
                  {l === "mn"
                    ? "Шийдэл бүрийн үндэслэл, зураг төслийн үүрэг болон хамрах хүрээг тодорхой илэрхийлэх нь бидний танилцуулгын үндсэн зарчим."
                    : "Clear design responsibilities, scope and evidence form the basis of how we present our work."}
                </p>
              </article>
            </div>
          </section>
          <section className="section">
            <SectionHeading
              number="03"
              label={l === "mn" ? "ОН ЦАГ" : "MILESTONES"}
              title={
                l === "mn"
                  ? "Төслөөр тэмдэглэсэн замнал."
                  : "A journey recorded through projects."
              }
            />
            <Timeline locale={l} />
          </section>
          <section className="section">
            <CredentialPanel locale={l} />
          </section>
          <DirectorMessage locale={l} />
          <TeamSection locale={l} />
        </>
      )}
      {page === "expertise" && (
        <>
          <section className="section page-content">
            <ExpertiseGrid locale={l} />
          </section>
          <section className="section">
            <CredentialPanel locale={l} />
          </section>
        </>
      )}
      {page === "innovation" && (
        <>
          <section className="section page-content">
            <SectionHeading
              number="01"
              label={
                l === "mn" ? "ИНЖЕНЕРИЙН ЗУРАГ ТӨСӨЛ" : "ENGINEERING DESIGN"
              }
              title={
                l === "mn" ? "Хэсэг ба бүхэл." : "The elements and the whole."
              }
            />
            {engineeringImage.usageApproved && (
              <figure className="engineering-photo">
                <MediaImage id="tavantolgoi-zuunbayan" locale={l} priority />
                <figcaption>
                  {l === "mn"
                    ? "Тавантолгой–Зүүнбаян · Компанийн танилцуулгын гэрэл зураг"
                    : "Tavantolgoi–Zuunbayan · Company portfolio photograph"}
                </figcaption>
              </figure>
            )}
          </section>
          <section className="section intro">
            <p className="eyebrow">
              02 /{" "}
              {l === "mn"
                ? "ОЛОН УЛСЫН ХАМТЫН АЖИЛЛАГАА"
                : "INTERNATIONAL COLLABORATION"}
            </p>
            <div>
              <h2>MG {l === "mn" ? "модуль гүүр" : "Modular Bridge"}</h2>
              <p>
                {
                  projects.find((p) => p.slug === "mg-modular-bridge")!.summary[
                    l
                  ]
                }
              </p>
              <Link
                className="text-link"
                href={`/${l}/projects/mg-modular-bridge`}
              >
                {l === "mn" ? "Төслийн тухай" : "Explore the project"}
              </Link>
            </div>
          </section>
        </>
      )}
      {page === "news" && (
        <section className="section page-content">
          <p className="empty">
            {l === "mn"
              ? "Нийтлэхээр баталгаажсан мэдээ одоогоор байхгүй. Инженерийн тэмдэглэл, компанийн мэдээг энд байршуулна."
              : "There are no approved news articles to publish yet. Engineering notes and company updates will appear here."}
          </p>
        </section>
      )}
      {page === "careers" && (
        <section className="section page-content">
          <div className="editorial-grid">
            <article>
              <h2>{l === "mn" ? "Нээлттэй ажлын байр" : "Open positions"}</h2>
              <p>
                {l === "mn"
                  ? "Одоогоор нийтлэгдсэн ажлын байр байхгүй."
                  : "There are currently no published vacancies."}
              </p>
            </article>
            <article>
              <h3>
                {l === "mn"
                  ? "Мэргэжлийн танилцуулгаа илгээх"
                  : "Introduce yourself"}
              </h3>
              <p>
                {l === "mn"
                  ? "Гүүр, дэд бүтцийн инженерчлэлийн чиглэлээр хамтран ажиллах сонирхлоо и-мэйлээр илэрхийлж болно."
                  : "You can introduce your interest in bridge and infrastructure engineering by email."}
              </p>
              <a className="text-link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </article>
          </div>
        </section>
      )}
      {page === "contact" && (
        <section className="section contact-layout">
          <aside>
            <p className="eyebrow">ULAANBAATAR / MONGOLIA</p>
            <h2>{l === "mn" ? "Бидэнтэй холбогдох" : "Contact GBET"}</h2>
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p>{site.address[l]}</p>
            <a
              className="small"
              href={site.contactSource}
              target="_blank"
              rel="noreferrer"
            >
              {l === "mn"
                ? "2025 оны албан бичигт нийтэлсэн хаяг"
                : "Address published in a 2025 company letter"}
            </a>
          </aside>
          <ContactForm locale={l} />
        </section>
      )}
      {page !== "contact" && <ContactCTA locale={l} />}
      <StructuredData
        locale={l}
        path={page}
        title={n.name[l]}
        servicePage={page === "expertise"}
      />
    </main>
  );
}

export const dynamicParams = false;
export function generateStaticParams() {
  return ["mn", "en"].flatMap((locale) =>
    valid.map((page) => ({ locale, page })),
  );
}
