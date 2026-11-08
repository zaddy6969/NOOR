import type { Metadata } from "next";
import Link from "next/link";
import ToolHeader from "../site/ToolHeader";
import SiteFooter from "../site/SiteFooter";
import { LocaleText } from "../site/SiteUtilities";
import { faithTopics, knowledgeTopics, naatTopics, communityTopics } from "../topics/topic-data";

export const metadata: Metadata = {
  title: "All features",
  description: "Find every NOOR tool, Islamic learning guide and community section in one place.",
  alternates: { canonical: "/features" },
};
const groups = [
  ["Daily tools", [
    ["Quran", "/quran"], ["Duas & Adhkar", "/duas"], ["Prayer Times", "/prayer-times"],
    ["Prayer reminders", "/prayer-times#reminders"], ["Qibla", "/qibla"], ["Islamic Calendar", "/islamic-calendar"],
    ["Darood", "/darood"], ["99 Names", "/names"], ["Saved", "/saved"],
    ["Zakat Calculator", "/zakat-calculator"], ["Qaza prayers", "/qaza-namaz"],
    ["Islamic glossary", "/glossary"], ["Offline Downloads", "/offline"],
  ]],
  ["Prayer & Wudu", [
    ["Prayer guide", "/namaz"], ["Wudu", "/namaz/wudu"], ["Salah step by step", "/namaz/salah"],
    ["Prayer recitations", "/namaz/recitations"], ["Common prayer mistakes", "/namaz/mistakes"],
  ]],
  ["Faith & learning", faithTopics.map(topic => [topic.title, `/topics/${topic.slug}`])],
  ["History & knowledge", [
    ["Interactive family tree", "/family-tree"],
    ...knowledgeTopics.map(topic => [topic.title, `/topics/${topic.slug}`]),
  ]],
  ["Naat & literature", [
    ["Naat & Salam", "/naat"], ...naatTopics.map(topic => [topic.title, `/topics/${topic.slug}`]),
  ]],
  ["Places & community", [
    ["Nearby mosques", "/mosque-finder"], ["Muslim destinations", "/destinations"],
    ["Travel & heritage", "/religious-tourism"], ["Product ideas · no checkout", "/shop"],
    ["Matrimony · not yet open", "/matrimony"],
    ...communityTopics.map(topic => [topic.title, `/topics/${topic.slug}`]),
  ]],
  ["About & support", [
    ["About NOOR", "/about"], ["Report a correction", "/corrections"],
    ["Editorial policy", "/editorial-policy"], ["Content review", "/content-review"],
    ["Privacy", "/privacy"], ["Terms", "/terms"],
  ]],
] as const;
export default function FeaturesPage() {
  return <main className="noor-home-v2">
    <ToolHeader title="All features" subtitle="" />
    <div className="feature-directory">
      <h1><LocaleText text="All features" /></h1>
      <p><LocaleText text="Every NOOR tool and guide, in one place." /></p>
      <div className="feature-directory-grid">
        {groups.map(([title, links]) => <section key={title}>
          <h2><LocaleText text={title} /></h2>
          <ul>{links.map(([label, href]) => <li key={href}><Link href={href}><LocaleText text={label} /></Link></li>)}</ul>
        </section>)}
      </div>
    </div>
    <SiteFooter compact />
  </main>;
}
