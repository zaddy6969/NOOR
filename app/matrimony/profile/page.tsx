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
    return <main className="auth-unavailable"><div><span>NOOR MATRIMONY</span><h1>Private profiles are temporarily unavailable.</h1><p>Secure production authentication must be connected before personal profile data can be accepted.</p><Link href="/matrimony">Return to matrimony</Link></div></main>;
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
        : <section className="profile-database-error"><span>DATABASE CONNECTION</span><h1>Neon is connected, but its environment variables are not available to this deployment yet.</h1><p>Redeploy the project after connecting Neon, then return here. No profile data has been submitted.</p><Link href="/matrimony">Return safely</Link></section>}
    </main>
  );
}
