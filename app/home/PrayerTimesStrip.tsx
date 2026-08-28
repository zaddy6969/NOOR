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
    if (prayerDate > now) return { prayer, minutes: Math.max(0, Math.ceil((prayerDate.getTime() - now.getTime()) / 60000)) };
  }
  const [hours, minutes] = timings.Fajr.split(":").map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return { prayer: "Fajr" as PrayerName, minutes: Math.max(0, Math.ceil((tomorrow.getTime() - now.getTime()) / 60000)) };
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
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(timer); };
  }, [load]);

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
  const countdown = upcoming ? `${Math.floor(upcoming.minutes / 60)}h ${upcoming.minutes % 60}m` : "—";

  return (
    <section className="home-prayer-strip" id="prayer-times" aria-label="Today’s five prayer timings">
      <div className="home-prayer-label"><span>TODAY’S PRAYERS</span><strong>{location.label}</strong><small>{data?.hijri ?? "Local prayer schedule"}</small></div>
      <div className="home-prayer-times">{PRAYERS.map((prayer) => <div className={upcoming?.prayer === prayer ? "is-next" : ""} key={prayer}><span>{prayer}</span><strong>{loading ? "…" : data?.timings?.[prayer] ?? "—"}</strong></div>)}</div>
      <div className="home-prayer-next"><span>NEXT</span><strong>{upcoming?.prayer ?? "Prayer"}</strong><small>{countdown}</small></div>
      <div className="home-prayer-actions"><button type="button" onClick={useLocation} disabled={locating}>{locating ? "Locating…" : "Use location"}</button><button className="secondary" type="button" onClick={() => setSettingsOpen((value) => !value)} aria-expanded={settingsOpen}>Settings</button></div>
      {data?.error ? <p className="home-prayer-error" role="alert">{data.error}</p> : null}
      {settingsOpen ? <div className="home-prayer-settings">
        <label><span>City</span><select value={settings.cityId} onChange={(event) => updateSettings({ ...settings, cityId: event.target.value })}>{CITIES.map((city) => <option value={city.id} key={city.id}>{city.label}</option>)}</select></label>
        <label><span>Calculation</span><select value={settings.method} onChange={(event) => updateSettings({ ...settings, method: Number(event.target.value) })}>{METHODS.map((method) => <option value={method.id} key={method.id}>{method.label}</option>)}</select></label>
        <label><span>Asr</span><select value={settings.school} onChange={(event) => updateSettings({ ...settings, school: Number(event.target.value) })}><option value={1}>Hanafi</option><option value={0}>Standard</option></select></label>
        <small>{data?.method ?? "Calculated prayer times"} · confirm congregation times with your mosque.</small>
      </div> : null}
    </section>
  );
}
