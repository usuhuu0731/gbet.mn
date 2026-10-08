import { text } from "./site";

// Company-confirmed operating history: Undraga in 1996, GBET from 2006.
// Rebuild the static site when advancing the anniversary's reference year.
export const companyExperience: {
  sinceYear: number | null;
  referenceYear: number;
} = {
  sinceYear: 1996,
  referenceYear: 2026,
};

export const companyHistory = {
  summary: text(
    "1996 онд “Ундрага” ХХК нэрээр үйл ажиллагаагаа эхэлж, 2006 оноос “ГБЭТ” ХХК нэрээр ажиллаж байна.",
    "The company began operating as “Ундрага” LLC in 1996 and has operated as GBET LLC since 2006.",
  ),
  milestones: [
    {
      year: "1996",
      title: text(
        "“Ундрага” ХХК нэрээр үйл ажиллагаагаа эхлүүлэв",
        "Began operating as “Ундрага” LLC",
      ),
    },
    {
      year: "2006",
      title: text(
        "“ГБЭТ” ХХК нэрээр үйл ажиллагаагаа үргэлжлүүлэв",
        "Continued operating as GBET LLC",
      ),
    },
  ],
};
