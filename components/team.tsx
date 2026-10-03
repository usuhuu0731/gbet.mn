import type { CSSProperties } from "react";
import { team, directorMessage, type TeamMember } from "../content/team";
import { media } from "../content/media";
import type { Locale } from "../content/site";
import { asset } from "../lib/paths";
import Link from "../lib/link";

export function TeamPortrait({
  member,
  locale,
  index,
}: {
  member: TeamMember;
  locale: Locale;
  index: number;
}) {
  const portrait = member.portraitId ? media[member.portraitId] : undefined;
  if (portrait?.kind === "portrait" && portrait.usageApproved) {
    return (
      <div className="team-portrait">
        <img
          src={asset(portrait.src)}
          alt={portrait.alt[locale]}
          width={portrait.width}
          height={portrait.height}
          loading="lazy"
          style={{ objectPosition: portrait.position }}
        />
      </div>
    );
  }
  return (
    <div
      className="team-portrait portrait-placeholder"
      role="img"
      aria-label={
        locale === "mn"
          ? `${member.name.mn} · хөрөг зураг нэмэх хэсэг`
          : `${member.name.en} · portrait to be added`
      }
      style={{ "--portrait-index": index } as CSSProperties}
    >
      <span className="portrait-number" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="portrait-lines" aria-hidden="true" />
      <span className="portrait-monogram" aria-hidden="true">
        {member.name[locale]
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </span>
      <span className="portrait-caption">
        {locale === "mn" ? "Хөрөг зураг нэмнэ" : "Portrait to follow"}
      </span>
    </div>
  );
}

export function TeamGrid({
  locale,
  preview = false,
}: {
  locale: Locale;
  preview?: boolean;
}) {
  const members = preview ? team.slice(0, 3) : team;
  return (
    <div className={`team-grid ${preview ? "team-preview-grid" : ""}`}>
      {members.map((member, index) => (
        <article className="team-profile" id={member.id} key={member.id}>
          <TeamPortrait member={member} locale={locale} index={index} />
          <div className="team-profile-copy">
            <h3>{member.name[locale]}</h3>
            <p>{member.role[locale]}</p>
            {member.biography && (
              <p className="team-biography">{member.biography[locale]}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function TeamSection({ locale }: { locale: Locale }) {
  return (
    <section className="section people-section">
      <div className="work-heading">
        <p className="eyebrow">
          06 / {locale === "mn" ? "МАНАЙ БАГ" : "OUR PEOPLE"}
        </p>
        <h2>
          {locale === "mn"
            ? "Шийдлийн цаадах\nхүмүүс."
            : "The people behind\nthe design."}
        </h2>
        <Link className="text-link" href={`/${locale}/team`}>
          {locale === "mn" ? "Багтай танилцах" : "Meet the team"}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <TeamGrid locale={locale} preview />
    </section>
  );
}

export function DirectorMessage({ locale }: { locale: Locale }) {
  if (!directorMessage.approved || !directorMessage.paragraphs.length)
    return null;
  return (
    <section className="section director-message" id="directors-message">
      <div>
        <p className="eyebrow">
          {locale === "mn" ? "ЗАХИРЛЫН ҮГ" : "DIRECTOR’S MESSAGE"}
        </p>
        <TeamPortrait member={team[0]} locale={locale} index={0} />
        <h3>{team[0].name[locale]}</h3>
        <p>{team[0].role[locale]}</p>
      </div>
      <div>
        <h2>
          {locale === "mn"
            ? "Гүүрийн салбарын\nирээдүйн төлөө."
            : "Towards the future\nof bridge engineering."}
        </h2>
        {directorMessage.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph[locale]}</p>
        ))}
      </div>
    </section>
  );
}
