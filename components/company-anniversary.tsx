import { companyExperience, companyHistory } from "../content/company-history";
import type { Locale } from "../content/site";
import "./company-anniversary.css";

export function CompanyAnniversary({ locale }: { locale: Locale }) {
  const { sinceYear, referenceYear } = companyExperience;
  if (sinceYear === null || referenceYear <= sinceYear) return null;
  const years = referenceYear - sinceYear;
  return (
    <small className="brand-anniversary" title={companyHistory.summary[locale]}>
      <strong>{years}</strong> {locale === "mn" ? "ЖИЛ" : "YEARS"}
      <span>{sinceYear}–{referenceYear}</span>
    </small>
  );
}
