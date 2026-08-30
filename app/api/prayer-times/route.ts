type PrayerPayload = {
  data?: {
    timings?: Record<string, string>;
    date?: { readable?: string; hijri?: { day?: string; month?: { en?: string }; year?: string } };
    meta?: { timezone?: string; method?: { name?: string } };
  };
};

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("latitude"));
  const longitude = Number(params.get("longitude"));
  const requestedMethod = Number(params.get("method") ?? 1);
  const requestedSchool = Number(params.get("school") ?? 1);
  const requestedAdjustment = Number(params.get("adjustment") ?? 0);
  const method = new Set([1, 3, 4, 5]).has(requestedMethod) ? requestedMethod : 1;
  const school = requestedSchool === 0 ? 0 : 1;
  const adjustment = Number.isInteger(requestedAdjustment) && requestedAdjustment >= -2 && requestedAdjustment <= 2 ? requestedAdjustment : 0;
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return Response.json({ error: "Valid latitude and longitude are required." }, { status: 400 });
  }

  try {
    const date = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date()).replaceAll("/", "-");
    const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}&adjustment=${adjustment}`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Prayer service unavailable");
    const payload = await response.json() as PrayerPayload;
    const timings = payload.data?.timings;
    if (!timings) throw new Error("Invalid prayer response");

    const clean = (value: string | undefined) => String(value ?? "—").replace(/\s*\([^)]*\)\s*$/, "");
    return Response.json({
      timings: {
        Fajr: clean(timings.Fajr),
        Dhuhr: clean(timings.Dhuhr),
        Asr: clean(timings.Asr),
        Maghrib: clean(timings.Maghrib),
        Isha: clean(timings.Isha),
      },
      date: payload.data?.date?.readable,
      hijri: payload.data?.date?.hijri ? `${payload.data.date.hijri.day} ${payload.data.date.hijri.month?.en} ${payload.data.date.hijri.year} AH` : null,
      timezone: payload.data?.meta?.timezone,
      method: payload.data?.meta?.method?.name,
      methodId: method,
      school,
      adjustment,
    }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" } });
  } catch {
    return Response.json({ error: "Prayer timings are temporarily unavailable." }, { status: 502 });
  }
}
