"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_NOOR_LOCATION,
  locationFromCity,
  NOOR_CITIES,
  NOOR_LOCATION_EVENT,
  readNoorLocation,
  writeNoorLocation,
  type NoorLocation,
} from "../site/location-settings";
import { DEFAULT_PRAYER_SETTINGS, PRAYER_METHODS, PRAYERS, type PrayerName, type PrayerSettings } from "../home/PrayerTimesStrip";

type TodayResponse = {
  timings?: Record<PrayerName, string>;
  date?: string;
  hijri?: string | null;
  timezone?: string;
  method?: string;
  error?: string;
};
type MonthDay = { gregorianDate: string; gregorianDay: number; weekday: string; hijriDate: string; hijriLabel: string; timings: Record<PrayerName, string> };
type MonthResponse = { days?: MonthDay[]; error?: string };

const SETTINGS_KEY = "noor-prayer-settings-v1";
const MONTH_FORMAT = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

function readSettings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null") as Partial<PrayerSettings> | null;
    if (!parsed || !NOOR_CITIES.some((city) => city.id === parsed.cityId) || !PRAYER_METHODS.some((method) => method.id === parsed.method) || (parsed.school !== 0 && parsed.school !== 1)) return DEFAULT_PRAYER_SETTINGS;
    return { ...DEFAULT_PRAYER_SETTINGS, ...parsed, adjustment: Number.isInteger(parsed.adjustment) ? Number(parsed.adjustment) : 0 } as PrayerSettings;
  } catch { return DEFAULT_PRAYER_SETTINGS; }
}

function nextPrayer(timings: TodayResponse["timings"], now: Date) {
  if (!timings) return null;
  for (const prayer of PRAYERS) {
    const [hours, minutes] = timings[prayer].split(":").map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target > now) return { prayer, target };
  }
  const [hours, minutes] = timings.Fajr.split(":").map(Number);
  const target = new Date(now);
  target.setDate(target.getDate() + 1);
  target.setHours(hours, minutes, 0, 0);
  return { prayer: "Fajr" as PrayerName, target };
}

function apiQuery(location: NoorLocation, settings: PrayerSettings) {
  return `latitude=${location.latitude}&longitude=${location.longitude}&method=${settings.method}&school=${settings.school}&adjustment=${settings.adjustment}`;
}

export default function PrayerTimesCenter() {
  const [location, setLocation] = useState<NoorLocation>(DEFAULT_NOOR_LOCATION);
  const [settings, setSettings] = useState<PrayerSettings>(DEFAULT_PRAYER_SETTINGS);
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [monthData, setMonthData] = useState<MonthResponse | null>(null);
  const [view, setView] = useState(() => ({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }));
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  const load = useCallback(async (nextLocation: NoorLocation, nextSettings: PrayerSettings, nextView: typeof view) => {
    setLoading(true);
    const query = apiQuery(nextLocation, nextSettings);
    try {
      const [todayResponse, monthResponse] = await Promise.all([
        fetch(`/api/prayer-times?${query}`),
        fetch(`/api/prayer-times/month?${query}&year=${nextView.year}&month=${nextView.month}`),
      ]);
      const [todayPayload, monthPayload] = await Promise.all([todayResponse.json() as Promise<TodayResponse>, monthResponse.json() as Promise<MonthResponse>]);
      if (!todayResponse.ok) throw new Error(todayPayload.error ?? "Today’s prayer times are unavailable.");
      setToday(todayPayload);
      setMonthData(monthResponse.ok ? monthPayload : { error: monthPayload.error ?? "Monthly schedule unavailable." });
    } catch (error) {
      setToday({ error: error instanceof Error ? error.message : "Prayer times are unavailable." });
      setMonthData(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedSettings = readSettings();
      const savedLocation = readNoorLocation();
      setSettings(savedSettings);
      setLocation(savedLocation);
      void load(savedLocation, savedSettings, view);
    });
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    const syncLocation = () => {
      const nextLocation = readNoorLocation();
      const nextSettings = readSettings();
      setLocation(nextLocation);
      setSettings(nextSettings);
      void load(nextLocation, nextSettings, view);
    };
    window.addEventListener(NOOR_LOCATION_EVENT, syncLocation);
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(timer); window.removeEventListener(NOOR_LOCATION_EVENT, syncLocation); };
  }, [load, view]);

  const upcoming = useMemo(() => nextPrayer(today?.timings, now), [now, today?.timings]);
  const countdown = useMemo(() => {
    if (!upcoming) return "—";
    const seconds = Math.max(0, Math.floor((upcoming.target.getTime() - now.getTime()) / 1000));
    return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((part) => String(part).padStart(2, "0")).join(":");
  }, [now, upcoming]);
  const methodLabel = PRAYER_METHODS.find((method) => method.id === settings.method)?.label ?? today?.method ?? "Calculated";
  const todayKey = [String(now.getDate()).padStart(2, "0"), String(now.getMonth() + 1).padStart(2, "0"), now.getFullYear()].join("-");

  const updateSettings = (next: PrayerSettings, nextLocation = location) => {
    setSettings(next);
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    setLocation(nextLocation);
    if (nextLocation.source === "preset") writeNoorLocation(nextLocation);
    else void load(nextLocation, next, view);
  };

  const selectCity = (cityId: string) => {
    const next = { ...settings, cityId };
    updateSettings(next, locationFromCity(cityId));
  };

  const useLocation = () => {
    if (!navigator.geolocation) { setToday({ error: "Location is unavailable in this browser. Choose a city instead." }); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        writeNoorLocation({ id: "current", label: "Current location", latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, source: "device" });
        setLocating(false);
      },
      () => { setToday({ error: "Location permission was not available. Choose a city instead." }); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  const changeMonth = (delta: number) => setView((current) => {
    const date = new Date(current.year, current.month - 1 + delta, 1);
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  });

  return (
    <section className="prayer-center" aria-busy={loading}>
      <div className="prayer-center-status">
        <div><span>NEXT PRAYER · {location.label.toUpperCase()}</span><h2>{upcoming?.prayer ?? "Prayer"}</h2><strong>{countdown}</strong><p>{today?.hijri ?? "Local prayer schedule"} · {today?.timezone ?? "Local time"}</p></div>
        <div className="prayer-center-today" aria-label="Today’s prayer times">
          {PRAYERS.map((prayer) => <article className={upcoming?.prayer === prayer ? "is-next" : ""} key={prayer}><span>{prayer}</span><strong>{loading ? "…" : today?.timings?.[prayer] ?? "—"}</strong>{upcoming?.prayer === prayer ? <small>Next</small> : null}</article>)}
        </div>
      </div>

      <section className="prayer-center-controls" aria-label="Prayer calculation settings">
        <label><span>City</span><select value={location.source === "preset" ? location.id : settings.cityId} onChange={(event) => selectCity(event.target.value)}>{NOOR_CITIES.map((city) => <option value={city.id} key={city.id}>{city.label}</option>)}</select></label>
        <label><span>Calculation</span><select value={settings.method} onChange={(event) => updateSettings({ ...settings, method: Number(event.target.value) })}>{PRAYER_METHODS.map((method) => <option value={method.id} key={method.id}>{method.label}</option>)}</select></label>
        <label><span>Asr method</span><select value={settings.school} onChange={(event) => updateSettings({ ...settings, school: Number(event.target.value) })}><option value={1}>Hanafi</option><option value={0}>Standard</option></select></label>
        <label><span>Hijri adjustment</span><select value={settings.adjustment} onChange={(event) => updateSettings({ ...settings, adjustment: Number(event.target.value) })}><option value={-2}>−2 days</option><option value={-1}>−1 day</option><option value={0}>No adjustment</option><option value={1}>+1 day</option><option value={2}>+2 days</option></select></label>
        <button type="button" onClick={useLocation} disabled={locating}>{locating ? "Locating…" : "Use my location"}</button>
        <p>Calculation: <strong>{methodLabel}</strong> · <strong>{settings.school === 1 ? "Hanafi" : "Standard"}</strong> · <strong>{location.label}</strong></p>
      </section>

      {today?.error ? <p className="prayer-center-error" role="alert">{today.error}</p> : null}

      <section className="prayer-month">
        <header><div><span>MONTHLY SCHEDULE</span><h2>{MONTH_FORMAT.format(new Date(view.year, view.month - 1, 1))}</h2></div><div><button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">←</button><button type="button" onClick={() => setView({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })}>Today</button><button type="button" onClick={() => changeMonth(1)} aria-label="Next month">→</button></div></header>
        <div className="prayer-month-scroll">
          <table><thead><tr><th scope="col">Date</th>{PRAYERS.map((prayer) => <th scope="col" key={prayer}>{prayer}</th>)}</tr></thead><tbody>
            {monthData?.days?.map((day) => <tr className={day.gregorianDate === todayKey ? "is-today" : ""} key={day.gregorianDate}><th scope="row"><strong>{day.weekday}, {day.gregorianDay}</strong><span>{day.hijriLabel}</span></th>{PRAYERS.map((prayer) => <td key={prayer}>{day.timings[prayer]}</td>)}</tr>)}
          </tbody></table>
          {!loading && monthData?.error ? <p className="prayer-center-error" role="alert">{monthData.error}</p> : null}
          {loading ? <p className="prayer-month-loading" role="status">Loading monthly prayer times…</p> : null}
        </div>
      </section>
      <p className="prayer-center-source">Times are calculated by AlAdhan / Islamic Network. Calculation results are not mosque iqamah times; verify local congregation times directly.</p>
    </section>
  );
}
