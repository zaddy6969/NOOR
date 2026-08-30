import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth-config";

export const metadata: Metadata = { title: "Create account", alternates: { canonical: "/sign-up" }, robots: { index: false, follow: false } };

export default function SignUpPage() {
  if (!isClerkConfigured()) return <main className="auth-unavailable"><div><span>NOOR ACCOUNT</span><h1>Account creation is not enabled yet.</h1><p>You can keep using NOOR privately on this device. Secure account sync will appear here after production authentication is connected.</p><Link href="/saved">Open Saved</Link><Link href="/">Return home</Link></div></main>;
  return <main className="auth-page"><Link className="auth-brand" href="/">✦ NOOR</Link><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/matrimony/profile" /></main>;
}
