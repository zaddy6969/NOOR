import {
  followingDate,
  localDateISO,
  prayerInstant,
  PRAYERS,
  type PrayerSchedule,
} from "./prayer-schedule.ts";
export type PrayerLocation = {
  latitude: number;
  longitude: number;
  timezone: string;
  city: string;
  method: number;
  school: number;
  adjustment: number;
};
export function validatePrayerLocation(
  value: unknown,
): value is PrayerLocation {
  if (!value || typeof value !== "object") return false;
  const v = value as PrayerLocation;
  try {
    new Intl.DateTimeFormat("en", { timeZone: v.timezone });
  } catch {
    return false;
  }
  return (
    typeof v.timezone === "string" &&
    v.timezone.length < 80 &&
    typeof v.city === "string" &&
    v.city.length > 0 &&
    v.city.length < 120 &&
    Number.isFinite(v.latitude) &&
    Math.abs(v.latitude) <= 90 &&
    Number.isFinite(v.longitude) &&
    Math.abs(v.longitude) <= 180 &&
    [1, 2, 3, 4, 5, 15].includes(v.method) &&
    [0, 1].includes(v.school) &&
    Number.isInteger(v.adjustment) &&
    Math.abs(v.adjustment) <= 2
  );
}
export async function prayerRange(
  location: PrayerLocation,
  days: number,
): Promise<PrayerSchedule[]> {
  if (!validatePrayerLocation(location) || ![7, 30].includes(days))
    throw new Error("Invalid calendar settings.");
  const dates: string[] = [];
  let current = localDateISO(new Date(), location.timezone);
  for (let i = 0; i < days; i++) {
    dates.push(current);
    current = followingDate(current);
  }
  const months = [...new Set(dates.map((d) => d.slice(0, 7)))];
  const results = await Promise.all(
    months.map(async (month) => {
      const [year, m] = month.split("-");
      const query = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        method: String(location.method),
        school: String(location.school),
        adjustment: String(location.adjustment),
        timezonestring: location.timezone,
      });
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}/${Number(m)}?${query}`,
        { signal: AbortSignal.timeout(15000), next: { revalidate: 3600 } },
      );
      if (!response.ok)
        throw new Error("Prayer schedule unavailable. Please retry.");
      const payload = await response.json();
      if (!Array.isArray(payload.data))
        throw new Error("Invalid prayer schedule.");
      return payload.data as {
        timings: Record<string, string>;
        date: { gregorian: { date: string } };
        meta: { timezone: string; method: { name: string } };
      }[];
    }),
  );
  const schedules = results
    .flat()
    .map((day) => {
      const dateISO = day.date.gregorian.date.split("-").reverse().join("-");
      if (!dates.includes(dateISO)) return null;
      const timings = Object.fromEntries(
        PRAYERS.map((p) => [
          p,
          day.timings[p]?.replace(/\s*\([^)]*\)\s*$/, ""),
        ]),
      ) as PrayerSchedule["timings"];
      return {
        dateISO,
        timezone: location.timezone,
        timings,
        targets: Object.fromEntries(
          PRAYERS.map((p) => [
            p,
            prayerInstant(dateISO, timings[p], location.timezone),
          ]),
        ),
        method: day.meta.method.name,
        hijri: null,
        tomorrow: null,
        calculatedAt: new Date().toISOString(),
      } as PrayerSchedule;
    })
    .filter((v): v is PrayerSchedule => v !== null)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  if (schedules.length !== days)
    throw new Error("Incomplete prayer schedule. Please retry.");
  return schedules;
}
