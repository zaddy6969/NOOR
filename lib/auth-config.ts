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
