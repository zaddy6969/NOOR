"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function MatrimonyAccountActions() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="matrimony-account-loading" aria-label="Loading account controls" />;
  }

  if (isSignedIn) {
    return (
      <div className="matrimony-account-actions">
        <Link className="matrimony-primary-action" href="/matrimony/profile">Open my private profile</Link>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="matrimony-account-actions">
      <SignUpButton mode="modal" fallbackRedirectUrl="/matrimony/profile">
        <button className="matrimony-primary-action" type="button">Create private account</button>
      </SignUpButton>
      <SignInButton mode="modal" fallbackRedirectUrl="/matrimony/profile">
        <button className="matrimony-secondary-action" type="button">Sign in</button>
      </SignInButton>
    </div>
  );
}
