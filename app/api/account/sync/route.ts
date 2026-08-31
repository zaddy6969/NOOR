import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { readUserSync, writeUserSync, type NoorSyncPayload } from "@/db/user-sync";
import { isClerkProductionConfigured } from "@/lib/auth-config";

export const runtime = "nodejs";

function unavailable() {
  return NextResponse.json({ error: "Secure account sync is not configured." }, { status: 503 });
}

function stringList(value: unknown, limit = 500) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0 && item.length <= 120))].slice(0, limit);
}

function textRecord(value: unknown, limit = 500) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key, item]) => key.length <= 120 && typeof item === "string")
    .slice(0, limit)
    .map(([key, item]) => [key, String(item).slice(0, 4000)]));
}

function objectRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function sanitize(input: unknown): NoorSyncPayload {
  const root = objectRecord(input);
  const saved = objectRecord(root.saved);
  const quran = objectRecord(root.quran);
  const serialized = JSON.stringify(root);
  if (serialized.length > 100_000) throw new Error("Sync data is too large.");
  return {
    version: 1,
    saved: {
      quranVerses: stringList(saved.quranVerses),
      quranSurahs: stringList(saved.quranSurahs, 114),
      darood: stringList(saved.darood),
      lughat: stringList(saved.lughat),
    },
    quran: {
      progress: root.quran && quran.progress ? objectRecord(quran.progress) : null,
      preferences: objectRecord(quran.preferences),
      readingDays: stringList(quran.readingDays, 730),
      notes: textRecord(quran.notes),
    },
    updatedAt: new Date().toISOString(),
  };
}

async function userIdOrResponse() {
  if (!isClerkProductionConfigured() || !process.env.DATABASE_URL) return { ok: false as const, response: unavailable() };
  const { userId } = await auth();
  if (!userId) return { ok: false as const, response: NextResponse.json({ error: "Sign in to sync your collection." }, { status: 401 }) };
  return { ok: true as const, userId };
}

export async function GET() {
  const session = await userIdOrResponse();
  if (!session.ok) return session.response;
  try {
    return NextResponse.json({ data: await readUserSync(session.userId) });
  } catch {
    return NextResponse.json({ error: "Account sync is temporarily unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const session = await userIdOrResponse();
  if (!session.ok) return session.response;
  try {
    const payload = sanitize(await request.json());
    return NextResponse.json({ data: await writeUserSync(session.userId, payload) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sync this collection.";
    return NextResponse.json({ error: message }, { status: message.includes("large") ? 413 : 400 });
  }
}
