import { PRAYERS, type PrayerName, type PrayerSchedule } from "./prayer-schedule.ts";

export type ReminderSettings = { enabled: boolean; prayers: PrayerName[]; minutes: number };
export const REMINDER_KEY = "noor-prayer-reminders-v1";
export function validReminders(value: unknown): value is ReminderSettings {
  const data = value as ReminderSettings;
  return Boolean(data && typeof data.enabled === "boolean" && Array.isArray(data.prayers) && data.prayers.every((prayer) => PRAYERS.includes(prayer)) && [0, 5, 10, 15].includes(data.minutes));
}
export function duePrayer(schedule: PrayerSchedule, settings: ReminderSettings, now: number) {
  return settings.enabled ? settings.prayers.filter((prayer) => { const target = schedule.targets[prayer] - settings.minutes * 60000; return target <= now && now - target < 60000; }) : [];
}
const stamp = (instant: number) => new Date(instant).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
export function prayerCalendar(schedule: PrayerSchedule, settings: ReminderSettings, location: string) {
  const events = settings.prayers.flatMap((prayer) => [
    "BEGIN:VEVENT", `UID:noor-${schedule.dateISO}-${prayer}-${encodeURIComponent(location)}@noor-daily-muslim.vercel.app`, "DTSTAMP:" + stamp(Date.now()), "DTSTART:" + stamp(schedule.targets[prayer]), "DURATION:PT10M", "SUMMARY:" + escape(prayer + " prayer · NOOR"), "DESCRIPTION:" + escape(`${location} · ${schedule.timezone} · ${schedule.method}\nCalculated prayer time; confirm congregation times locally.`), "BEGIN:VALARM", `TRIGGER:${settings.minutes ? "-PT" + settings.minutes + "M" : "PT0M"}`, "ACTION:DISPLAY", "DESCRIPTION:" + escape(prayer + " prayer reminder"), "END:VALARM", "END:VEVENT",
  ]);
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NOOR//Prayer Reminders//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
}
