import type { Metadata } from "next";
import TrustPage from "../trust/TrustPage";

export const metadata: Metadata = { title: "About NOOR", description: "What NOOR is, who it serves and how its daily Muslim tools are built.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <TrustPage title="About NOOR" kicker="A CALM DAILY MUSLIM COMPANION" intro="NOOR brings Quran reading, prayer tools and carefully labelled learning resources into one compact, accessible website." sections={[
    { title: "Our purpose", paragraphs: ["NOOR is designed for practical daily use: find a prayer time, read or listen to Quran, locate the Qibla, review a date, make dhikr or learn a topic without navigating a crowded portal."] },
    { title: "What NOOR is—and is not", points: ["An educational and planning companion, not a fatwa service.", "A privacy-conscious set of tools, not a public social network.", "A growing editorial library, not a replacement for qualified scholars or local religious authorities.", "A product request catalogue, not an active shop or payment service."] },
    { title: "Accuracy and improvement", paragraphs: ["Calculated dates, bearings and prayer times depend on selected methods, device sensors, location accuracy and external data providers. We show these limits where they matter and keep correction notes inside the relevant tool."] },
  ]} />;
}
