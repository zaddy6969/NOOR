type CalendarPayload = {
  data?: Array<{
    timings?: Record<string, string>;
    date?: {
      gregorian?: { date?: string; day?: string; month?: { en?: string; number?: number }; year?: string; weekday?: { en?: string } };
      hijri?: { date?: string; day?: string; month?: { en?: string; number?: number }; year?: string };
    };
  }>;
};

const ALLOWED_METHODS = new Set([1, 3, 4, 5]);

function clean(value: string | undefined) {
  return String(value ?? "—").replace(/\s*\([^)]*\)\s*$/, "");
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("latitude"));
  const longitude = Number(params.get("longitude"));
  const year = Number(params.get("year"));
  const month = Number(params.get("month"));
  const requestedMethod = Number(params.get("method") ?? 1);
  const requestedSchool = Number(params.get("school") ?? 1);
  const requestedAdjustment = Number(params.get("adjustment") ?? 0);
  const method = ALLOWED_METHODS.has(requestedMethod) ? requestedMethod : 1;
  const school = requestedSchool === 0 ? 0 : 1;
  const adjustment = Number.isInteger(requestedAdjustment) && requestedAdjustment >= -2 && requestedAdjustment <= 2 ? requestedAdjustment : 0;

  const coordinatesAreValid = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
  const monthIsValid = Number.isInteger(month) && month >= 1 && month <= 12;
  const yearIsValid = Number.isInteger(year) && year >= 2000 && year <= 2100;
  if (!coordinatesAreValid || !monthIsValid || !yearIsValid) {
    return Response.json({ error: "Valid coordinates, month and year are required." }, { status: 400 });
  }

  try {
    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}&adjustment=${adjustment}`;
    const response = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`Prayer provider returned ${response.status}`);
    const payload = await response.json() as CalendarPayload;
    if (!Array.isArray(payload.data)) throw new Error("Invalid monthly prayer response");

    const days = payload.data.map((day) => ({
      gregorianDate: day.date?.gregorian?.date ?? "",
      gregorianDay: Number(day.date?.gregorian?.day ?? 0),
      weekday: day.date?.gregorian?.weekday?.en ?? "",
      hijriDate: day.date?.hijri?.date ?? "",
      hijriLabel: `${day.date?.hijri?.day ?? ""} ${day.date?.hijri?.month?.en ?? ""} ${day.date?.hijri?.year ?? ""} AH`.trim(),
      timings: {
        Fajr: clean(day.timings?.Fajr),
        Dhuhr: clean(day.timings?.Dhuhr),
        Asr: clean(day.timings?.Asr),
        Maghrib: clean(day.timings?.Maghrib),
        Isha: clean(day.timings?.Isha),
      },
    })).filter((day) => day.gregorianDate);

    return Response.json({ year, month, method, school, adjustment, days }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error(JSON.stringify({
      event: "prayer_month_failed",
      route: "/api/prayer-times/month",
      durationMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : "Unknown error",
    }));
    return Response.json({ error: "The monthly prayer schedule is temporarily unavailable." }, { status: 502 });
  }
}
