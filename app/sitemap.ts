import type { MetadataRoute } from "next";
import { topics } from "./topics/topic-data";
import { naatEntries } from "./naat/naat-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://noor-daily-muslim.vercel.app";
const routes = [
  "",
  "/duas",
  "/offline",
  "/corrections",
  "/quran",
  "/prayer-times",
  "/namaz",
  "/namaz/wudu",
  "/namaz/salah",
  "/namaz/recitations",
  "/namaz/mistakes",
  "/qibla",
  "/islamic-calendar",
  "/mosque-finder",
  "/darood",
  "/naat",
  "/zakat-calculator",
  "/qaza-namaz",
  "/glossary",
  "/shop",
  "/destinations",
  "/religious-tourism",
  "/family-tree",
  "/matrimony",
  "/about",
  "/privacy",
  "/terms",
  "/editorial-policy",
  "/content-review",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((route, index) => ({
      url: `${SITE_URL}${route}`,
      changeFrequency: index === 0 ? ("daily" as const) : ("weekly" as const),
      priority: index === 0 ? 1 : 0.7,
    })),
    ...topics.map((topic) => ({
      url: `${SITE_URL}/topics/${topic.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...naatEntries.map((entry) => ({
      url: `${SITE_URL}/naat/${entry.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
