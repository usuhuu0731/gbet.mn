import { text, type Localized } from "./site";

export interface TeamMember {
  id: string;
  name: Localized;
  role: Localized;
  portraitId?: string;
  biography?: Localized;
}

// Public projection of the six names and roles supplied by the company.
// Keep the supplied Mongolian spelling in both locales until Latin spelling is approved.
export const team: TeamMember[] = [
  {
    id: "erkhembayar",
    portraitId: "portrait-erkhembayar",
    name: text("Б. Эрхэмбаяр", "Б. Эрхэмбаяр"),
    role: text(
      "Захирал · Монгол Улсын зөвлөх инженер",
      "Director · Consulting Engineer of Mongolia",
    ),
  },
  {
    id: "todgerel",
    portraitId: "portrait-todgerel",
    name: text("Э. Тодгэрэл", "Э. Тодгэрэл"),
    role: text("Ерөнхий инженер", "Chief Engineer"),
  },
  {
    id: "baigal",
    portraitId: "portrait-baigal",
    name: text("Э. Байгал", "Э. Байгал"),
    role: text("Санхүү хариуцсан захирал", "Finance Director"),
  },
  {
    id: "mendsaikhan",
    portraitId: "portrait-mendsaikhan",
    name: text("М. Мэндсайхан", "М. Мэндсайхан"),
    role: text("Хууль, эрх зүйн хэлтсийн дарга", "Head of Legal Department"),
  },
  {
    id: "purevdagva",
    portraitId: "portrait-purevdagva",
    name: text("Ж. Пүрэвдагва", "Ж. Пүрэвдагва"),
    role: text(
      "Төслийн гүйцэтгэл хариуцсан хэлтсийн дарга",
      "Head of Project Delivery Department",
    ),
  },
  {
    id: "usukhbayar",
    portraitId: "portrait-usukhbayar",
    name: text("С. Өсөхбаяр", "С. Өсөхбаяр"),
    role: text("Зургийн инженер", "Design Engineer"),
  },
];

// Put only reviewed, publication-approved copy here. Drafts live outside this repository.
export const directorMessage: { approved: boolean; paragraphs: Localized[] } = {
  approved: false,
  paragraphs: [],
};
