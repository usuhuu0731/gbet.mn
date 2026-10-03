import { asset, publicOrigin } from "../lib/paths";
export type Locale = "mn" | "en";
export type Localized = Record<Locale, string>;
export const text = (mn: string, en: string): Localized => ({ mn, en });
export const locales: Locale[] = ["mn", "en"];
export const site = {
  origin: publicOrigin,
  name: text("ГБЭТ ХХК", "GBET Consulting Engineers"),
  alternateNames: ["ГБЭТ", "ГБЭТ ХХК", "GBET", "GBET LLC", "GBET MN", "gbet.mn", "GBET Consulting Engineers"],
  homeTitle: text(
    "Зураг төсөл, технологи-инженерийн зөвлөх ГБЭТ ХХК",
    "GBET Consulting Engineers | Bridge Design Mongolia",
  ),
  email: "gbetllc@gmail.com",
  contactEndpoint: "",
  address: text(
    "Улаанбаатар, Сүхбаатар дүүрэг, Тээвэрчдийн гудамж, Жигүүр Гранд оффис төв, 5 давхар, 510 тоот",
    "Room 510, 5th floor, Jiguur Grand Office Center, Teeverchid Street, Sukhbaatar District, Ulaanbaatar, Mongolia",
  ),
  contactSource:
    "https://user.tender.gov.mn/uploads/question/68145e70858e5.pdf",
  description: text(
    "ГБЭТ ХХК (GBET LLC) — гүүр, туннель, хотын авто зам, замын байгууламжийн зураг төсөл, техник-эдийн засгийн үндэслэлийн Монголын зөвлөх инженерийн компани.",
    "GBET LLC (ГБЭТ ХХК) is a Mongolian consulting engineering company focused on bridge and tunnel design, urban road structures and infrastructure feasibility studies.",
  ),
};
export const nav = [
  { path: "", name: text("Нүүр", "Home") },
  { path: "about", name: text("Бидний тухай", "About") },
  { path: "expertise", name: text("Үйлчилгээ", "Expertise") },
  { path: "projects", name: text("Төслүүд", "Projects") },
  { path: "innovation", name: text("Инженерчлэл", "Engineering") },
  { path: "team", name: text("Манай баг", "Our people") },
  { path: "news", name: text("Мэдээ", "Insights") },
  { path: "careers", name: text("Карьер", "Careers") },
  { path: "contact", name: text("Холбоо барих", "Contact") },
];
export const ui = {
  headline: text(
    "Гүүрийн инженерчлэл.\nНарийвчлал. Урт настай шийдэл.",
    "Bridge engineering.\nPrecision built to endure.",
  ),
  projects: text("Төслүүдийг үзэх", "Explore projects"),
  contact: text("Бидэнтэй холбогдох", "Contact our team"),
  concept: text(
    "Бүтцийн концепц · Бодит төслийн дүрслэл биш",
    "Structural concept · Not a representation of a built project",
  ),
  pending: text(
    "Төслийн дэлгэрэнгүй мэдээллийг дотоод хяналтын дараа нэмнэ.",
    "Detailed project information will be added following internal review.",
  ),
  photo: text(
    "Төслийн баталгаажсан гэрэл зургийг удахгүй нэмнэ.",
    "Approved project photography will be added.",
  ),
  all: text("Бүгд", "All"),
  source: text("Эх сурвалж", "Source"),
  record: text("Нийтийн бүртгэл", "Public record"),
};
export const services = [
  {
    title: text("Гүүрийн зураг төсөл", "Bridge design"),
    copy: text(
      "Гүүрэн байгууламжийн инженерийн нарийвчилсан зураг төсөл.",
      "Detailed engineering design for bridge structures.",
    ),
  },
  {
    title: text("Гүүрийн шинэчлэлт", "Bridge rehabilitation"),
    copy: text(
      "Одоо байгаа гүүрийг өргөтгөх, хүчитгэх ажлын зураг төсөл.",
      "Design for widening and strengthening existing bridges.",
    ),
  },
  {
    title: text("Хотын замын байгууламж", "Urban road structures"),
    copy: text(
      "Хотын авто зам, замын байгууламжийн зураг төсөл.",
      "Design of urban roads and associated structures.",
    ),
  },
  {
    title: text("Туннелийн зураг төсөл", "Tunnel design"),
    copy: text(
      "Гүүр, туннелийн зураг төслийн тусгай зөвшөөрлийн хүрээ.",
      "Within the registered bridge and tunnel design licence scope.",
    ),
  },
  {
    title: text("Техник-эдийн засгийн үндэслэл", "Feasibility studies"),
    copy: text(
      "Дэд бүтцийн техник-эдийн засгийн үндэслэл боловсруулах.",
      "Preparation of infrastructure feasibility studies.",
    ),
  },
  {
    title: text("Инженерийн нарийвчилсан зураг", "Detailed engineering design"),
    copy: text(
      "Төслийн зорилгоос инженерийн зураг төслийн баримт бичиг хүртэл.",
      "Engineering design documentation for defined project requirements.",
    ),
  },
];
export const categories = {
  bridges: text("Гүүр", "Bridges"),
  rehabilitation: text("Гүүрийн шинэчлэлт", "Bridge rehabilitation"),
  urban: text("Хотын байгууламж", "Urban structures"),
  rail: text("Төмөр зам", "Rail infrastructure"),
  roads: text("Авто зам", "Road infrastructure"),
  innovation: text("Инновац", "Innovation"),
};
export type Category = keyof typeof categories;
export type Verification =
  "verified" | "needs-client-confirmation" | "placeholder";
export interface Project {
  slug: string;
  name: Localized;
  location: Localized;
  year?: number;
  category: Category;
  role?: Localized;
  status: Localized;
  summary: Localized;
  length?: string;
  bridgeType?: Localized;
  client?: Localized;
  featured: boolean;
  verificationStatus: Verification;
  source: string;
  sourceNote: Localized;
  image?: {
    src: string;
    source: string;
    copyrightOwner: string;
    usageApproved: boolean;
    alt: Localized;
    kind?: "photograph" | "rendering";
  };
}
// Only approved claim-level projections belong in this public content module.
export const projects: Project[] = [
  {
    slug: "ongi-river",
    name: text("Онгийн голын гүүр", "Ongi River Bridge"),
    location: text("Дундговь · Сайхан-Овоо", "Saikhan-Ovoo · Dundgovi"),
    year: 2021,
    category: "bridges",
    role: text("Гүүрийн зураг төсөл", "Bridge design"),
    status: text("2021 онд ашиглалтад орсон", "Opened in 2021"),
    length: "54.8 m",
    bridgeType: text("Төмөрбетон гүүр", "Reinforced concrete bridge"),
    client: text(
      "Зам, тээврийн хөгжлийн яам",
      "Ministry of Road and Transport Development",
    ),
    summary: text(
      "Сайхан-Овоо сумын Онгийн голын гүүрийн зураг төслийг ГБЭТ ХХК боловсруулсан.",
      "GBET designed the bridge over the Ongi River in Saikhan-Ovoo soum.",
    ),
    featured: false,
    verificationStatus: "verified",
    source: "https://mrt.gov.mn/i/2771",
    sourceNote: text(
      "Зам, тээврийн яам · 2021.08.02",
      "Ministry of Road and Transport · 2 August 2021",
    ),
  },
  {
    slug: "orkhon-ongotstoi",
    name: text("Орхон голын Онгоцтойн гүүр", "Orkhon / Ongotstoi Bridge"),
    location: text("Өвөрхангай · Бат-Өлзий", "Bat-Ulzii · Uvurkhangai"),
    year: 2021,
    category: "bridges",
    role: text(
      "Инженерийн нарийвчилсан зураг төсөл",
      "Detailed engineering design",
    ),
    status: text("2021 онд ашиглалтад орсон", "Opened in 2021"),
    length: "220 m",
    bridgeType: text("Төмөрбетон гүүр", "Reinforced concrete bridge"),
    summary: text(
      "Орхон голын Онгоцтойн амны төмөрбетон гүүрийн инженерийн нарийвчилсан зураг төслийг ГБЭТ ХХК боловсруулсан.",
      "GBET prepared the detailed engineering design for the reinforced concrete bridge at Ongotstoi on the Orkhon River.",
    ),
    featured: false,
    verificationStatus: "verified",
    source: "https://mrt.gov.mn/i/2804",
    sourceNote: text(
      "Зам, тээврийн яам · 2021.09.27",
      "Ministry of Road and Transport · 27 September 2021",
    ),
  },
  {
    slug: "tuul-railway",
    name: text("Туул голын төмөр замын гүүр", "Tuul River Railway Bridge"),
    location: text("Улаанбаатар · Хан-Уул", "Khan-Uul · Ulaanbaatar"),
    year: 2026,
    category: "rail",
    role: text(
      "Инженерийн нарийвчилсан зураг төсөл",
      "Detailed engineering design",
    ),
    status: text("Зураг төслийн бүртгэл · 2026.05", "Design record · May 2026"),
    summary: text(
      "Багахангай–Хөшигийн хөндий–Эмээлт чиглэлийн салбар төмөр замын Туул голын гүүрийн зураг төслийн бүртгэл.",
      "Engineering design record for the Tuul River bridge on the Bagakhangai–Khushig Valley–Emeelt branch railway.",
    ),
    featured: false,
    verificationStatus: "verified",
    source: "https://magadlal.rtdc.gov.mn/planInfoList/page:11",
    sourceNote: text(
      "Зам, тээврийн хөгжлийн төв · 2026.05.08",
      "Road and Transport Development Center · 8 May 2026",
    ),
  },
  {
    slug: "peace-bridge",
    name: text(
      "Энхтайваны гүүрийн өргөтгөл, хүчитгэл",
      "Peace Bridge Widening & Strengthening",
    ),
    location: text("Улаанбаатар · Хан-Уул", "Khan-Uul · Ulaanbaatar"),
    year: 2026,
    category: "rehabilitation",
    role: text(
      "Өргөтгөх, хүчитгэх ажлын зураг төсөл",
      "Widening and strengthening design",
    ),
    status: text("Зураг төслийн бүртгэл · 2026.05", "Design record · May 2026"),
    summary: text(
      "Энхтайваны гүүрийг өргөтгөх, хүчитгэх зураг төслийн гүйцэтгэгчээр ГБЭТ ХХК бүртгэгдсэн.",
      "GBET is recorded as the designer for widening and strengthening Peace Bridge.",
    ),
    featured: false,
    verificationStatus: "verified",
    source: "https://magadlal.rtdc.gov.mn/planInfoList/page:10",
    sourceNote: text(
      "Зам, тээврийн хөгжлийн төв · 2026.05.19",
      "Road and Transport Development Center · 19 May 2026",
    ),
  },
  {
    slug: "naadamchid-connection",
    name: text(
      "Наадамчдын авто замын гүүрэн холбоос",
      "Naadamchid Road Bridge Connection",
    ),
    location: text("Улаанбаатар · Хан-Уул", "Khan-Uul · Ulaanbaatar"),
    year: 2024,
    category: "urban",
    role: text("Гүүрэн байгууламжийн зураг төсөл", "Bridge structure design"),
    status: text(
      "Зураг төслийн бүртгэл · 2024.11",
      "Design record · November 2024",
    ),
    summary: text(
      "Туулын авто замыг Нисэхийн хурдны замтай холбож, Наадамчдын авто зам дээгүүрх гүүрэн байгууламжийн зураг төсөл.",
      "Design record for a bridge over Naadamchid Road connecting the Tuul road with the airport expressway.",
    ),
    featured: false,
    verificationStatus: "verified",
    source: "https://magadlal.rtdc.gov.mn/planInfoList/page:42",
    sourceNote: text(
      "Зам, тээврийн хөгжлийн төв · 2024.11.14",
      "Road and Transport Development Center · 14 November 2024",
    ),
  },
  {
    slug: "mg-modular-bridge",
    name: text("MG модуль гүүр", "MG Modular Bridge"),
    location: text("Монгол Улс", "Mongolia"),
    year: 2013,
    category: "innovation",
    role: text("Хамтарсан төслийн баг", "Joint project team"),
    status: text(
      "Хамтын ажиллагаа · 2013 оны эх сурвалж",
      "Collaboration · 2013 source record",
    ),
    summary: text(
      "SRP Schneider & Partner, SRP Engineer Consulting Mongolia болон ГБЭТ-ийн хамтарсан модуль гүүрийн санаачилга.",
      "A modular bridge initiative involving SRP Schneider & Partner, SRP Engineer Consulting Mongolia and GBET.",
    ),
    featured: false,
    verificationStatus: "verified",
    source: "https://www.srp-mongolia.mn/en/projects/mg-modular-bridge",
    sourceNote: text(
      "SRP Engineer Consulting Mongolia · 2013.05.20",
      "SRP Engineer Consulting Mongolia · 20 May 2013",
    ),
  },
];
const brochureNote = text(
  "ГБЭТ · Захиалагчийн өгсөн компанийн танилцуулга",
  "GBET · Client-supplied company portfolio",
);
projects.unshift(
  {
    slug: "sonsgolon",
    name: text("Сонсголонгийн гүүр", "Sonsgolon Bridge"),
    location: text("Улаанбаатар · Хан-Уул", "Khan-Uul · Ulaanbaatar"),
    category: "bridges",
    status: text("Компанийн төслийн танилцуулга", "Company portfolio record"),
    length: "289.4 m",
    bridgeType: text("Төмөрбетон гүүр", "Reinforced concrete bridge"),
    summary: text(
      "Туул голын Сонсголонгийн 289.4 метр төмөрбетон гүүрийг ГБЭТ-ийн компанийн танилцуулгад зураг төслийн дүрслэл болон барилгын гэрэл зургаар танилцуулсан.",
      "GBET’s company portfolio presents the 289.4 m reinforced concrete bridge over the Tuul River at Sonsgolon with a design rendering and construction photography.",
    ),
    featured: true,
    verificationStatus: "verified",
    source: "",
    sourceNote: brochureNote,
    image: {
      src: asset("/projects/sonsgolon-render.webp"),
      source: "Client-supplied portfolio, page 4",
      copyrightOwner: "Client-supplied; creator credit not provided",
      usageApproved: true,
      kind: "rendering",
      alt: text(
        "Сонсголонгийн гүүрийн зураг төслийн дүрслэл",
        "Design rendering of Sonsgolon Bridge",
      ),
    },
  },
  {
    slug: "ikh-tamir",
    name: text("Их Тамирын голын гүүр", "Ikh Tamir River Bridge"),
    location: text("Архангай · Батцэнгэл", "Battsengel · Arkhangai"),
    category: "bridges",
    status: text("Компанийн төслийн танилцуулга", "Company portfolio record"),
    length: "198 m",
    bridgeType: text("Төмөрбетон гүүр", "Reinforced concrete bridge"),
    summary: text(
      "Архангай аймгийн Батцэнгэл сумын Их Тамирын голын 198 метр төмөрбетон гүүр. Компанийн танилцуулгын гэрэл зураг.",
      "The 198 m reinforced concrete bridge over the Ikh Tamir River in Battsengel, Arkhangai. Photograph from the company portfolio.",
    ),
    featured: true,
    verificationStatus: "verified",
    source: "",
    sourceNote: brochureNote,
    image: {
      src: asset("/projects/ikh-tamir.webp"),
      source: "Client-supplied portfolio, page 22",
      copyrightOwner: "Client-supplied; photographer credit not provided",
      usageApproved: true,
      kind: "photograph",
      alt: text(
        "Их Тамирын голын гүүрийг голын эргээс харсан гэрэл зураг",
        "Ikh Tamir River Bridge photographed from the riverbank",
      ),
    },
  },
  {
    slug: "tavantolgoi-zuunbayan",
    name: text(
      "Тавантолгой–Зүүнбаян төмөр замын гүүрүүд",
      "Tavantolgoi–Zuunbayan Railway Bridges",
    ),
    location: text("Монгол Улс", "Mongolia"),
    category: "rail",
    status: text("Компанийн төслийн танилцуулга", "Company portfolio record"),
    bridgeType: text(
      "Төмөрбетон төмөр замын гүүр",
      "Reinforced concrete railway bridge",
    ),
    summary: text(
      "Тавантолгой–Зүүнбаян чиглэлийн төмөр замын гүүрүүдийг компанийн танилцуулгад барилгын үеийн гэрэл зургаар харуулсан.",
      "The company portfolio documents bridges on the Tavantolgoi–Zuunbayan railway with construction-stage photography.",
    ),
    featured: true,
    verificationStatus: "verified",
    source: "",
    sourceNote: brochureNote,
    image: {
      src: asset("/projects/railway-construction.webp"),
      source: "Client-supplied portfolio, page 32",
      copyrightOwner: "Client-supplied; photographer credit not provided",
      usageApproved: true,
      kind: "photograph",
      alt: text(
        "Тавантолгой–Зүүнбаян төмөр замын гүүрийн барилгын үе",
        "Railway bridge construction on the Tavantolgoi–Zuunbayan route",
      ),
    },
  },
);
export const credential = {
  registry: "2089491",
  number: "2022/01/006",
  start: "2022-04-01",
  end: "2027-04-01",
  source: "https://mrt.gov.mn/i/3663",
  caveat: text(
    "Яамны нийтэлсэн бүртгэл дэх хугацаа. Одоогийн эрхийн төлөвийг тусад нь нягтална.",
    "Validity period recorded in the Ministry’s published register. Current licence standing requires separate confirmation.",
  ),
};
