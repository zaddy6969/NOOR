import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderUtilities } from "../site/SiteUtilities";
import NamazReadingProgress from "./NamazReadingProgress";

const routes = [
  ["wudu", "Wudu"],
  ["salah", "Salah"],
  ["recitations", "Recitations"],
  ["mistakes", "Mistakes"],
] as const;

export default function FocusedGuideShell({
  current,
  eyebrow,
  title,
  intro,
  source,
  children,
}: {
  current: typeof routes[number][0];
  eyebrow: string;
  title: string;
  intro: string;
  source: string;
  children: ReactNode;
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: intro,
    mainEntityOfPage: `https://noor-daily-muslim.vercel.app/namaz/${current}`,
    author: { "@type": "Organization", name: "NOOR Daily Muslim" },
    publisher: { "@type": "Organization", name: "NOOR Daily Muslim", logo: { "@type": "ImageObject", url: "https://noor-daily-muslim.vercel.app/favicon.svg" } },
    dateModified: "2026-08-31",
    inLanguage: "en",
  };
  return (
    <main className="namaz-page namaz-focus-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <NamazReadingProgress />
      <header className="namaz-topbar">
        <Link className="brand" href="/" aria-label="Back to NOOR home"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link>
        <nav aria-label="Focused prayer guides">{routes.map(([slug, label]) => <Link className={current === slug ? "active" : ""} href={`/namaz/${slug}`} aria-current={current === slug ? "page" : undefined} key={slug}>{label}</Link>)}</nav>
        <aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="namaz-home-link" href="/namaz">Complete guide</Link></aside>
      </header>

      <section className="namaz-focus-hero">
        <div><p className="eyebrow"><span/> {eyebrow}</p><h1>{title}</h1><p>{intro}</p></div>
        <aside><span>REFERENCE BASIS</span><strong>{source}</strong><p>Educational guidance · Hanafi framing is labelled where rulings differ.</p></aside>
      </section>

      <nav className="namaz-focus-tabs" aria-label="Choose a focused prayer guide">
        {routes.map(([slug, label], index) => <Link className={current === slug ? "active" : ""} href={`/namaz/${slug}`} aria-current={current === slug ? "page" : undefined} key={slug}><span>{String(index + 1).padStart(2, "0")}</span>{label}</Link>)}
      </nav>

      <article className="namaz-focus-content">{children}</article>

      <footer className="namaz-focus-footer"><div><strong>Need the full context?</strong><p>Open the complete guide for prayer times, Ghusl, congregation, travel, Qada, FAQs and all named sources.</p></div><Link href="/namaz">Open complete guide →</Link></footer>
    </main>
  );
}
