import type { Metadata } from "next";
import FocusedGuideShell from "../FocusedGuideShell";

export const metadata: Metadata = {
  title: "Salah Mistakes & Sajdah Sahw — Hanafi Guide",
  description: "Understand the difference between an omitted Fard, a forgotten Wajib and a missed Sunnah, plus the common Hanafi Sajdah Sahw method.",
  alternates: { canonical: "/namaz/mistakes" },
};

export default function SalahMistakesPage() {
  return <FocusedGuideShell current="mistakes" eyebrow="CORRECTION & VALIDITY · FOCUSED GUIDE" title="Mistakes and Sajdah Sahw" intro="Not every mistake has the same ruling. First identify whether a Fard, Wajib or Sunnah was affected; do not apply Sajdah Sahw automatically to every doubt." source="Recognized Hanafi fiqh manuals · case-specific review required">
    <section className="namaz-section namaz-focus-section">
      <div className="mistake-grid">
        <article><span>FARD OMITTED</span><h2>Prayer is not completed</h2><p>If an obligatory element such as Ruku‘ or a Sajdah is genuinely omitted and not corrected within its rules, Sajdah Sahw alone cannot replace it.</p></article>
        <article><span>WAJIB FORGOTTEN</span><h2>Sajdah Sahw may be due</h2><p>Forgetting a Wajib, delaying a Fard or certain sequence errors can require two prostrations of forgetfulness. Exact cases matter.</p></article>
        <article><span>SUNNAH MISSED</span><h2>Prayer generally remains valid</h2><p>Leaving Sunnah diminishes completeness and reward; persistent abandonment of emphasized Sunnah is serious.</p></article>
      </div>
      <div className="sahw-method"><div><span>COMMON HANAFI METHOD</span><h2>How Sajdah Sahw is performed</h2></div><ol><li>In the final sitting, read Tashahhud.</li><li>Give one Salam to the right.</li><li>Perform two Sajdahs with the normal Takbirs.</li><li>Sit again and read Tashahhud, Darood and dua.</li><li>Finish with both Salams.</li></ol><p>Ask a scholar when you are unsure what was missed or when the error was discovered.</p></div>
      <div className="invalidators-list"><h2>Actions that can invalidate Salah</h2><div>{["Wudu breaking during prayer","Speaking ordinary words","Eating or drinking","Turning the chest away from Qibla","Substantial exposure of required ‘awrah","Excessive unrelated movement","Omitting an obligatory posture","Laughing audibly in prayer"].map((item) => <span key={item}>× {item}</span>)}</div></div>
      <div className="difference-note"><span>IMPORTANT BOUNDARY</span><p>Doubt, repetition and unusual circumstances can change the ruling. This compact guide cannot diagnose an individual prayer; use it to identify the issue, then ask a qualified scholar when validity is uncertain.</p></div>
    </section>
  </FocusedGuideShell>;
}
