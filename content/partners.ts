import { text, type Localized } from "./site";

export interface PartnerOrganization {
  id: string;
  name: Localized;
  website: Localized;
}

export const partners: PartnerOrganization[] = [
  {
    id: "ulaanbaatar-road-development",
    name: text(
      "Нийслэлийн Замын хөгжлийн газар",
      "Ulaanbaatar Road Development Department",
    ),
    website: text("https://road.ub.gov.mn/", "https://road.ub.gov.mn/"),
  },
  {
    id: "mongolian-railway",
    name: text("“Монголын төмөр зам” ТӨХК", "Mongolian Railway (MTZ)"),
    website: text("https://www.mtz.mn/", "https://www.mtz.mn/en/"),
  },
  {
    id: "ulaanbaatar-railway",
    name: text("“Улаанбаатар төмөр зам” ХНН", "Ulaanbaatar Railway (UBTZ)"),
    website: text("https://ubtz.mn/", "https://ubtz.mn/"),
  },
  {
    id: "ministry-road-transport",
    name: text(
      "Зам, тээврийн яам",
      "Ministry of Road and Transport of Mongolia",
    ),
    website: text("https://mrt.gov.mn/", "https://eng.mrt.gov.mn/"),
  },
  {
    id: "world-bank",
    name: text("Дэлхийн банк", "World Bank"),
    website: text(
      "https://www.worldbank.org/ext/mn/country/mongolia",
      "https://www.worldbank.org/ext/en/country/mongolia",
    ),
  },
  {
    id: "urban-planning-research-institute",
    name: text(
      "Хот төлөвлөлт, судалгааны институт ОНӨААТҮГ",
      "Urban Planning and Research Institute",
    ),
    website: text(
      "https://upri.ub.gov.mn/",
      "https://upri.ub.gov.mn/en/about-us/",
    ),
  },
];
