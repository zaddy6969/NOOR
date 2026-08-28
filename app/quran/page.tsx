import type { Metadata } from "next";
import Link from "next/link";
import { HeaderUtilities } from "../site/SiteUtilities";
import QuranReader from "./QuranReader";

export const metadata: Metadata = {
  title: "Read the Quran — Arabic, English Meaning & Audio | NOOR",
  description: "Browse all 114 Surahs and read every Ayah in Arabic with English meaning, audio recitation and verse navigation.",
  alternates: { canonical: "/quran" },
  openGraph: { title: "Read the Quran | NOOR", description: "All 114 Surahs with Arabic, English meaning and audio.", images: [] },
  twitter: { card: "summary", title: "Read the Quran | NOOR", description: "All 114 Surahs with Arabic, English meaning and audio.", images: [] },
};

type PageProps = { searchParams: Promise<{ surah?: string; ayah?: string }> };

export default async function QuranPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const requestedSurah = Number(query.surah ?? 1);
  const requestedAyah = Number(query.ayah ?? 0);
  const initialSurah = Number.isInteger(requestedSurah) && requestedSurah >= 1 && requestedSurah <= 114 ? requestedSurah : 1;
  const initialAyah = Number.isInteger(requestedAyah) && requestedAyah >= 1 ? requestedAyah : null;
  return (
    <main className="quran-page" id="top">
      <header className="quran-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><div><strong>AL-QURAN</strong><span>Arabic · English meaning · Audio</span></div><aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← Home</Link></aside></header>
      <QuranReader initialSurah={initialSurah} initialAyah={initialAyah} />
    </main>
  );
}
