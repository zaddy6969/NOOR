import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NaatMediaButtons from "../NaatMediaButtons";
import { naatEntries, naatMap } from "../naat-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return naatEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = naatMap.get(slug);
  if (!entry) return {};
  const title = `${entry.title} — Audio, Video & Reader | NOOR`;
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
    <main className="naat-detail-compact">
      <header className="quran-topbar compact-tool-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><div><strong>{entry.genre.toUpperCase()}</strong><span>Audio · Video · Reading notes</span></div><Link className="topic-home-link" href="/naat">← Library</Link></header>

      <section className="naat-detail-head">
        <p>{entry.genre}</p>
        <h1>{entry.title}</h1>
        <div><span><b>Writer</b>{entry.writer}</span><span><b>Featured reciter</b>{entry.media.performer}</span></div>
        <NaatMediaButtons slug={entry.slug} title={entry.title} performer={entry.media.performer} channel={entry.media.channel} spotifyId={entry.media.spotifyId} youtubeId={entry.media.youtubeId} />
      </section>

      <section className="naat-detail-body">
        <article>
          <h2>About this kalam</h2>
          <p>{entry.summary}</p>
          <div className="naat-detail-tags">{entry.languages.map((language) => <span key={language}>{language}</span>)}</div>
        </article>

        <article>
          <h2>Reading notes</h2>
          <div className="naat-detail-accordions">{entry.readingNotes.map((note) => <details key={note.title}><summary>{note.title}<span>+</span></summary><p>{note.body}</p></details>)}</div>
        </article>

        <article>
          <h2>Sources & rights</h2>
          <p>{entry.rights}</p>
          <div className="naat-detail-sources"><a href={entry.media.sourceUrl} target="_blank" rel="noreferrer">Video source · {entry.media.channel} ↗</a>{entry.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label} ↗</a>)}</div>
        </article>
      </section>
    </main>
  );
}
