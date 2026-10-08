import { text, type Localized } from "./site";

export interface LicenceRecord {
  id: string;
  title: Localized;
  number: string;
  issuedOn: string;
  termYears: number;
  scopes: { code?: string; description: Localized }[];
  publicSource?: string;
}

// Public transcription only. Original certificate images stay outside the repository.
// Dates and terms describe the certificates, not a live check of licence standing.
export const licenceRegistry = "2089491";
export const licences: LicenceRecord[] = [
  {
    id: "design-feasibility",
    title: text("Зураг төсөл ба ТЭЗҮ.", "Design & feasibility studies."),
    number: "2022/01/006",
    issuedOn: "2022-04-01",
    termYears: 5,
    scopes: [
      {
        code: "2.8.1.1",
        description: text(
          "Техник-эдийн засгийн үндэслэл боловсруулах",
          "Preparation of feasibility studies",
        ),
      },
      {
        code: "2.8.1.4",
        description: text(
          "Хотын авто зам, замын байгууламжийн зураг төсөл боловсруулах",
          "Design of urban roads and road structures",
        ),
      },
      {
        code: "2.8.1.7",
        description: text(
          "Гүүр, туннелийн зураг төсөл боловсруулах",
          "Design of bridges and tunnels",
        ),
      },
    ],
    publicSource: "https://mrt.gov.mn/i/3663",
  },
  {
    id: "technical-supervision",
    title: text(
      "Техник, технологийн хяналт.",
      "Technical supervision consultancy.",
    ),
    number: "2026/03/017",
    issuedOn: "2026-01-27",
    termYears: 5,
    scopes: [
      {
        description: text(
          "Авто зам, замын байгууламжийг барих, засварлахад техник, технологийн хяналт тавих зөвлөх үйлчилгээ үзүүлэх",
          "Consultancy for technical and technological supervision of road and road-structure construction and repair",
        ),
      },
    ],
  },
];
