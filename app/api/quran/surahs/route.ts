const upstream = "https://api.alquran.cloud/v1/surah";

export async function GET() {
  try {
    const response = await fetch(upstream, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Quran API returned ${response.status}`);
    const payload = await response.json() as { data?: unknown };
    if (!Array.isArray(payload.data)) throw new Error("Unexpected Quran API response");
    return Response.json({ surahs: payload.data }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return Response.json({ error: "The Surah directory is temporarily unavailable." }, { status: 502 });
  }
}
