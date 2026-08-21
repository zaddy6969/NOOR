import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { naatEntries, naatMap } from "../naat-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return naatEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = naatMap.get(slug);
  if (!entry) return {};
  const title = `${entry.title} — Reader & Sources | NOOR`;
  return {
    title,
    description: entry.summary,
    openGraph: { title, description: entry.summary, images: [] },
    twitter: { card: "summary", title, description: entry.summary, images: [] },
  };
}

export default async function NaatPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = naatMap.get(slug);
  if (!entry) notFound();

  return (
    <main className="topic-page naat-full-page" id="top">
      <header className="topic-topbar">
        <Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link>
        <nav><a href="#about">About</a><a href="#notes">Reading notes</a><a href="#sources">Sources</a></nav>
        <Link className="topic-home-link" href="/#naat-library">← Naat library</Link>
      </header>

      <section className="naat-full-hero">
        <p className="eyebrow">{entry.genre} · VERIFIED READER</p>
        <h1>{entry.title}</h1>
        <div className="naat-full-credits"><span>WRITER</span><strong>{entry.writer}</strong><i/><span>RECITER</span><strong>{entry.reciter}</strong></div>
        <p>{entry.summary}</p>
        <div className="naat-full-languages">{entry.languages.map((language) => <span key={language}>{language}</span>)}</div>
      </section>

      <section className="naat-full-shell">
        <article className="naat-full-about" id="about">
          <div><p className="eyebrow">ABOUT THIS KALAM</p><h2>Meaning, attribution and context</h2></div>
          <div className="naat-theme-grid">{entry.themes.map((theme, index) => <div key={theme}><span>{String(index + 1).padStart(2, "0")}</span><strong>{theme}</strong></div>)}</div>
        </article>

        <article className="naat-text-status">
          <span>TEXT STATUS</span><h2>Full lyrics are in editorial review.</h2>
          <p>{entry.rights}</p>
          <div><b>Why this matters</b><p>NOOR does not copy lyrics from another website and call them verified. The original script, author, stanza order, transliteration, translation and theological notes are checked separately before a complete text is published.</p></div>
          <Link href="/topics/lyrics">Read the lyric publication standard →</Link>
        </article>

        <article className="naat-note-section" id="notes">
          <div className="topic-section-head"><span>N</span><div><p>EDITORIAL GUIDE</p><h2>Reading notes</h2><div>These notes make the page useful now while protecting the integrity of the work and the rights of writers, translators and reciters.</div></div></div>
          <div className="topic-item-grid">{entry.readingNotes.map((note) => <div className="topic-item" key={note.title}><span>✦</span><h3>{note.title}</h3><p>{note.body}</p></div>)}</div>
        </article>

        <article className="naat-note-section" id="sources">
          <div className="topic-section-head"><span>S</span><div><p>REFERENCE DESK</p><h2>Sources and comparison links</h2><div>External lyric sites are used as discovery and comparison references, not copied as the final editorial source.</div></div></div>
          <div className="topic-source-list">{entry.sources.map((source, index) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}><span>{String(index + 1).padStart(2,"0")}</span><div><small>REFERENCE</small><strong>{source.label}</strong></div><b>↗</b></a>)}</div>
        </article>
      </section>

      <footer className="topic-footer"><div><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><p>Love deserves accurate words and honest attribution.</p></div><div><a href="#top">Back to top ↑</a><Link href="/topics/writers">Writers</Link><Link href="/topics/reciters">Reciters</Link></div></footer>
    </main>
  );
}
