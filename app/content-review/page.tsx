import Link from "next/link";
import type { Metadata } from "next";
import ToolHeader from "../site/ToolHeader";
import SiteFooter from "../site/SiteFooter";
import { CONTENT_REVIEWS, publishedReview } from "@/lib/content-review";

export const metadata: Metadata = { title: "Content review and sources", alternates: { canonical: "/content-review" } };
export default function ContentReviewPage() {
  return <main className="trust-page"><ToolHeader title="CONTENT REVIEW" subtitle="Sources · Review scope · Corrections" />
    <section className="trust-hero"><p>TRANSPARENT REVIEW RECORDS</p><h1>Content review and sources</h1><span>Each approval must identify the qualified reviewer, date and exact content covered. These records currently await qualified scholarly review.</span></section>
    <section className="trust-sections"><article><h2>Review register</h2><p>The register lists priority sections. Other educational pages also remain pending unless they publish a specific review record.</p><div className="review-register">{CONTENT_REVIEWS.map((record) => <article key={record.path}><h3><Link href={record.path}>{record.title}</Link></h3><span className="feature-status">{publishedReview(record) ? "Reviewed" : "Qualified review pending"}</span><dl><dt>Reviewer</dt><dd>{publishedReview(record) ? record.reviewer : "Not appointed"}</dd><dt>Review date</dt><dd>{publishedReview(record) ? record.reviewedAt : "Not yet reviewed"}</dd><dt>Scope</dt><dd>{record.scope}</dd><dt>Sources</dt><dd>{record.source}</dd></dl><Link href={`/corrections?page=${encodeURIComponent(record.path)}&kind=content`}>Report a correction →</Link></article>)}</div></article>
      <article><h2>Quran translation attribution</h2><p>Hindi edition <code>hi.hindi</code>: Suhel Farooq Khan and Saifur Rahman Nadwi. Urdu edition <code>ur.jalandhry</code>: Fateh Muhammad Jalandhry. English editions: Saheeh International and Marmaduke Pickthall.</p><p>Hindi translator metadata checked against the Al Quran Cloud edition API on 3 October 2026. This confirms the provider attribution; it is not scholarly approval of NOOR’s explanations.</p><a href="https://api.alquran.cloud/v1/edition?language=hi&type=translation" target="_blank" rel="noopener noreferrer">View provider edition metadata ↗</a></article>
      <article><h2>How review is recorded</h2><ol><li>A qualified reviewer checks Arabic, meanings, references, context and differences of opinion.</li><li>The reviewer supplies their name, qualifications, scope, review date and documented approval.</li><li>Corrections are applied and the review record is published with the exact approved content version.</li><li>Later substantive changes return the affected section to pending until checked again.</li></ol><Link href="/corrections?kind=review">Prepare a review submission →</Link><p>A review submission does not automatically grant approval. No reviewer is named without their agreement.</p></article>
    </section><SiteFooter /></main>;
}
