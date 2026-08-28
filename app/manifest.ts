import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOOR — Daily Muslim Companion",
    short_name: "NOOR",
    description: "Quran, prayer times, Qibla, Islamic calendar and trusted Islamic learning for everyday use.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3e9",
    theme_color: "#0e5a43",
    orientation: "any",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
