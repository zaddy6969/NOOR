type QiblaPayload = { data?: { direction?: number } };

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("latitude"));
  const longitude = Number(params.get("longitude"));
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return Response.json({ error: "Valid latitude and longitude are required." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Qibla service unavailable");
    const payload = await response.json() as QiblaPayload;
    const direction = Number(payload.data?.direction);
    if (!Number.isFinite(direction)) throw new Error("Invalid Qibla response");
    return Response.json({ direction }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return Response.json({ error: "Verified Qibla bearing is temporarily unavailable." }, { status: 502 });
  }
}
