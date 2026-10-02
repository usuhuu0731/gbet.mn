import { asset } from "../lib/paths";
export default function manifest() {
  return {
    name: "GBET Consulting Engineers",
    short_name: "GBET",
    start_url: asset("/mn/"),
    display: "browser",
    background_color: "#f3f2ee",
    theme_color: "#003dff",
    icons: [{ src: asset("/logo-mark.png"), sizes: "192x192", type: "image/png" }],
  };
}
