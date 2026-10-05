export function isClerkConfigured() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
  );
  if (!configured) return false;
  return process.env.NODE_ENV !== "production" || isClerkProductionConfigured();
}

export function isClerkProductionConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_") &&
    process.env.CLERK_SECRET_KEY?.startsWith("sk_live_"),
  );
}

export function isAccountSyncConfigured() {
  return isClerkProductionConfigured() && Boolean(process.env.DATABASE_URL);
}

export function accountSyncSetupStatus() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY)
    return "Production sign-in keys are not available to this deployment.";
  if (!isClerkProductionConfigured())
    return "The connected Clerk application still needs production sign-in keys.";
  if (!process.env.DATABASE_URL)
    return "The production database connection is not available to this deployment.";
  return "Sign-in and database configuration are available.";
}
