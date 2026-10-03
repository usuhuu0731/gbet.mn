import { text, type Localized } from "./site";

export interface MediaAsset {
  src: string;
  mobileSrc?: string;
  width: number;
  height: number;
  kind: "photograph" | "rendering" | "portrait" | "concept";
  alt: Localized;
  position: string;
  mobilePosition?: string;
  source: string;
  usageApproved: boolean;
}

// Paths are relative to public/. Portrait permission is independent of name/role approval.
export const media: Record<string, MediaAsset> = {
  "portrait-baigal": {
    src: "/team/baigal.jpg",
    width: 853,
    height: 1280,
    kind: "portrait",
    position: "center 16%",
    alt: text("Э. Байгалын хөрөг", "Portrait of Э. Байгал"),
    source: "Company-supplied staff image",
    usageApproved: true,
  },
  "portrait-mendsaikhan": {
    src: "/team/mendsaikhan.jpg",
    width: 1280,
    height: 960,
    kind: "portrait",
    position: "65% center",
    alt: text("М. Мэндсайханы хөрөг", "Portrait of М. Мэндсайхан"),
    source: "Company-supplied staff image",
    usageApproved: true,
  },
  "portrait-purevdagva": {
    src: "/team/purevdagva.jpg",
    width: 1024,
    height: 1280,
    kind: "portrait",
    position: "center",
    alt: text("Ж. Пүрэвдагвын хөрөг", "Portrait of Ж. Пүрэвдагва"),
    source: "Company-supplied staff image",
    usageApproved: true,
  },
  "portrait-usukhbayar": {
    src: "/team/usukhbayar.jpg",
    width: 947,
    height: 1280,
    kind: "portrait",
    position: "center top",
    alt: text("С. Өсөхбаярын хөрөг", "Portrait of С. Өсөхбаяр"),
    source: "Company-supplied staff image",
    usageApproved: true,
  },
  "ikh-tamir": {
    src: "/projects/ikh-tamir.webp",
    // A tall hero covers by height: the 900×562 derivative visibly upscales on phones.
    // Keep the original's 1153 px height until an authorized portrait crop is supplied.
    mobileSrc: "/projects/ikh-tamir.webp",
    width: 1846,
    height: 1153,
    kind: "photograph",
    position: "center 54%",
    mobilePosition: "63% center",
    alt: text(
      "Их Тамирын голын төмөрбетон гүүр",
      "Reinforced concrete bridge over the Ikh Tamir River",
    ),
    source: "Client-supplied portfolio, page 22",
    usageApproved: true,
  },
  sonsgolon: {
    src: "/projects/sonsgolon-render.webp",
    width: 1336,
    height: 662,
    kind: "rendering",
    position: "center",
    alt: text(
      "Сонсголонгийн гүүрийн зураг төслийн дүрслэл",
      "Design rendering of Sonsgolon Bridge",
    ),
    source: "Client-supplied portfolio, page 4",
    usageApproved: true,
  },
  "tavantolgoi-zuunbayan": {
    src: "/projects/railway-construction.webp",
    width: 1320,
    height: 824,
    kind: "photograph",
    position: "center",
    alt: text(
      "Тавантолгой–Зүүнбаян төмөр замын гүүрийн барилгын үе",
      "Railway bridge construction on the Tavantolgoi–Zuunbayan route",
    ),
    source: "Client-supplied portfolio, page 32",
    usageApproved: true,
  },
};
