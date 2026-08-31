import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import DaroodLibrary from "./DaroodLibrary";

export const metadata: Metadata = {
  title: "Darood Sharif Library — Arabic, Roman & Meaning",
  description: "Read several Darood and Salawat in Arabic with Roman reading help, meanings, source labels, copy, save and Tasbih counting.",
  alternates: { canonical: "/darood" },
  openGraph: { title: "Darood Sharif Library | NOOR", description: "Prophetic and traditional Salawat in a focused reader.", images: [] },
  twitter: { card: "summary", title: "Darood Sharif Library | NOOR", description: "Read, save and count Darood Sharif.", images: [] },
};

export default function DaroodPage() {
  return (
    <main className="darood-page">
      <ToolHeader title="DAROOD SHARIF" subtitle="Arabic · Roman reading · Meaning" />
      <section className="tool-page-intro darood-intro">
        <div><p>SALAWAT LIBRARY</p><h1>Send peace and blessings<br/>{" "}<em>with understanding.</em></h1></div>
        <p>Hadith-reported wordings and later traditional collections are labelled separately. Open only the Darood you want, then copy, save or use its private counter.</p>
      </section>
      <DaroodLibrary />
      <section className="tool-reference-strip">
        <div><span>QURAN 33:56</span><strong>Believers are commanded to invoke blessings and peace upon the Prophet ﷺ.</strong><p>Roman text is only a reading aid. Learn Arabic pronunciation from a qualified teacher and avoid attaching guaranteed benefits to a wording without reliable evidence.</p></div>
        <Link href="/quran?surah=33&ayah=56">Read the Ayah inside NOOR →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
