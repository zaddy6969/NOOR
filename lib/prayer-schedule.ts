export const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerName = (typeof PRAYERS)[number];
export type PrayerTimings = Record<PrayerName, string>;
export type PrayerSchedule = {
  timings: PrayerTimings;
  targets: Record<PrayerName, number>;
  dateISO: string;
  timezone: string;
  hijri: string | null;
  method: string;
  calculatedAt: string;
  tomorrow: { dateISO: string; fajr: string; target: number } | null;
};

export function localDateISO(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value;
  return value("year") + "-" + value("month") + "-" + value("day");
}

export function followingDate(dateISO: string) {
  const date = new Date(dateISO + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function prayerInstant(dateISO: string, time: string, timezone: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(dateISO) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  )
    throw new Error("Invalid prayer date or time");
  const [year, month, day] = dateISO.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  let instant = desired;
  for (let attempt = 0; attempt < 4; attempt++) {
    const parts = formatter.formatToParts(new Date(instant));
    const value = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value);
    const represented = Date.UTC(
      value("year"),
      value("month") - 1,
      value("day"),
      value("hour"),
      value("minute"),
      value("second"),
    );
    const correction = desired - represented;
    if (!correction) return instant;
    instant += correction;
  }
  throw new Error("Unable to resolve local prayer time");
}

export function upcomingPrayer(
  schedule: PrayerSchedule | null,
  now: Date | null,
) {
  if (
    !schedule ||
    !now ||
    schedule.dateISO !== localDateISO(now, schedule.timezone)
  )
    return null;
  for (const prayer of PRAYERS) {
    if (schedule.targets[prayer] > now.getTime())
      return {
        prayer,
        target: schedule.targets[prayer],
        time: schedule.timings[prayer],
        tomorrow: false,
      };
  }
  return schedule.tomorrow && schedule.tomorrow.target > now.getTime()
    ? {
        prayer: "Fajr" as PrayerName,
        target: schedule.tomorrow.target,
        time: schedule.tomorrow.fajr,
        tomorrow: true,
      }
    : null;
}

export function formatCountdown(target: number, now: Date) {
  const seconds = Math.max(0, Math.floor((target - now.getTime()) / 1000));
  return [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((part) => String(part).padStart(2, "0"))
    .join(" : ");
}

export function validSchedule(
  value: unknown,
  now: Date,
): value is PrayerSchedule {
  try {
    const data = value as PrayerSchedule;
    return Boolean(
      data &&
        data.dateISO === localDateISO(now, data.timezone) &&
        PRAYERS.every(
          (prayer) =>
            /^([01]\d|2[0-3]):[0-5]\d$/.test(data.timings[prayer]) &&
            data.targets[prayer] ===
              prayerInstant(data.dateISO, data.timings[prayer], data.timezone),
        ) &&
        (!data.tomorrow ||
          (data.tomorrow.dateISO === followingDate(data.dateISO) &&
            data.tomorrow.target ===
              prayerInstant(
                data.tomorrow.dateISO,
                data.tomorrow.fajr,
                data.timezone,
              ))),
    );
  } catch {
    return false;
  }
}
