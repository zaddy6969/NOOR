import type { Metadata } from "next";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth-config";
import MatrimonyAccountActions from "./_components/MatrimonyAccountActions";

export const metadata: Metadata = {
  title: "Private Islamic Matrimony | NOOR",
  description: "A privacy-first, family-aware Islamic matrimony account and profile flow with moderation safeguards.",
  openGraph: { title: "Private Islamic Matrimony | NOOR", description: "Private profiles, family involvement and careful moderation.", images: [] },
  twitter: { card: "summary", title: "Private Islamic Matrimony | NOOR", description: "Private profiles, family involvement and careful moderation.", images: [] },
};

const steps = [
  ["01", "Create a private account", "Clerk protects sign-in, sessions and account recovery. Your profile is tied only to your verified account."],
  ["02", "Complete a careful profile", "Share only broad location, serious intentions and compatibility details—never an address, ID document or private contact."],
  ["03", "Remain private by default", "New and edited profiles stay in draft. There is no public directory or uncontrolled profile browsing in this release."],
  ["04", "Prepare for moderated review", "Family or guardian involvement, identity checks, reporting and human moderation are required before introductions can launch."],
];

export default function MatrimonyPage() {
  const clerkConfigured = isClerkConfigured();

  return (
    <main className="matrimony-page" id="top">
      <header className="matrimony-topbar">
        <Link className="brand" href="/" aria-label="NOOR home"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link>
        <nav aria-label="Matrimony navigation"><a href="#process">How it works</a><a href="#safety">Safety</a><Link href="/topics/matrimony">Marriage guide</Link></nav>
        <Link className="topic-home-link" href="/">← All features</Link>
      </header>

      <section className="matrimony-hero">
        <div>
          <p className="eyebrow">PRIVATE · FAMILY-AWARE · SERIOUS INTENTIONS</p>
          <h1>Matrimony with dignity, not public exposure.</h1>
          <p>Build a private profile for a future moderated introduction service. Account access and profile ownership are real; public matching remains intentionally disabled until safeguarding and human review are ready.</p>
          {clerkConfigured
            ? <MatrimonyAccountActions />
            : <div className="matrimony-setup-note"><strong>Private accounts are available on the connected Vercel production deployment.</strong><span>This alternate preview has no Clerk keys, so account controls are safely disabled here.</span></div>}
        </div>
        <aside className="matrimony-privacy-card">
          <span>PRIVACY STATUS</span>
          <h2>Private by default</h2>
          <div><b>Profile visibility</b><strong>Only you</strong></div>
          <div><b>Moderation</b><strong>Draft</strong></div>
          <div><b>Public search</b><strong>Disabled</strong></div>
          <div><b>Direct messaging</b><strong>Disabled</strong></div>
          <p>NOOR never asks you to place identity documents, exact addresses, phone numbers or private social handles in your biography.</p>
        </aside>
      </section>

      <section className="matrimony-process" id="process">
        <div className="section-heading"><div><p className="eyebrow">THE ACCOUNT FLOW</p><h2>Simple to use. Deliberately careful.</h2><p>The foundation is ready for real private accounts without pretending an unmoderated directory is safe.</p></div></div>
        <div className="matrimony-step-grid">{steps.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="matrimony-safety" id="safety">
        <div><p className="eyebrow">NON-NEGOTIABLE SAFETY</p><h2>No public profiles in this release.</h2><p>Identity verification, age checks, moderation staffing, report handling, family/guardian options, emergency resources and a clear deletion process must be tested before introductions are enabled.</p></div>
        <div className="matrimony-safety-list"><span>✓ Adults only</span><span>✓ Exact location hidden</span><span>✓ No contact details in profiles</span><span>✓ Ownership checked server-side</span><span>✓ Every edit returns to draft</span><span>✓ No payment or messaging yet</span></div>
      </section>

      <footer className="topic-footer"><div><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><p>Private foundations first. Public introductions only after safeguarding.</p></div><div><Link href="/topics/matrimony">Read marriage guide</Link><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
