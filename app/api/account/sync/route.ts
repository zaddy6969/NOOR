import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  readUserSync,
  writeUserSync,
} from "@/db/user-sync";
import { sanitizeSync } from "@/lib/account-sync";
import { isClerkProductionConfigured } from "@/lib/auth-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function syncResponse(body: unknown, init?: Parameters<typeof NextResponse.json>[1]) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie");
  return response;
}

function unavailable() {
  return syncResponse(
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
      response: syncResponse(
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
    return syncResponse({ data: await readUserSync(session.userId) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "account_sync_read_failed",
        route: "/api/account/sync",
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
    return syncResponse(
      { error: "Account sync is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const startedAt = Date.now();
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return syncResponse({ error: "Sync must be requested from NOOR." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return syncResponse({ error: "JSON is required." }, { status: 415 });
  const session = await userIdOrResponse();
  if (!session.ok) return session.response;
  try {
    const text = await request.text();
    if (text.length > 150000) return syncResponse({ error: "Sync data is too large." }, { status: 413 });
    const input = JSON.parse(text);
    if (!input || typeof input !== "object" || Array.isArray(input) || input.version !== 1) return syncResponse({ error: "Invalid sync payload version." }, { status: 400 });
    const expectedUpdatedAt = typeof input.expectedUpdatedAt === "string" && Number.isFinite(Date.parse(input.expectedUpdatedAt)) ? input.expectedUpdatedAt : null;
    const payload = sanitizeSync(input);
    const current = await readUserSync(session.userId);
    if ((current?.updatedAt ?? null) !== expectedUpdatedAt)
      return syncResponse({ error: "Your account changed on another device. Sync again to merge the latest changes." }, { status: 409 });
    if (!Object.hasOwn(payload.quran, "notes") && current?.quran.notes) payload.quran.notes = current.quran.notes;
    return syncResponse({ data: await writeUserSync(session.userId, payload, expectedUpdatedAt) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to sync this collection.";
    if (message === "SYNC_CONFLICT") return syncResponse({ error: "Another device synced first. Sync again to merge your changes." }, { status: 409 });
    console.error(
      JSON.stringify({
        event: "account_sync_write_failed",
        route: "/api/account/sync",
        durationMs: Date.now() - startedAt,
        message,
      }),
    );
    return syncResponse(
      { error: error instanceof SyntaxError ? "Invalid JSON sync data." : "Account sync is temporarily unavailable." },
      { status: error instanceof SyntaxError ? 400 : 503 },
    );
  }
}
