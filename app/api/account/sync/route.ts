import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  readUserSync,
  writeUserSync,
} from "@/db/user-sync";
import { sanitizeSync } from "@/lib/account-sync";
import { isClerkProductionConfigured } from "@/lib/auth-config";

export const runtime = "nodejs";

function unavailable() {
  return NextResponse.json(
    { error: "Secure account sync is not configured." },
    { status: 503 },
  );
}

async function userIdOrResponse() {
  if (!isClerkProductionConfigured() || !process.env.DATABASE_URL)
    return { ok: false as const, response: unavailable() };
  const { userId } = await auth();
  if (!userId)
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Sign in to sync your collection." },
        { status: 401 },
      ),
    };
  return { ok: true as const, userId };
}

export async function GET() {
  const startedAt = Date.now();
  const session = await userIdOrResponse();
  if (!session.ok) return session.response;
  try {
    return NextResponse.json({ data: await readUserSync(session.userId) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "account_sync_read_failed",
        route: "/api/account/sync",
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
    return NextResponse.json(
      { error: "Account sync is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const startedAt = Date.now();
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return NextResponse.json({ error: "Sync must be requested from NOOR." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json({ error: "JSON is required." }, { status: 415 });
  const session = await userIdOrResponse();
  if (!session.ok) return session.response;
  try {
    const text = await request.text();
    if (text.length > 150000) return NextResponse.json({ error: "Sync data is too large." }, { status: 413 });
    const input = JSON.parse(text);
    if (!input || typeof input !== "object" || Array.isArray(input) || input.version !== 1) return NextResponse.json({ error: "Invalid sync payload version." }, { status: 400 });
    const expectedUpdatedAt = typeof input.expectedUpdatedAt === "string" && Number.isFinite(Date.parse(input.expectedUpdatedAt)) ? input.expectedUpdatedAt : null;
    const payload = sanitizeSync(input);
    const current = await readUserSync(session.userId);
    if ((current?.updatedAt ?? null) !== expectedUpdatedAt)
      return NextResponse.json({ error: "Your account changed on another device. Sync again to merge the latest changes." }, { status: 409 });
    if (!Object.hasOwn(payload.quran, "notes") && current?.quran.notes) payload.quran.notes = current.quran.notes;
    return NextResponse.json({ data: await writeUserSync(session.userId, payload, expectedUpdatedAt) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to sync this collection.";
    if (message === "SYNC_CONFLICT") return NextResponse.json({ error: "Another device synced first. Sync again to merge your changes." }, { status: 409 });
    console.error(
      JSON.stringify({
        event: "account_sync_write_failed",
        route: "/api/account/sync",
        durationMs: Date.now() - startedAt,
        message,
      }),
    );
    return NextResponse.json(
      { error: message },
      { status: message.includes("large") ? 413 : 400 },
    );
  }
}
