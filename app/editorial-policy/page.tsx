import type { Metadata } from "next";
import TrustPage from "../trust/TrustPage";

export const metadata: Metadata = { title: "Editorial Policy", description: "How NOOR sources, labels and reviews Islamic educational content.", alternates: { canonical: "/editorial-policy" } };

export default function EditorialPolicyPage() {
  return <TrustPage title="Editorial Policy" kicker="SOURCES, LABELS AND CORRECTIONS" intro="NOOR separates primary-text references, practical calculation choices, traditional material and editorial explanation so readers can understand what each claim is based on." sections={[
    { title: "Source order", points: ["Quran passages are cited by Surah and Ayah.", "Hadith references identify the collection and report number where possible.", "Calculation tools name the method or standard used.", "Travel, directory and map data identify their provider and uncertainty."] },
    { title: "Differences of opinion", paragraphs: ["Where recognized Sunni legal schools or local authorities differ, NOOR labels the selected method and avoids presenting a locality-dependent answer as universal."] },
    { title: "Traditional texts and Naats", paragraphs: ["Hadith-reported salawat are separated from later traditional compositions. Poem authorship, edition status, translation and recording rights are separate questions; media remains attributed to its source platform."] },
    { title: "Review status", paragraphs: ["Static educational material may carry a review-pending notice until a qualified scholar has checked it. A general content review is not a personal fatwa and does not remove the need for local advice."] },
    { title: "Corrections", paragraphs: ["Corrections should identify the exact page, statement and supporting primary source. Material changes are published with the website source so they can be traced through deployment history."] },
  ]} />;
}
