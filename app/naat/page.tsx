import type { Metadata } from "next";
import Link from "next/link";
import { HeaderUtilities } from "../site/SiteUtilities";
import NaatLibrary from "./NaatLibrary";
import { naatEntries } from "./naat-data";

export const metadata: Metadata = {
  title: "Naat & Salam Library | NOOR",
  description: "Browse Naat and Salam by title, writer, reciter and language, with separate audio and video players.",
  alternates: { canonical: "/naat" },
};

export default function NaatLibraryPage() {
  return (
    <main className="naat-library-page">
      <header className="quran-topbar compact-tool-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><div><strong>NAAT & SALAM</strong><span>Listen, watch or read</span></div><aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← Home</Link></aside></header>
      <div className="naat-library-heading"><p>NAAT LIBRARY</p><h1>Choose what you want to play.</h1><span>Audio and video are separate. The player stays open while you use NOOR.</span></div>
      <NaatLibrary entries={naatEntries} />
    </main>
  );
}
