import type { Metadata } from "next";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth-config";
import MatrimonyAccountActions from "./_components/MatrimonyAccountActions";
import { HeaderUtilities } from "../site/SiteUtilities";

export const metadata: Metadata = {
  title: "Private Islamic Matrimony",
  description: "A planned, family-aware Islamic matrimony service. Public matching and introductions are currently closed.",
  alternates: { canonical: "/matrimony" },
  openGraph: { title: "Private Islamic Matrimony | NOOR", description: "Planned private profiles and family involvement. Introductions are currently closed.", images: [] },
  twitter: { card: "summary", title: "Private Islamic Matrimony | NOOR", description: "Planned private profiles and family involvement. Introductions are currently closed.", images: [] },
};

const steps = [
  ["01", "Create a private account", "Your profile belongs to your verified account."],
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
        <aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← All features</Link></aside>
      </header>

      <section className="matrimony-hero">
        <div>
          <p className="eyebrow">PRIVATE · FAMILY-AWARE · SERIOUS INTENTIONS</p>
          <h1>Marriage Preparation</h1>
          <p>Read guidance for marriage. Private introductions are not yet available.</p>
          {clerkConfigured
            ? <MatrimonyAccountActions />
            : <div className="matrimony-setup-note"><strong>Private profiles are currently unavailable.</strong><span>You can read the marriage guide without an account.</span></div>}
          <div className="matrimony-launch-state"><strong>Public matching and introductions are closed.</strong><span>Profiles will not be shared until a moderated service is available.</span></div>
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
        <div className="section-heading"><div><p className="eyebrow">THE ACCOUNT FLOW</p><h2>Planned process</h2><p>Introductions will require verified accounts and human review.</p></div></div>
        <div className="matrimony-step-grid">{steps.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="matrimony-safety" id="safety">
        <div><p className="eyebrow">NON-NEGOTIABLE SAFETY</p><h2>No public profiles in this release.</h2><p>Identity verification, age checks, moderation staffing, report handling, family/guardian options, emergency resources and a clear deletion process must be tested before introductions are enabled.</p></div>
        <div className="matrimony-safety-list"><span>✓ Adults only</span><span>✓ Exact location hidden</span><span>✓ No contact details in profiles</span><span>✓ Account ownership verified</span><span>✓ Every edit returns to draft</span><span>✓ No payment or messaging yet</span></div>
      </section>

      <nav className="matrimony-policy-links" aria-label="Matrimony policies"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/editorial-policy">Safety & editorial policy</Link></nav>

      <footer className="topic-footer"><div><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link></div><div><Link href="/topics/matrimony">Read marriage guide</Link><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
