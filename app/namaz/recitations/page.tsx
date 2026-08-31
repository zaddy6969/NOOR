import type { Metadata } from "next";
import FocusedGuideShell from "../FocusedGuideShell";
import { phraseCards } from "../guide-data";

export const metadata: Metadata = {
  title: "Essential Salah Recitations — Arabic & Meaning",
  description: "Revise essential Salah recitations with Arabic, a Roman reading aid and concise English meanings.",
  alternates: { canonical: "/namaz/recitations" },
};

export default function RecitationsGuidePage() {
  return <FocusedGuideShell current="recitations" eyebrow="ARABIC, ROMAN & MEANING" title="Essential recitations" intro="Open only the phrase you need. Arabic remains primary; the Roman line is a memory aid and correct pronunciation should be learned from a qualified teacher." source="Qur’an text · Hadith-reported supplications">
    <section className="namaz-section namaz-focus-section">
      <div className="recitation-list">{phraseCards.map((phrase,index) => <details open={index === 0} key={phrase.title}><summary><span>{String(index + 1).padStart(2,"0")}</span><div><strong>{phrase.title}</strong><small>{phrase.when}</small></div><i aria-hidden="true">+</i></summary><div className="recitation-body"><p className="arabic" lang="ar" dir="rtl">{phrase.arabic}</p><p className="roman"><span>ROMAN READING AID</span>{phrase.roman}</p><p className="meaning"><span>CONCISE MEANING</span>{phrase.meaning}</p></div></details>)}</div>
      <div className="qunut-card"><span>WITR WAJIB · HANAFI</span><h2>Dua-e-Qunoot</h2><p>In the third Rak‘ah of Witr, after al-Fatihah and another Surah, say Takbir with the Hanafi hand movement and read Dua-e-Qunoot before Ruku‘. Revise the full wording with a qualified teacher.</p><strong className="contained-reference">Reference: Method of Salah — Hanafi</strong></div>
    </section>
  </FocusedGuideShell>;
}
