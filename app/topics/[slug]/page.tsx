import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderUtilities } from "../../site/SiteUtilities";
import { topicMap, topics } from "../topic-data";
import ReviewBadge from "../../trust/ReviewBadge";

type PageProps = { params: Promise<{ slug: string }> };

function quranHref(reference: string, href?: string) {
  const byReference = reference.match(/(?:Qur(?:’|')?an\s*)?(\d{1,3})\s*:\s*(\d{1,3})/i);
  if (byReference) return `/quran?surah=${byReference[1]}&ayah=${byReference[2]}`;
  const byUrl = href?.match(/quran\.com\/(?:[^/]+\/)?(\d{1,3})(?:\/(\d{1,3}))?/i);
  return byUrl ? `/quran?surah=${byUrl[1]}${byUrl[2] ? `&ayah=${byUrl[2]}` : ""}` : null;
}

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicMap.get(slug);
  if (!topic) return {};
  const title = `${topic.title} — Full Guide`;
  const socialTitle = `${title} | NOOR`;
  return {
    title,
    description: topic.summary,
    alternates: { canonical: `/topics/${topic.slug}` },
    openGraph: { title: socialTitle, description: topic.summary, images: [] },
    twitter: { card: "summary", title: socialTitle, description: topic.summary, images: [] },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = topicMap.get(slug);
  if (!topic) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${topic.title} — Full Guide`,
    description: topic.summary,
    mainEntityOfPage: `https://noor-daily-muslim.vercel.app/topics/${topic.slug}`,
    author: { "@type": "Organization", name: "NOOR Daily Muslim" },
    publisher: { "@type": "Organization", name: "NOOR Daily Muslim" },
    dateModified: "2026-08-31",
    inLanguage: "en",
  };

  return (
    <main className="topic-page" id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <header className="topic-topbar">
        <Link className="brand" href="/" aria-label="NOOR home">
          <span className="brand-mark"><span className="brand-star">✦</span></span>
          <span><strong>NOOR</strong><small>DAILY MUSLIM</small></span>
        </Link>
        <nav aria-label="Topic navigation">
          <a href="#guide">Full guide</a>
          <a href="#questions">Questions</a>
          <a href="#sources">Sources</a>
        </nav>
        <aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← All topics</Link></aside>
      </header>

      <section className="topic-hero">
        <div className="topic-hero-copy">
          <p className="eyebrow">{topic.kicker}</p>
          <h1>{topic.title}</h1>
          <p>{topic.summary}</p>
          <ReviewBadge compact />
          <div className="topic-hero-actions">
            <a href="#guide">Start reading</a>
            <a href="#sources">Check sources</a>
          </div>
        </div>
        <article className="topic-foundation">
          <span>FOUNDATION</span>
          {topic.foundation.arabic && <blockquote lang="ar" dir="rtl">{topic.foundation.arabic}</blockquote>}
          <p>{topic.foundation.translation}</p>
          <Link href={quranHref(topic.foundation.reference, topic.foundation.href) ?? `/topics/${topic.slug}#sources`}>{topic.foundation.reference} →</Link>
        </article>
      </section>

      <section className="topic-glance" aria-label="At a glance">
        {topic.atAGlance.map((item, index) => (
          <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
        ))}
      </section>

      <nav className="topic-chapter-bar" aria-label="Guide chapters">
        {topic.chapters.map((chapter) => <a href={`#${chapter.id}`} key={chapter.id}>{chapter.title}</a>)}
        <a href="#questions">FAQs</a><a href="#sources">Sources</a>
      </nav>

      <section className="topic-shell" id="guide">
        <aside className="topic-aside">
          <p>IN THIS GUIDE</p>
          {topic.chapters.map((chapter, index) => <a href={`#${chapter.id}`} key={chapter.id}><span>{String(index + 1).padStart(2, "0")}</span>{chapter.title}</a>)}
          <a href="#questions"><span>Q</span>Questions</a>
          <a href="#sources"><span>S</span>Sources</a>
          <div><strong>How to use NOOR</strong><p>Read the source link, note the school of law, and ask a qualified scholar when your circumstances change the ruling.</p></div>
        </aside>

        <article className="topic-content">
          {topic.chapters.map((chapter, chapterIndex) => (
            <section className="topic-section" id={chapter.id} key={chapter.id}>
              <div className="topic-section-head">
                <span>{String(chapterIndex + 1).padStart(2, "0")}</span>
                <div><p>CHAPTER {String(chapterIndex + 1).padStart(2, "0")}</p><h2>{chapter.title}</h2><div>{chapter.intro}</div></div>
              </div>
              <div className="topic-item-grid">
                {chapter.items.map((item) => (
                  <article className="topic-item" key={item.title}>
                    <span>✦</span><h3>{item.title}</h3><p>{item.body}</p>
                    {item.href && (item.href.startsWith("/")
                      ? <Link href={item.href}>{item.linkLabel ?? "Read more"} →</Link>
                      : quranHref(item.linkLabel ?? "", item.href)
                        ? <Link href={quranHref(item.linkLabel ?? "", item.href) ?? "/quran"}>{item.linkLabel ?? "Read the verse"} →</Link>
                        : <span className="topic-contained-note">Complete summary included above</span>)}
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className="topic-section" id="questions">
            <div className="topic-section-head"><span>Q</span><div><p>COMMON QUESTIONS</p><h2>Quick answers</h2><div>These are educational starting points. The wording of a real question and the person’s circumstances can change the answer.</div></div></div>
            <div className="topic-faq">
              {topic.faqs.map((faq, index) => <details key={faq.q}><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{faq.q}</strong><i>+</i></summary><p>{faq.a}</p></details>)}
            </div>
          </section>

          <section className="topic-section topic-sources" id="sources">
            <div className="topic-section-head"><span>S</span><div><p>PRIMARY READING</p><h2>Sources & references</h2><div>Source names remain visible for verification, while the full educational guide stays inside NOOR. Quran references open in the NOOR reader.</div></div></div>
            <div className="topic-source-list">
              {topic.sources.map((source, index) => {
                const internal = quranHref(source.label, source.href);
                const content = <><span>{String(index + 1).padStart(2, "0")}</span><div><small>{source.label}</small><strong>{source.title}</strong></div><b>{internal ? "→" : "IN NOOR"}</b></>;
                return internal ? <Link href={internal} key={`${source.label}-${source.href}`}>{content}</Link> : <article key={`${source.label}-${source.href}`}>{content}</article>;
              })}
            </div>
            <div className="topic-review"><span>i</span><div><strong>Editorial responsibility</strong><p>{topic.reviewNote}</p><Link href="/editorial-policy#corrections">Report a correction →</Link></div></div>
          </section>
        </article>
      </section>

      <footer className="topic-footer">
        <div><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><p>Sourced learning, calm practice and visible responsibility.</p></div>
        <div><a href="#top">Back to top ↑</a><Link href="/namaz">Prayer & Wudu</Link><Link href="/">NOOR home</Link></div>
      </footer>
    </main>
  );
}
