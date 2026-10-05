"use client";
import { personalStorage } from "@/lib/personal-storage";


import { useEffect, useRef, useState } from "react";
import { duePrayer, REMINDER_KEY, validReminders, type ReminderSettings } from "@/lib/prayer-reminders";
import { PRAYERS, type PrayerSchedule } from "@/lib/prayer-schedule";
import { useNoorCopy } from "../site/SiteUtilities";
import NoorSelect from "../site/NoorSelect";

const DEFAULT_REMINDERS: ReminderSettings = { enabled: false, prayers: [...PRAYERS], minutes: 0 };

export default function PrayerReminders({ schedule, location, confirmed }: { schedule: PrayerSchedule | null; location: string; confirmed: boolean }) {
  const { t } = useNoorCopy();
  const copyRef = useRef(t);
  useEffect(() => { copyRef.current = t; }, [t]);
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [permission, setPermission] = useState<string>("Checking support…");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const refresh = () => {
      setPermission("Notification" in window ? Notification.permission : "unsupported");
      try { const value = JSON.parse(personalStorage.getItem(REMINDER_KEY) ?? "null"); setSettings(validReminders(value) ? value : DEFAULT_REMINDERS); } catch { setSettings(DEFAULT_REMINDERS); }
    };
    refresh(); window.addEventListener("storage", refresh); window.addEventListener("focus", refresh); window.addEventListener("noor:reminders-change", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); window.removeEventListener("noor:reminders-change", refresh); };
  }, []);
  const save = (next: ReminderSettings) => { try { personalStorage.setItem(REMINDER_KEY, JSON.stringify(next)); setSettings(next); } catch { setMessage("Reminder preferences could not be saved."); } };
  const notify = async (title: string, body: string, tag: string) => {
    if (!("serviceWorker" in navigator)) throw new Error("Browser alerts are unavailable. Use calendar reminders.");
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error("Reload NOOR once to prepare notifications, or use calendar reminders.");
    await registration.showNotification(title, { body, icon: "/favicon.svg", tag, data: { url: "/prayer-times" } });
  };
  useEffect(() => {
    if (!settings.enabled || !schedule || !confirmed || permission !== "granted") return;
    const check = async () => {
      try {
      for (const prayer of duePrayer(schedule, settings, Date.now())) {
        const tag = `noor-alert-${schedule.dateISO}-${location}-${prayer}-${settings.minutes}`;
        if (personalStorage.getItem(tag)) continue;
        personalStorage.setItem(tag, "sent");
        try { await notify(`${copyRef.current(prayer)} · NOOR`, `${settings.minutes ? copyRef.current("{minutes} minutes before", { minutes: settings.minutes }) : copyRef.current("Prayer time")} · ${location} · ${schedule.timings[prayer]}`, tag); }
        catch (error) { personalStorage.removeItem(tag); setMessage(error instanceof Error ? error.message : "Alert could not be delivered."); }
      }
      } catch { setSettings((current) => ({ ...current, enabled: false })); setMessage("Your browser could not store reminder delivery status. Alerts are paused."); }
    };
    void check(); const timer = window.setInterval(() => void check(), 15000);
    return () => clearInterval(timer);
  }, [settings, schedule, confirmed, permission, location]);
  const enable = async () => {
    if (!("Notification" in window)) { setMessage("This browser does not support alerts. Use the calendar option."); return; }
    try { const result = await Notification.requestPermission(); setPermission(result); save({ ...settings, enabled: result === "granted" }); setMessage(result === "granted" ? "Alerts enabled while this prayer page stays open. Send a test to check delivery." : "Permission was not granted. You can use calendar reminders or change browser permissions."); } catch { setMessage("Permission could not be requested. On iPhone, install NOOR to your Home Screen first."); }
  };
  const calendarHref = schedule && confirmed && settings.prayers.length ? "/api/prayer-times/calendar?" + new URLSearchParams({ date: schedule.dateISO, timezone: schedule.timezone, city: location, method: schedule.method, minutes: String(settings.minutes), prayers: settings.prayers.join(","), ...schedule.timings }) : null;
  return <section className="noor-feature-card prayer-reminders" aria-label={t("Prayer reminders")}>
    <h2>{t("Prayer reminders")}</h2>
    <p>{t("Choose the prayers you want reminders for. Browser alerts run while this prayer page is open; closed-page push alerts are not enabled. Calendar reminders work through your calendar app.")}</p>
    <fieldset><legend>{t("Remind me for")}</legend><div className="reminder-prayers">{PRAYERS.map((prayer) => <label key={prayer}><input type="checkbox" checked={settings.prayers.includes(prayer)} onChange={(event) => save({ ...settings, prayers: event.target.checked ? [...settings.prayers, prayer] : settings.prayers.filter((item) => item !== prayer) })} />{t(prayer)}</label>)}</div></fieldset>
    <div className="noor-feature-controls"><label>{t("Reminder timing")}<NoorSelect aria-label={t("Reminder timing")} value={settings.minutes} onChange={(event) => save({ ...settings, minutes: Number(event.target.value) })}><option value={0}>{t("At prayer time")}</option>{[5, 10, 15].map((minutes) => <option key={minutes} value={minutes}>{t("{minutes} minutes before", { minutes })}</option>)}</NoorSelect></label>
    <button type="button" disabled={!confirmed || !settings.prayers.length} onClick={() => settings.enabled ? save({ ...settings, enabled: false }) : void enable()}>{t(settings.enabled ? "Disable alerts" : "Enable browser alerts")}</button>
    <button type="button" disabled={permission !== "granted"} onClick={async () => { try { await notify(t("NOOR test reminder"), t("Your browser can display NOOR prayer reminders."), "noor-test"); setMessage("Test notification sent. Check your device's notification settings if it does not appear."); } catch (error) { setMessage(error instanceof Error ? error.message : "Test failed."); } }}>{t("Send test notification")}</button>
    {calendarHref ? <a className="calendar-download" href={calendarHref} download onClick={() => setMessage("Calendar export requested. Import the file into your calendar and check its alert settings. These are today's times only; export a new schedule for another day.")}>{t("Add today's prayers to calendar")}</a> : <button type="button" disabled>{t("Add today's prayers to calendar")}</button>}</div>
    <p className="feature-status">{t("Permission")}: {t(permission)} · {t("Delivery")}: {t(settings.enabled && permission === "granted" ? "open prayer page" : "off")}{schedule ? ` · ${schedule.timezone}` : ""}</p>
    {!confirmed ? <p>{t("Confirm your city above before enabling prayer reminders.")}</p> : null}<p role="status">{t(message)}</p>
  </section>;
}
