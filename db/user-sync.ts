import { neon } from "@neondatabase/serverless";

export type NoorSyncPayload = {
  version: 1;
  saved: { quranVerses: string[]; quranSurahs: string[]; darood: string[]; lughat: string[] };
  quran: { progress: Record<string, unknown> | null; preferences: Record<string, unknown>; readingDays: string[]; notes: Record<string, string> };
  updatedAt: string;
};

let sqlClient: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  sqlClient ??= neon(process.env.DATABASE_URL);
  return sqlClient;
}

async function ensureSchema() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS noor_user_sync (
        clerk_user_id TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined).catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function readUserSync(clerkUserId: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT payload, updated_at FROM noor_user_sync WHERE clerk_user_id = ${clerkUserId} LIMIT 1` as unknown as Array<{ payload: NoorSyncPayload; updated_at: string }>;
  if (!rows[0]) return null;
  return { ...rows[0].payload, updatedAt: new Date(rows[0].updated_at).toISOString() };
}

export async function writeUserSync(clerkUserId: string, payload: NoorSyncPayload) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO noor_user_sync (clerk_user_id, payload)
    VALUES (${clerkUserId}, ${JSON.stringify(payload)}::jsonb)
    ON CONFLICT (clerk_user_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
    RETURNING updated_at
  ` as unknown as Array<{ updated_at: string }>;
  return { ...payload, updatedAt: new Date(rows[0].updated_at).toISOString() };
}
