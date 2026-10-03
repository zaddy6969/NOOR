import {
  followingDate,
  localDateISO,
  prayerInstant,
  PRAYERS,
  type PrayerTimings,
} from "../../../lib/prayer-schedule";

type Upstream = {
  data?: {
    timings?: Record<string, string>;
    date?: { hijri?: { day?: string; month?: { en?: string }; year?: string } };
    meta?: { timezone?: string; method?: { name?: string } };
  };
};

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("latitude"));
  const longitude = Number(params.get("longitude"));
  if (
    !params.has("latitude") ||
    !params.has("longitude") ||
    !Number.isFinite(latitude) ||
    Math.abs(latitude) > 90 ||
    !Number.isFinite(longitude) ||
    Math.abs(longitude) > 180
  )
    return Response.json(
      { error: "Valid latitude and longitude are required." },
      { status: 400 },
    );
  const requestedMethod = Number(params.get("method") ?? 1);
  const method = [1, 2, 3, 4, 5, 15].includes(requestedMethod)
    ? requestedMethod
    : 1;
  const school = params.get("school") === "0" ? 0 : 1;
  const requestedAdjustment = Number(params.get("adjustment") ?? 0);
  const adjustment =
    Number.isInteger(requestedAdjustment) && Math.abs(requestedAdjustment) <= 2
      ? requestedAdjustment
      : 0;
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    method: String(method),
    school: String(school),
    adjustment: String(adjustment),
  });
  const fetchDay = async (dateISO: string) => {
    const [year, month, day] = dateISO.split("-");
    const response = await fetch(
      "https://api.aladhan.com/v1/timings/" +
        day +
        "-" +
        month +
        "-" +
        year +
        "?" +
        query,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
        next: { revalidate: 300 },
      },
    );
    if (!response.ok) throw new Error("Prayer service unavailable");
    const payload = (await response.json()) as Upstream;
    const data = payload.data;
    if (!data?.timings || !data.meta?.timezone)
      throw new Error("Incomplete prayer response");
    const timings = Object.fromEntries(
      PRAYERS.map((prayer) => [
        prayer,
        String(data.timings?.[prayer] ?? "").replace(/\s*\([^)]*\)\s*$/, ""),
      ]),
    ) as PrayerTimings;
    if (
      !PRAYERS.every((prayer) =>
        /^([01]\d|2[0-3]):[0-5]\d$/.test(timings[prayer]),
      )
    )
      throw new Error("Invalid prayer times");
    return { data, timings };
  };
  try {
    const now = new Date();
    let initialDate = now.toISOString().slice(0, 10);
    const preferredZone = params.get("timezone");
    if (preferredZone) {
      try {
        initialDate = localDateISO(now, preferredZone);
      } catch {
        return Response.json({ error: "Invalid timezone." }, { status: 400 });
      }
    }
    let today = await fetchDay(initialDate);
    const timezone = today.data.meta!.timezone!;
    const dateISO = localDateISO(now, timezone);
    if (initialDate !== dateISO) today = await fetchDay(dateISO);
    const tomorrowDate = followingDate(dateISO);
    const tomorrow = await fetchDay(tomorrowDate).catch(() => null);
    const hijri = today.data.date?.hijri;
    return Response.json(
      {
        timings: today.timings,
        targets: Object.fromEntries(
          PRAYERS.map((prayer) => [
            prayer,
            prayerInstant(dateISO, today.timings[prayer], timezone),
          ]),
        ),
        dateISO,
        date: dateISO.split("-").reverse().join("-"),
        timezone,
        hijri: hijri
          ? hijri.day + " " + hijri.month?.en + " " + hijri.year + " AH"
          : null,
        method: today.data.meta?.method?.name ?? "Calculated",
        methodId: method,
        school,
        adjustment,
        calculatedAt: now.toISOString(),
        tomorrow: tomorrow
          ? {
              dateISO: tomorrowDate,
              fajr: tomorrow.timings.Fajr,
              target: prayerInstant(
                tomorrowDate,
                tomorrow.timings.Fajr,
                timezone,
              ),
            }
          : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        error:
          "Prayer times are unavailable. Retry or confirm with your local mosque.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
