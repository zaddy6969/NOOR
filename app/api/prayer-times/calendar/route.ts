import { NextResponse } from "next/server";
import { localDateISO, PRAYERS, prayerInstant, type PrayerSchedule, type PrayerName } from "@/lib/prayer-schedule";
import { prayerCalendar } from "@/lib/prayer-reminders";

export function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  try {
    const timezone = (query.get("timezone") ?? "").slice(0, 80);
    const dateISO = query.get("date") ?? "";
    if (dateISO !== localDateISO(new Date(), timezone)) throw new Error("Load today's prayer schedule before exporting.");
    const prayers = [...new Set((query.get("prayers") ?? "").split(","))];
    const minutes = Number(query.get("minutes"));
    if (!prayers.length || prayers.some((prayer) => !PRAYERS.includes(prayer as PrayerName)) || ![0, 5, 10, 15].includes(minutes)) throw new Error("Choose valid prayers and a reminder time.");
    const timings = Object.fromEntries(PRAYERS.map((prayer) => [prayer, query.get(prayer) ?? ""])) as PrayerSchedule["timings"];
    const targets = Object.fromEntries(PRAYERS.map((prayer) => [prayer, prayerInstant(dateISO, timings[prayer], timezone)])) as PrayerSchedule["targets"];
    const schedule: PrayerSchedule = { dateISO, timezone, timings, targets, method: (query.get("method") ?? "Selected method").slice(0, 120), hijri: null, calculatedAt: new Date().toISOString(), tomorrow: null };
    return new Response(prayerCalendar(schedule, { enabled: false, prayers: prayers as PrayerName[], minutes }, (query.get("city") ?? "Selected location").slice(0, 120)), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="NOOR-prayers-${dateISO}.ics"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Calendar export is unavailable." }, { status: 400 });
  }
}
