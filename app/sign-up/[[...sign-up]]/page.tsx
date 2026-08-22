import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth-config";

export default function SignUpPage() {
  if (!isClerkConfigured()) return <main className="auth-unavailable"><div><span>NOOR ACCOUNT</span><h1>Account creation is unavailable on this preview.</h1><p>Open the connected Vercel production deployment to create a private account.</p><Link href="/">Return home</Link></div></main>;
  return <main className="auth-page"><Link className="auth-brand" href="/">✦ NOOR</Link><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/matrimony/profile" /></main>;
}
