"use client";

import { useEffect, useState } from "react";
import { duePrayer, prayerCalendar, REMINDER_KEY, validReminders, type ReminderSettings } from "@/lib/prayer-reminders";
import { PRAYERS, type PrayerSchedule } from "@/lib/prayer-schedule";
import { useNoorCopy } from "../site/SiteUtilities";
import NoorSelect from "../site/NoorSelect";

export default function PrayerReminders({ schedule, location, confirmed }: { schedule: PrayerSchedule | null; location: string; confirmed: boolean }) {
  const { t } = useNoorCopy();
  const [settings, setSettings] = useState<ReminderSettings>({ enabled: false, prayers: [...PRAYERS], minutes: 0 });
  const [permission, setPermission] = useState<string>("Checking support…");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const refresh = () => {
      setPermission("Notification" in window ? Notification.permission : "unsupported");
      try { const value = JSON.parse(localStorage.getItem(REMINDER_KEY) ?? "null"); if (validReminders(value)) setSettings(value); } catch { /* reminders are optional */ }
    };
    refresh(); window.addEventListener("storage", refresh); window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); };
  }, []);
  const save = (next: ReminderSettings) => { try { localStorage.setItem(REMINDER_KEY, JSON.stringify(next)); setSettings(next); } catch { setMessage("Reminder preferences could not be saved."); } };
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
        if (localStorage.getItem(tag)) continue;
        localStorage.setItem(tag, "sent");
        try { await notify(`${prayer} · NOOR`, `${settings.minutes ? settings.minutes + " minutes before prayer" : "Prayer time"} · ${location} · ${schedule.timings[prayer]}`, tag); }
        catch (error) { localStorage.removeItem(tag); setMessage(error instanceof Error ? error.message : "Alert could not be delivered."); }
      }
      } catch { setMessage("Your browser could not store reminder delivery status. Alerts are paused."); }
    };
    void check(); const timer = window.setInterval(() => void check(), 15000);
    return () => clearInterval(timer);
  }, [settings, schedule, confirmed, permission, location]);
  const enable = async () => {
    if (!("Notification" in window)) { setMessage("This browser does not support alerts. Use the calendar option."); return; }
    try { const result = await Notification.requestPermission(); setPermission(result); save({ ...settings, enabled: result === "granted" }); setMessage(result === "granted" ? "Alerts enabled while this prayer page stays open. Send a test to check delivery." : "Permission was not granted. You can use calendar reminders or change browser permissions."); } catch { setMessage("Permission could not be requested. On iPhone, install NOOR to your Home Screen first."); }
  };
  const calendar = () => {
    if (!schedule || !settings.prayers.length) return;
    const url = URL.createObjectURL(new Blob([prayerCalendar(schedule, settings, location)], { type: "text/calendar" }));
    const link = document.createElement("a"); link.href = url; link.download = `NOOR-prayers-${schedule.dateISO}.ics`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Import the file into your calendar and check its alert settings. These are today's times only; download a new schedule for another day.");
  };
  return <section className="noor-feature-card prayer-reminders" aria-label={t("Prayer reminders")}>
    <h2>{t("Prayer reminders")}</h2>
    <p>{t("Choose the prayers you want reminders for. Browser alerts run while this prayer page is open; closed-page push alerts are not enabled. Calendar reminders work through your calendar app.")}</p>
    <fieldset><legend>{t("Remind me for")}</legend><div className="reminder-prayers">{PRAYERS.map((prayer) => <label key={prayer}><input type="checkbox" checked={settings.prayers.includes(prayer)} onChange={(event) => save({ ...settings, prayers: event.target.checked ? [...settings.prayers, prayer] : settings.prayers.filter((item) => item !== prayer) })} />{prayer}</label>)}</div></fieldset>
    <div className="noor-feature-controls"><label>{t("Reminder timing")}<NoorSelect aria-label={t("Reminder timing")} value={settings.minutes} onChange={(event) => save({ ...settings, minutes: Number(event.target.value) })}><option value={0}>{t("At prayer time")}</option>{[5, 10, 15].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes before</option>)}</NoorSelect></label>
    <button type="button" disabled={!confirmed || !settings.prayers.length} onClick={() => settings.enabled ? save({ ...settings, enabled: false }) : void enable()}>{t(settings.enabled ? "Disable alerts" : "Enable browser alerts")}</button>
    <button type="button" disabled={permission !== "granted"} onClick={async () => { try { await notify("NOOR test reminder", "Your browser can display NOOR prayer reminders.", "noor-test"); setMessage("Test notification sent. Check your device's notification settings if it does not appear."); } catch (error) { setMessage(error instanceof Error ? error.message : "Test failed."); } }}>{t("Send test notification")}</button>
    <button type="button" disabled={!schedule || !confirmed || !settings.prayers.length} onClick={calendar}>{t("Add today's prayers to calendar")}</button></div>
    <p className="feature-status">Permission: {permission} · Delivery: {settings.enabled && permission === "granted" ? "open prayer page" : "off"}{schedule ? ` · ${schedule.timezone}` : ""}</p>
    {!confirmed ? <p>{t("Confirm your city above before enabling prayer reminders.")}</p> : null}<p role="status">{message}</p>
  </section>;
}
