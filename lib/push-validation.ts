export function validPushSubscription(
  value: unknown,
): value is { endpoint: string; keys: { p256dh: string; auth: string } } {
  if (!value || typeof value !== "object") return false;
  const s = value as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  try {
    const u = new URL(s.endpoint);
    if (
      u.protocol !== "https:" ||
      u.port ||
      u.username ||
      u.password ||
      s.endpoint.length > 2048
    )
      return false;
    if (
      ![
        "fcm.googleapis.com",
        "updates.push.services.mozilla.com",
        "web.push.apple.com",
      ].includes(u.hostname) &&
      !u.hostname.endsWith(".notify.windows.com")
    )
      return false;
    return (
      /^[A-Za-z0-9_-]{87}$/.test(s.keys.p256dh) &&
      /^[A-Za-z0-9_-]{22}$/.test(s.keys.auth)
    );
  } catch {
    return false;
  }
}
