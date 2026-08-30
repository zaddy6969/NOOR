import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth-config";

export const metadata: Metadata = { title: "Sign in", alternates: { canonical: "/sign-in" }, robots: { index: false, follow: false } };

export default function SignInPage() {
  if (!isClerkConfigured()) return <main className="auth-unavailable"><div><span>NOOR ACCOUNT</span><h1>Sign-in is not enabled yet.</h1><p>Your Saved library and prayer progress still stay private in this browser. Account sync will appear here after secure production authentication is connected.</p><Link href="/saved">Open Saved</Link><Link href="/">Return home</Link></div></main>;
  return <main className="auth-page"><Link className="auth-brand" href="/">✦ NOOR</Link><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/matrimony/profile" /></main>;
}
