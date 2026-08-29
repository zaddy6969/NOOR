"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type PrayerPayload = { timings?: Record<PrayerName, string>; hijri?: string | null };
type City = { id: string; label: string; latitude: number; longitude: number };

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const CITIES: City[] = [
  { id: "bengaluru", label: "Bengaluru", latitude: 12.9716, longitude: 77.5946 },
  { id: "mumbai", label: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { id: "delhi", label: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { id: "hyderabad", label: "Hyderabad", latitude: 17.385, longitude: 78.4867 },
  { id: "kolkata", label: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
  { id: "lucknow", label: "Lucknow", latitude: 26.8467, longitude: 80.9462 },
];

function qiblaBearing(latitude: number, longitude: number) {
  const toRad = (value: number) => value * Math.PI / 180;
  const kaabaLat = toRad(21.4225);
  const kaabaLon = toRad(39.8262);
  const lat = toRad(latitude);
  const lon = toRad(longitude);
  const delta = kaabaLon - lon;
  const y = Math.sin(delta) * Math.cos(kaabaLat);
  const x = Math.cos(lat) * Math.sin(kaabaLat) - Math.sin(lat) * Math.cos(kaabaLat) * Math.cos(delta);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function cardinal(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8];
}

function nextPrayer(timings: PrayerPayload["timings"], now: Date) {
  if (!timings) return null;
  for (const prayer of PRAYERS) {
    const [hours, minutes] = timings[prayer].split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) continue;
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target > now) return { prayer, target, raw: timings[prayer] };
  }
  const [hours, minutes] = timings.Fajr.split(":").map(Number);
  const target = new Date(now);
  target.setDate(target.getDate() + 1);
  target.setHours(hours, minutes, 0, 0);
  return { prayer: "Fajr" as PrayerName, target, raw: timings.Fajr };
}

function twelveHour(value?: string) {
  if (!value) return "—";
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function activate(feature: string) {
  window.dispatchEvent(new CustomEvent("noor:activate-feature", { detail: { feature } }));
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/><path d="M15.5 14.2a3 3 0 1 0 3.2 3.2 3.5 3.5 0 0 1-3.2-3.2Z"/></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6.5V12l3.8 2.2"/></svg>;
}

function CompassIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m16.5 7.5-2.8 6.2-6.2 2.8 2.8-6.2Z"/></svg>;
}

export default function HomeStatusStrip() {
  const [target, setTarget] = useState<Element | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [city, setCity] = useState(CITIES[0]);
  const [data, setData] = useState<PrayerPayload | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTarget(document.querySelector(".noor-feature-shell"));
      try {
        const saved = JSON.parse(window.localStorage.getItem("noor-prayer-settings-v1") ?? "null") as { cityId?: string; method?: number; school?: number } | null;
        const selected = CITIES.find((item) => item.id === saved?.cityId) ?? CITIES[0];
        setCity(selected);
        const method = saved?.method ?? 1;
        const school = saved?.school ?? 1;
        fetch(`/api/prayer-times?latitude=${selected.latitude}&longitude=${selected.longitude}&method=${method}&school=${school}`)
          .then((response) => response.json())
          .then((payload: PrayerPayload) => setData(payload))
          .catch(() => setData(null));
      } catch {
        setCity(CITIES[0]);
      }
    });
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(timer); };
  }, []);

  const upcoming = useMemo(() => nextPrayer(data?.timings, now), [data?.timings, now]);
  const remaining = useMemo(() => {
    if (!upcoming) return "Prayer schedule";
    const minutes = Math.max(0, Math.floor((upcoming.target.getTime() - now.getTime()) / 60000));
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return hours > 0 ? `${hours}h ${rest}m remaining` : `${rest}m remaining`;
  }, [now, upcoming]);

  const hijri = data?.hijri ?? new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(now);
  const bearing = qiblaBearing(city.latitude, city.longitude);

  if (!target) return null;

  return createPortal(
    <section className="noor-home-status" aria-label="Daily Islamic quick information">
      <button type="button" onClick={() => activate("islamic-calendar")}>
        <span className="status-icon gold"><CalendarIcon/></span>
        <span><small>Today’s Islamic Date</small><strong>{hijri}</strong></span><b aria-hidden="true">›</b>
      </button>
      <button type="button" onClick={() => activate("prayer-times")}>
        <span className="status-icon"><ClockIcon/></span>
        <span><small>Next Namaz</small><strong>{upcoming ? `${upcoming.prayer} · ${twelveHour(upcoming.raw)}` : "Loading prayer time…"}</strong><em>{remaining}</em></span><b aria-hidden="true">›</b>
      </button>
      <button type="button" onClick={() => activate("qibla")}>
        <span className="status-icon"><CompassIcon/></span>
        <span><small>Qibla direction · {city.label}</small><strong>{Math.round(bearing)}° {cardinal(bearing)}</strong></span><b aria-hidden="true">›</b>
      </button>
    </section>,
    target,
  );
}
