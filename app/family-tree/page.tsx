import type { Metadata } from "next";
import Link from "next/link";
import { HeaderUtilities } from "../site/SiteUtilities";
import FamilyTreeExplorer from "./FamilyTreeExplorer";

export const metadata: Metadata = {
  title: "Interactive Family Tree of Prophet Muhammad ﷺ",
  description: "Explore a respectful, text-only interactive family tree covering the Prophet’s parents, household, children and close descendants.",
  alternates: { canonical: "/family-tree" },
  openGraph: { title: "Interactive Family Tree | NOOR", description: "A respectful text-only lineage explorer.", images: [] },
  twitter: { card: "summary", title: "Interactive Family Tree | NOOR", description: "A respectful text-only lineage explorer.", images: [] },
};

export default function FamilyTreePage() {
  return (
    <main className="family-page" id="top">
      <header className="topic-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><nav><a href="#explorer">Interactive tree</a><Link href="/topics/family-tree">Full guide</Link><a href="#sources">Sources</a></nav><aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← Home</Link></aside></header>
      <section className="family-page-hero"><h1>The Prophet’s Family</h1><p>Select a name to see its relationship and sources.</p></section>
      <section id="explorer"><FamilyTreeExplorer /></section>
      <section className="family-sources" id="sources"><div><p className="eyebrow">READ & VERIFY</p><h2>Sources and editorial boundaries</h2><p>The Qur’an establishes the special status of the Prophet ﷺ and the Mothers of the Believers. Family names and relationships are presented from widely used seerah summaries, while detailed genealogical disputes remain outside this compact view.</p></div><div><Link href="/quran?surah=33&ayah=6"><span>QURAN 33:6</span><strong>The Prophet’s wives are Mothers of the Believers</strong></Link><Link href="/quran?surah=33&ayah=40"><span>QURAN 33:40</span><strong>Muhammad ﷺ is the Messenger of Allah and seal of the prophets</strong></Link><a className="family-source-note" href="https://sunnah.com/bukhari:3714" target="_blank" rel="noopener noreferrer"><span>SAHIH AL-BUKHARI 3714 ↗</span><strong>The virtue of Fatimah رضي الله عنها</strong></a><Link href="/topics/family-tree"><span>NOOR FULL GUIDE</span><strong>Open the detailed lineage notes and review policy</strong></Link></div></section>
      <footer className="topic-footer"><div><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><p>Respect, sources and clarity before decoration.</p></div><div><a href="#top">Back to top ↑</a><Link href="/">NOOR home</Link></div></footer>
    </main>
  );
}
