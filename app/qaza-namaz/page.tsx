import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import QazaCalculator from "./QazaCalculator";

export const metadata: Metadata = {
  title: "Qaza Namaz Calculator — Missed Prayer Plan",
  description: "Estimate missed Fajr, Dhuhr, Asr, Maghrib, Isha and Hanafi Witr prayers, then create a practical completion target.",
  alternates: { canonical: "/qaza-namaz" },
  openGraph: { title: "Qaza Namaz Calculator | NOOR", description: "A private missed-prayer estimate and completion plan.", images: [] },
  twitter: { card: "summary", title: "Qaza Namaz Calculator | NOOR", description: "Count and plan missed prayers privately.", images: [] },
};

export default function QazaNamazPage() {
  return (
    <main className="calculator-page">
      <ToolHeader title="QAZA NAMAZ" subtitle="Estimate · Plan · Complete steadily" />
      <section className="tool-page-intro">
        <div><p>PRIVATE PRAYER PLANNER</p><h1>Make a careful estimate.<br/>{" "}<em>Start from today.</em></h1></div>
        <p>Count a known date range or enter an estimated number of days. Exclude days when prayer was not legally due, and include Witr when following the Hanafi ruling.</p>
      </section>
      <QazaCalculator />
      <section className="tool-reference-strip">
        <div><span>PROPHETIC GUIDANCE</span><strong>A forgotten prayer is offered when remembered.</strong><p>This calculator supports planning; it does not decide disputed personal cases. If the period is uncertain, make a sincere reasonable estimate and confirm your plan with a qualified scholar.</p></div>
        <Link href="/namaz#special">Read NOOR’s Qaza guidance →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
