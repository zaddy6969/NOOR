import type { Metadata } from "next";
import Link from "next/link";
import QuranReader from "./QuranReader";

export const metadata: Metadata = {
  title: "Read the Quran — Arabic, English Meaning & Audio | NOOR",
  description: "Browse all 114 Surahs and read every Ayah in Arabic with English meaning, audio recitation and verse navigation.",
  openGraph: { title: "Read the Quran | NOOR", description: "All 114 Surahs with Arabic, English meaning and audio.", images: [] },
  twitter: { card: "summary", title: "Read the Quran | NOOR", description: "All 114 Surahs with Arabic, English meaning and audio.", images: [] },
};

export default function QuranPage() {
  return (
    <main className="quran-page" id="top">
      <header className="quran-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><div><strong>AL-QURAN</strong><span>Arabic · English meaning · Audio</span></div><Link className="topic-home-link" href="/">← Home</Link></header>
      <QuranReader />
    </main>
  );
}
