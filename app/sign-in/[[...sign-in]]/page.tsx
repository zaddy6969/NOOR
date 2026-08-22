import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth-config";

export default function SignInPage() {
  if (!isClerkConfigured()) return <main className="auth-unavailable"><div><span>NOOR ACCOUNT</span><h1>Sign-in is unavailable on this preview.</h1><p>Open the connected Vercel production deployment to use private accounts.</p><Link href="/">Return home</Link></div></main>;
  return <main className="auth-page"><Link className="auth-brand" href="/">✦ NOOR</Link><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/matrimony/profile" /></main>;
}
