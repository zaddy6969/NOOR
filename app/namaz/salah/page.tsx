import type { Metadata } from "next";
import FocusedGuideShell from "../FocusedGuideShell";
import StepLearningMode from "../StepLearningMode";
import { rakahRows, salahSteps } from "../guide-data";

export const metadata: Metadata = {
  title: "How to Pray Salah — Step-by-Step Hanafi Guide",
  description: "Learn the Salah sequence from intention and Takbir to Ruku, Sajdah, final sitting and Salam, with a compact Hanafi Rak‘ah planner.",
  alternates: { canonical: "/namaz/salah" },
};

export default function SalahGuidePage() {
  return <FocusedGuideShell current="salah" eyebrow="COMPLETE SEQUENCE · FOCUSED GUIDE" title="How to perform Salah" intro="Move through one step at a time, save your place privately, then review how the two-, three- and four-Rak‘ah forms fit together." source="Sahih al-Bukhari 631 · Qur’an 4:103 · Hanafi method">
    <section className="namaz-section namaz-focus-section">
      <div className="hadith-strip"><span>PROPHETIC METHOD</span><p>“Pray as you have seen me praying.”</p><strong>Sahih al-Bukhari 631</strong></div>
      <StepLearningMode label="Salah" storageKey="noor-namaz-salah-step-v1" steps={salahSteps} />
      <div className="rakats-explainer">
        <article><span>2 RAK‘AHS</span><p>After the second Sajdah, sit for Tashahhud, Darood and dua, then finish with Salam.</p></article>
        <article><span>3 RAK‘AHS</span><p>After Tashahhud in Rak‘ah two, stand. In the third Fard Rak‘ah recite al-Fatihah, then complete the final sitting.</p></article>
        <article><span>4 RAK‘AHS</span><p>After the first sitting, stand for Rak‘ahs three and four. Complete the final sitting after the fourth.</p></article>
      </div>
      <h2 className="subheading">Daily Rak‘ah planner · Hanafi</h2>
      <div className="rakah-table"><div className="rakah-row rakah-head"><span>Prayer</span><span>Before Fard</span><span>Fard</span><span>After Fard</span><span>Total shown</span></div>{rakahRows.map((row) => <div className="rakah-row" key={row[0]}>{row.map((cell,index) => index === 0 ? <strong key={cell}>{cell}</strong> : <span key={cell}>{cell}</span>)}</div>)}</div>
      <p className="table-footnote">The five daily Fard prayers total 17 Rak‘ahs. “Total shown” also includes the commonly taught Sunnah, Witr and optional Nafl listed here.</p>
      <div className="difference-note"><span>FOLLOWING AN IMAM</span><p>Join the Imam’s movements without going ahead. In the Hanafi school, a follower remains silent during the Imam’s Qur’an recitation. Learn latecomer rules before completing missed Rak‘ahs.</p></div>
    </section>
  </FocusedGuideShell>;
}
