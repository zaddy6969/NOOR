import { neon } from "@neondatabase/serverless";
import { createHash, randomUUID } from "node:crypto";
import { validateCorrection } from "@/lib/corrections";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json(
      { error: "Please submit from NOOR." },
      { status: 403, headers },
    );
  if (!process.env.DATABASE_URL)
    return Response.json(
      {
        error:
          "Reports are temporarily unavailable. Please retry or use GitHub.",
      },
      { status: 503, headers },
    );
  try {
    if (Number(request.headers.get("content-length")) > 12000)
      return Response.json(
        { error: "Report is too long." },
        { status: 413, headers },
      );
    const text = await request.text();
    if (text.length > 12000)
      return Response.json(
        { error: "Report is too long." },
        { status: 413, headers },
      );
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Invalid report." },
        { status: 400, headers },
      );
    }
    const report = validateCorrection(parsed);
    if (!report)
      return Response.json(
        { error: "Check the page, issue and supporting source." },
        { status: 400, headers },
      );
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS noor_corrections (id UUID PRIMARY KEY,kind TEXT NOT NULL,page TEXT NOT NULL,statement TEXT NOT NULL,source TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),status TEXT NOT NULL DEFAULT 'received',sender_hash TEXT NOT NULL)`;
    const sender = createHash("sha256")
        .update(
          (request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ??
            "unknown") +
            new Date().toISOString().slice(0, 10) +
            process.env.DATABASE_URL,
        )
        .digest("hex"),
      id = randomUUID();
    const results = await sql.transaction([
      sql`SELECT pg_advisory_xact_lock(hashtext(${sender}))`,
      sql`INSERT INTO noor_corrections(id,kind,page,statement,source,sender_hash) SELECT ${id},${report.kind},${report.page},${report.statement},${report.source},${sender} WHERE (SELECT count(*) FROM noor_corrections WHERE sender_hash=${sender} AND created_at>now()-interval '1 hour')<5 RETURNING id`,
    ]);
    if (!results[1].length)
      return Response.json(
        { error: "Too many reports. Please try again in an hour." },
        { status: 429, headers },
      );
    return Response.json(
      { receipt: id, status: "received" },
      { status: 201, headers },
    );
  } catch {
    return Response.json(
      { error: "Your report was not confirmed. Please retry or use GitHub." },
      { status: 503, headers },
    );
  }
}
