import type { Metadata } from "next";
import Link from "next/link";
import FocusedGuideShell from "../FocusedGuideShell";
import StepLearningMode from "../StepLearningMode";
import { wuduSteps } from "../guide-data";

export const metadata: Metadata = {
  title: "Wudu Step by Step — Hanafi Guide",
  description: "Learn the Fard and Sunnah method of Wudu in a compact step-by-step guide with common invalidators and water-barrier checks.",
  alternates: { canonical: "/namaz/wudu" },
};

export default function WuduGuidePage() {
  return <FocusedGuideShell current="wudu" eyebrow="RITUAL PURITY · FOCUSED GUIDE" title="Wudu, step by step" intro="A compact learning path for ablution: the four obligatory washes, the complete Sunnah sequence, common barriers and frequent invalidators." source="Qur’an 5:6 · Sahih al-Bukhari · Sahih Muslim · Hanafi manuals">
    <section className="namaz-section namaz-focus-section">
      <div className="wudu-reference"><div><span>THE FOUR FARD ACTS · HANAFI</span><h2>Face · Arms · Head · Feet</h2><p>Wash the complete face, wash both arms including elbows, wipe at least one quarter of the head, and wash both feet including ankles.</p></div><Link href="/quran?surah=5&ayah=6">Read Qur’an 5:6 →</Link></div>
      <StepLearningMode label="Wudu" storageKey="noor-namaz-wudu-step-v1" steps={wuduSteps} />
      <div className="two-column-cards">
        <div className="rule-card positive"><span>SUNNAH & CARE</span><h3>Complete Wudu well</h3><ul><li>Follow the order without long gaps.</li><li>Wash the limbs three times where Sunnah.</li><li>Begin from the right.</li><li>Ensure water reaches dry folds and the spaces between fingers and toes.</li><li>Use only the water needed.</li></ul></div>
        <div className="rule-card warning"><span>WATER BARRIERS</span><h3>Check before washing</h3><ul><li>Nail polish and impermeable coatings.</li><li>Paint, glue or wax that blocks water.</li><li>Tight jewellery hiding dry skin.</li><li>Dry heels, elbows, beard area or skin folds.</li><li>Water-resistant makeup that forms a barrier.</li></ul></div>
      </div>
      <div className="breakers-panel"><div><p>COMMON HANAFI RULINGS</p><h3>What invalidates Wudu?</h3></div><ul><li>Anything exiting from the front or back passage.</li><li>Flowing blood, pus or discharge that moves beyond its wound.</li><li>A mouthful of vomit.</li><li>Deep sleep while lying, reclining or without a firmly seated posture.</li><li>Fainting, intoxication or loss of awareness.</li></ul></div>
      <div className="difference-note"><span>FIQH DIFFERENCES</span><p>Some invalidators differ across the four Sunni schools—for example skin contact, bleeding and laughter. Follow a reliable method consistently and ask a qualified scholar about uncertain cases.</p></div>
    </section>
  </FocusedGuideShell>;
}
