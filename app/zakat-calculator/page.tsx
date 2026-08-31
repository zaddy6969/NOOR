import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import ZakatCalculator from "./ZakatCalculator";

export const metadata: Metadata = {
  title: "Zakat Calculator — Nisab & 2.5% Estimate",
  description: "Calculate a clear Zakat estimate from cash, gold, investments, business assets, receivables and short-term liabilities.",
  alternates: { canonical: "/zakat-calculator" },
  openGraph: { title: "Zakat Calculator | NOOR", description: "A private, in-browser Zakat estimate with gold, silver or custom Nisab.", images: [] },
  twitter: { card: "summary", title: "Zakat Calculator | NOOR", description: "Calculate Zakat privately in your browser.", images: [] },
};

export default function ZakatCalculatorPage() {
  return (
    <main className="calculator-page">
      <ToolHeader title="ZAKAT CALCULATOR" subtitle="Assets · Nisab · 2.5% estimate" />
      <section className="tool-page-intro">
        <div><p>ZAKAT PLANNING</p><h1>Calculate carefully,<br/>{" "}<em>without confusion.</em></h1></div>
        <p>Add only wealth that is actually Zakatable, choose a Nisab method, and review the estimate before paying. Your amounts remain in this browser and are not saved.</p>
      </section>
      <ZakatCalculator />
      <section className="tool-reference-strip">
        <div><span>FOUNDATION</span><strong>Zakat is an obligation and an act of worship.</strong><p>The Quran commands the establishment of Zakat and identifies eligible recipient categories. Personal assets, debts and business structures can require case-specific guidance.</p></div>
        <Link href="/quran?surah=9&ayah=60">Read Quran 9:60 inside NOOR →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
