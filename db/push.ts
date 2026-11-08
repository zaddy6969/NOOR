import { neon } from "@neondatabase/serverless";
import webpush from "web-push";
export function pushConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
      (process.env.NODE_ENV !== "production" ||
        process.env.VERCEL_DEPLOYMENT_ID),
  );
}
export async function pushDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("Reminders unavailable");
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS noor_push_config(id INTEGER PRIMARY KEY,public_key TEXT NOT NULL,private_key TEXT NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS noor_push_devices(id UUID PRIMARY KEY,token_hash TEXT NOT NULL,endpoint TEXT UNIQUE NOT NULL,subscription JSONB NOT NULL,preferences JSONB NOT NULL,generation UUID NOT NULL,expires_at TIMESTAMPTZ NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),last_sent TEXT,status TEXT NOT NULL DEFAULT 'queued',sender_hash TEXT NOT NULL)`;
  return sql;
}
export async function pushKeys() {
  const sql = await pushDatabase();
  const existing =
    await sql`SELECT public_key,private_key FROM noor_push_config WHERE id=1`;
  if (existing.length)
    return {
      publicKey: String(existing[0].public_key),
      privateKey: String(existing[0].private_key),
    };
  const generated = webpush.generateVAPIDKeys();
  await sql`INSERT INTO noor_push_config VALUES(1,${generated.publicKey},${generated.privateKey}) ON CONFLICT DO NOTHING`;
  const [keys] =
    await sql`SELECT public_key,private_key FROM noor_push_config WHERE id=1`;
  return {
    publicKey: String(keys.public_key),
    privateKey: String(keys.private_key),
  };
}
