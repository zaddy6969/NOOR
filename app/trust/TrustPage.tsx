import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";

export type TrustSection = { title: string; paragraphs?: string[]; points?: string[] };

export default function TrustPage({ title, kicker, intro, sections }: { title: string; kicker: string; intro: string; sections: TrustSection[] }) {
  return (
    <main className="trust-page">
      <ToolHeader title={title.toUpperCase()} subtitle="Clear · Accountable · User-first" />
      <section className="trust-hero"><p>{kicker}</p><h1>{title}</h1><span>{intro}</span><small>Last reviewed 28 August 2026</small></section>
      <section className="trust-sections">{sections.map((section) => <article key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.points ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}</article>)}</section>
      <SiteFooter />
    </main>
  );
}
