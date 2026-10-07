import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getMatrimonyProfile } from "@/db/matrimony";
import { isClerkConfigured } from "@/lib/auth-config";
import ProfileForm from "./ProfileForm";
import { HeaderUtilities } from "../../site/SiteUtilities";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Private Matrimony Profile",
  description: "Create and manage a private NOOR matrimony profile.",
  alternates: { canonical: "/matrimony/profile" },
  robots: { index: false, follow: false },
};

export default async function MatrimonyProfilePage() {
  if (!isClerkConfigured()) {
    return <main className="auth-unavailable"><div><span>NOOR MATRIMONY</span><h1>Private profiles are temporarily unavailable.</h1><p>Read the marriage guide while private profiles are unavailable.</p><Link href="/matrimony">Return to matrimony</Link></div></main>;
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: "/matrimony/profile" });

  let profile = null;
  let databaseReady = true;
  try {
    profile = await getMatrimonyProfile(userId);
  } catch {
    databaseReady = false;
  }

  return (
    <main className="profile-page">
      <header className="matrimony-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><span className="profile-private-badge">● PRIVATE ACCOUNT</span><aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/matrimony">← Matrimony</Link></aside></header>
      {databaseReady
        ? <ProfileForm profile={profile} />
        : <section className="profile-database-error"><h1>The profile service is temporarily unavailable.</h1><p>Please try again later. No profile data was submitted.</p><Link href="/matrimony">Return safely</Link></section>}
    </main>
  );
}
