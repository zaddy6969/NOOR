"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type PrayerResponse = {
  timings?: Record<PrayerName, string>;
  hijri?: string | null;
  method?: string | null;
  error?: string;
};
type City = { id: string; label: string; latitude: number; longitude: number };
type PrayerSettings = { cityId: string; method: number; school: number };

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const CITIES: City[] = [
  { id: "bengaluru", label: "Bengaluru", latitude: 12.9716, longitude: 77.5946 },
  { id: "mumbai", label: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { id: "delhi", label: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { id: "hyderabad", label: "Hyderabad", latitude: 17.385, longitude: 78.4867 },
  { id: "kolkata", label: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
  { id: "lucknow", label: "Lucknow", latitude: 26.8467, longitude: 80.9462 },
];
const METHODS = [
  { id: 1, label: "Karachi" },
  { id: 3, label: "Muslim World League" },
  { id: 4, label: "Umm al-Qura" },
  { id: 5, label: "Egyptian Authority" },
];
const DEFAULT_SETTINGS: PrayerSettings = { cityId: "bengaluru", method: 1, school: 1 };

function cityById(id: string) {
  return CITIES.find((city) => city.id === id) ?? CITIES[0];
}

function nextPrayer(timings: PrayerResponse["timings"], now: Date | null) {
  if (!timings || !now) return null;
  for (const prayer of PRAYERS) {
    const [hours, minutes] = timings[prayer].split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) continue;
    const prayerDate = new Date(now);
    prayerDate.setHours(hours, minutes, 0, 0);
    if (prayerDate > now) return { prayer, target: prayerDate };
  }
  const [hours, minutes] = timings.Fajr.split(":").map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return { prayer: "Fajr" as PrayerName, target: tomorrow };
}

function PrayerIcon({ prayer }: { prayer: PrayerName }) {
  if (prayer === "Isha") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8 8 0 1 1 11.5 4 6.3 6.3 0 0 0 20 15.5Z"/><path d="M19 4v4m-2-2h4"/></svg>;
  if (prayer === "Dhuhr") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18M5 15h14M7 12a5 5 0 0 1 10 0"/><path d={prayer === "Fajr" ? "M12 3v3m-5-1 2 2m8-2-2 2" : prayer === "Asr" ? "M4 8h16" : "M6 10h12"}/></svg>;
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
}

function SettingsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.87.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.1v-4H3A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.87l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.1h4V3A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.37.37.7.6 1 .27.27.62.4 1 .4h.1v4H21a1.7 1.7 0 0 0-1.6.6Z"/></svg>;
}

export default function PrayerTimesStrip() {
  const [data, setData] = useState<PrayerResponse | null>(null);
  const [settings, setSettings] = useState<PrayerSettings>(DEFAULT_SETTINGS);
  const [location, setLocation] = useState<City>(CITIES[0]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const load = useCallback((city: City, nextSettings: PrayerSettings) => {
    setLoading(true);
    setLocation(city);
    fetch(`/api/prayer-times?latitude=${city.latitude}&longitude=${city.longitude}&method=${nextSettings.method}&school=${nextSettings.school}`)
      .then(async (response) => {
        const payload = await response.json() as PrayerResponse;
        if (!response.ok) throw new Error(payload.error ?? "Prayer timings are unavailable.");
        return payload;
      })
      .then(setData)
      .catch((error: Error) => setData({ error: error.message }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let saved = DEFAULT_SETTINGS;
      try {
        const parsed = JSON.parse(window.localStorage.getItem("noor-prayer-settings-v1") ?? "null") as Partial<PrayerSettings> | null;
        if (parsed && CITIES.some((city) => city.id === parsed.cityId) && METHODS.some((method) => method.id === parsed.method) && (parsed.school === 0 || parsed.school === 1)) saved = parsed as PrayerSettings;
      } catch { saved = DEFAULT_SETTINGS; }
      setSettings(saved);
      load(cityById(saved.cityId), saved);
      setNow(new Date());
    });
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(timer); };
  }, [load]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSettingsOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen]);

  const updateSettings = (next: PrayerSettings) => {
    setSettings(next);
    window.localStorage.setItem("noor-prayer-settings-v1", JSON.stringify(next));
    load(cityById(next.cityId), next);
  };

  const useLocation = () => {
    if (!("geolocation" in navigator)) { setData({ error: "Location is unavailable in this browser. Choose a city instead." }); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        load({ id: "current", label: "Your location", latitude: position.coords.latitude, longitude: position.coords.longitude }, settings);
        setLocating(false);
      },
      () => { setData({ error: "Location permission was not available. Choose a city instead." }); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  const upcoming = useMemo(() => nextPrayer(data?.timings, now), [data?.timings, now]);
  const countdown = useMemo(() => {
    if (!upcoming || !now) return "—";
    const seconds = Math.max(0, Math.floor((upcoming.target.getTime() - now.getTime()) / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remaining = seconds % 60;
    return [hours, minutes, remaining].map((value) => String(value).padStart(2, "0")).join(":");
  }, [now, upcoming]);

  return (
    <section className="home-prayer-strip" id="prayer-times" aria-label="Today’s five prayer timings">
      <div className="home-prayer-label"><PinIcon/><span><strong>{location.label}</strong><small>{data?.hijri ?? "Local prayer schedule"}</small></span></div>
      <div className="home-prayer-times">{PRAYERS.map((prayer) => <div className={upcoming?.prayer === prayer ? "is-next" : ""} key={prayer}><PrayerIcon prayer={prayer}/><span>{prayer}</span><strong>{loading ? "…" : data?.timings?.[prayer] ?? "—"}</strong></div>)}</div>
      <div className="home-prayer-next"><span>NEXT PRAYER</span><strong>{upcoming?.prayer ?? "Prayer"}</strong><small>{countdown}</small></div>
      <div className="home-prayer-actions"><button type="button" onClick={useLocation} disabled={locating}><PinIcon/>{locating ? "Locating…" : "Use my location"}</button><button className="secondary" type="button" onClick={() => setSettingsOpen(true)} aria-label="Open prayer settings"><SettingsIcon/></button></div>
      {data?.error ? <p className="home-prayer-error" role="alert">{data.error}</p> : null}
      {settingsOpen ? <div className="prayer-settings-overlay" role="dialog" aria-modal="true" aria-label="Prayer time settings"><button className="prayer-settings-backdrop" type="button" onClick={() => setSettingsOpen(false)} aria-label="Close prayer settings"/><div className="home-prayer-settings"><header><div><span>PRAYER SETTINGS</span><strong>Choose your calculation</strong></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close">×</button></header>
        <label><span>City</span><select value={settings.cityId} onChange={(event) => updateSettings({ ...settings, cityId: event.target.value })}>{CITIES.map((city) => <option value={city.id} key={city.id}>{city.label}</option>)}</select></label>
        <label><span>Calculation method</span><select value={settings.method} onChange={(event) => updateSettings({ ...settings, method: Number(event.target.value) })}>{METHODS.map((method) => <option value={method.id} key={method.id}>{method.label}</option>)}</select></label>
        <label><span>Asr method</span><select value={settings.school} onChange={(event) => updateSettings({ ...settings, school: Number(event.target.value) })}><option value={1}>Hanafi</option><option value={0}>Standard</option></select></label>
        <small>{data?.method ?? "Calculated prayer times"} · confirm congregation times with your mosque.</small>
      </div></div> : null}
    </section>
  );
}
