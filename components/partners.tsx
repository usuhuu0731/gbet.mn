import { partners } from "../content/partners";
import type { Locale } from "../content/site";
import "./partners.css";

export function PartnersSection({ locale }: { locale: Locale }) {
  return (
    <section
      className="section partners-section"
      aria-labelledby="partners-title"
      id="partners"
    >
      <div className="partners-heading">
        <p className="eyebrow">
          GBET / {locale === "mn" ? "ХАМТЫН АЖИЛЛАГАА" : "COLLABORATION"}
        </p>
        <h2 id="partners-title">
          {locale === "mn" ? "Хамтрагч\nбайгууллагууд." : "Our\npartners."}
        </h2>
      </div>
      <ul className="partners-list">
        {partners.map((partner, index) => (
          <li key={partner.id} data-partner={partner.id}>
            <a href={partner.website[locale]}>
              <span className="partner-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="partner-name">{partner.name[locale]}</span>
              <span className="partner-arrow" aria-hidden="true">
                ↗
              </span>
              <span className="partner-website">
                {locale === "mn" ? "Албан ёсны сайт" : "Official website"}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
