import { createHash, randomBytes, randomUUID } from "node:crypto";
import { start } from "workflow/api";
import webpush from "web-push";
import { pushConfigured, pushDatabase, pushKeys } from "@/db/push";
import { validPushSubscription } from "@/lib/push-validation";
import { validatePrayerLocation } from "@/lib/prayer-range";
import { validReminders } from "@/lib/prayer-reminders";
import { prayerReminderWorkflow } from "@/workflows/prayer-reminders";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export async function GET(request: Request) {
  try {
    if (!pushConfigured())
      return Response.json({ available: false }, { headers });
    const id = new URL(request.url).searchParams.get("id"),
      token = request.headers.get("authorization")?.replace(/^Bearer /, "");
    const keys = await pushKeys();
    if (id && token && /^[0-9a-f-]{36}$/.test(id)) {
      const sql = await pushDatabase();
      const [row] =
        await sql`SELECT expires_at,status,preferences FROM noor_push_devices WHERE id=${id} AND token_hash=${hash(token)} AND expires_at>now()`;
      return Response.json(
        { available: true, publicKey: keys.publicKey, device: row ?? null },
        { headers },
      );
    }
    return Response.json(
      { available: true, publicKey: keys.publicKey },
      { headers },
    );
  } catch {
    return Response.json({ available: false }, { status: 503, headers });
  }
}
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json(
      { error: "Please use NOOR reminder controls." },
      { status: 403, headers },
    );
  if (!pushConfigured())
    return Response.json(
      { error: "Background delivery is unavailable. Use calendar reminders." },
      { status: 503, headers },
    );
  try {
    const raw = await request.text();
    if (raw.length > 8000)
      return Response.json(
        { error: "Request is too large." },
        { status: 413, headers },
      );
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "Invalid request." },
        { status: 400, headers },
      );
    }
    const sql = await pushDatabase(),
      token =
        request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "",
      id =
        typeof body.id === "string" && /^[0-9a-f-]{36}$/.test(body.id)
          ? body.id
          : null;
    const row = id
      ? (
          await sql`SELECT * FROM noor_push_devices WHERE id=${id} AND token_hash=${hash(token)}`
        )[0]
      : null;
    if (id && !row)
      return Response.json(
        { error: "Reminder registration expired. Enable reminders again." },
        { status: 401, headers },
      );
    if (body.action === "disable") {
      if (!row) return Response.json({ disabled: true }, { headers });
      await sql`DELETE FROM noor_push_devices WHERE id=${id} AND token_hash=${hash(token)}`;
      return Response.json({ disabled: true }, { headers });
    }
    if (row && Date.now() - new Date(row.updated_at).getTime() < 10000)
      return Response.json(
        { error: "Please wait a few seconds before trying again." },
        { status: 429, headers },
      );
    if (body.action === "test") {
      if (!row)
        return Response.json(
          { error: "Enable reminders first." },
          { status: 400, headers },
        );
      const keys = await pushKeys();
      await webpush.sendNotification(
        row.subscription,
        JSON.stringify({
          title: "NOOR test reminder",
          body: "Background delivery test. Check this device for the notification.",
          tag: "noor-test",
          url: "/prayer-times",
        }),
        {
          vapidDetails: {
            subject: "https://noor-daily-muslim.vercel.app",
            ...keys,
          },
          TTL: 60,
          timeout: 10000,
        },
      );
      await sql`UPDATE noor_push_devices SET updated_at=now() WHERE id=${id}`;
      return Response.json({ accepted: true }, { headers });
    }
    if (
      !validPushSubscription(body.subscription) ||
      !validatePrayerLocation(body.location) ||
      !validReminders(body.settings) ||
      !body.settings.prayers.length
    )
      return Response.json(
        { error: "Confirm your city and choose valid reminder settings." },
        { status: 400, headers },
      );
    const deviceId = id ?? randomUUID(),
      deviceToken = row ? token : randomBytes(32).toString("base64url"),
      generation = randomUUID(),
      expires = new Date(Date.now() + 30 * 86400000).toISOString();
    const sender = hash(
      (request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ??
        "unknown") +
        new Date().toISOString().slice(0, 10) +
        process.env.DATABASE_URL,
    );
    const results = await sql.transaction([
      sql`SELECT pg_advisory_xact_lock(hashtext(${sender}))`,
      sql`INSERT INTO noor_push_devices(id,token_hash,endpoint,subscription,preferences,generation,expires_at,sender_hash) SELECT ${deviceId},${hash(deviceToken)},${body.subscription.endpoint},${JSON.stringify(body.subscription)}::jsonb,${JSON.stringify({ location: body.location, settings: body.settings })}::jsonb,${generation},${expires},${sender} WHERE ${Boolean(row)} OR (SELECT count(*) FROM noor_push_devices WHERE sender_hash=${sender} AND created_at>now()-interval '1 hour')<10 ON CONFLICT(id) DO UPDATE SET subscription=EXCLUDED.subscription,preferences=EXCLUDED.preferences,generation=EXCLUDED.generation,expires_at=EXCLUDED.expires_at,status='queued',updated_at=now() RETURNING id`,
    ]);
    if (!results[1].length)
      return Response.json(
        { error: "Too many registrations. Please try again later." },
        { status: 429, headers },
      );
    try {
      await start(prayerReminderWorkflow, [deviceId, generation]);
    } catch {
      await sql`DELETE FROM noor_push_devices WHERE id=${deviceId} AND generation=${generation}`;
      throw new Error("Scheduling unavailable");
    }
    return Response.json(
      {
        id: deviceId,
        token: deviceToken,
        expiresAt: expires,
        status: "queued",
      },
      { headers },
    );
  } catch {
    return Response.json(
      {
        error:
          "Reminders could not be confirmed. Please retry or use calendar reminders.",
      },
      { status: 503, headers },
    );
  }
}
