"use client";

import { useEffect, useMemo, useState } from "react";
import { NOOR_LOCATION_EVENT, readNoorLocation, type NoorLocation } from "../site/location-settings";

type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type PrayerPayload = {
  timings?: Record<PrayerName, string>;
  hijri?: string | null;
  method?: string | null;
  error?: string;
};

type QuranProgress = { surah: number; ayah: number; englishName?: string };

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const FALLBACK_TIMES: Record<PrayerName, string> = {
  Fajr: "04:56",
  Dhuhr: "12:21",
  Asr: "16:43",
  Maghrib: "18:33",
  Isha: "19:45",
};

type Locale = "en" | "hi" | "ur";

const COPY: Record<Locale, {
  next: string;
  islamicDate: string;
  reminder: string;
  success: string;
  qibla: string;
  qiblaHelp: string;
  localSchedule: string;
}> = {
  en: { next: "Next prayer", islamicDate: "Islamic calendar", reminder: "Quran", success: "My success is only through Allah.", qibla: "Qibla", qiblaHelp: "Direction from your location", localSchedule: "Local schedule" },
  hi: { next: "अगली नमाज़", islamicDate: "इस्लामी कैलेंडर", reminder: "क़ुरआन", success: "मेरी सफलता केवल अल्लाह की ओर से है।", qibla: "क़िबला", qiblaHelp: "अपनी जगह से सही दिशा", localSchedule: "स्थानीय समय" },
  ur: { next: "اگلی نماز", islamicDate: "اسلامی کیلنڈر", reminder: "قرآن", success: "میری کامیابی صرف اللہ کی طرف سے ہے۔", qibla: "قبلہ", qiblaHelp: "اپنے مقام سے سمت", localSchedule: "مقامی وقت" },
};

function nextPrayer(timings: Record<PrayerName, string>, now: Date) {
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

function formatCountdown(target: Date, now: Date) {
  const seconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining].map((value) => String(value).padStart(2, "0")).join(" : ");
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>;
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/></svg>;
}

function CompassIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m16.5 7.5-2.8 6.2-6.2 2.8 2.8-6.2Z"/></svg>;
}

export default function HeroDailyStatus({ locale, onPrayer, onCalendar, onQuran, onQibla }: {
  locale: Locale;
  onPrayer: () => void;
  onCalendar: () => void;
  onQuran: (target: { surah: number; ayah: number }) => void;
  onQibla: () => void;
}) {
  const [payload, setPayload] = useState<PrayerPayload | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [location, setLocation] = useState<NoorLocation | null>(null);
  const [quranProgress, setQuranProgress] = useState<QuranProgress>({ surah: 1, ayah: 1, englishName: "Al-Fatihah" });
  const copy = COPY[locale];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setNow(new Date()));
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    const progressTimer = window.setTimeout(() => {
      try {
        const progress = JSON.parse(window.localStorage.getItem("noor-quran-progress-v1") ?? "null") as QuranProgress | null;
        if (progress && Number.isInteger(progress.surah) && Number.isInteger(progress.ayah)) setQuranProgress(progress);
      } catch { /* keep Al-Fatihah */ }
    }, 0);
    const load = () => {
      const selected = readNoorLocation();
      setLocation(selected);
      let prayerSettings = { method: 1, school: 1, adjustment: 0 };
      try { prayerSettings = { ...prayerSettings, ...JSON.parse(window.localStorage.getItem("noor-prayer-settings-v1") ?? "{}") }; } catch { /* keep safe defaults */ }
      fetch(`/api/prayer-times?latitude=${selected.latitude}&longitude=${selected.longitude}&method=${prayerSettings.method}&school=${prayerSettings.school}&adjustment=${prayerSettings.adjustment}`)
      .then(async (response) => {
        const result = await response.json() as PrayerPayload;
        if (!response.ok) throw new Error(result.error ?? "Prayer timings unavailable");
        return result;
      })
      .then(setPayload)
      .catch(() => setPayload({ timings: FALLBACK_TIMES }));
    };
    load();
    window.addEventListener(NOOR_LOCATION_EVENT, load);
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(timer); window.clearTimeout(progressTimer); window.removeEventListener(NOOR_LOCATION_EVENT, load); };
  }, []);

  const timings = payload?.timings ?? FALLBACK_TIMES;
  const upcoming = useMemo(() => now ? nextPrayer(timings, now) : null, [now, timings]);
  const localeTag = locale === "hi" ? "hi-IN" : locale === "ur" ? "ur-PK" : "en-GB";
  const currentDate = now ?? new Date();
  const hijri = payload?.hijri ?? new Intl.DateTimeFormat(`${localeTag}-u-ca-islamic-umalqura`, { day: "numeric", month: "long", year: "numeric" }).format(currentDate);
  const gregorian = new Intl.DateTimeFormat(localeTag, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(currentDate);

  return (
    <div className="noor-daily-status" aria-label="Today in NOOR">
      <button type="button" className="daily-status-card prayer-summary-card" onClick={onPrayer} aria-label={`${copy.next}: ${upcoming?.prayer ?? "Prayer"}. Open prayer times.`}>
        <span className="daily-card-open" aria-hidden="true">↗</span>
        <div className="daily-card-label"><ClockIcon/><span>{copy.next}</span></div>
        <strong>{upcoming?.prayer ?? "Prayer"}</strong>
        <div className="prayer-countdown" aria-live="polite">{upcoming && now ? formatCountdown(upcoming.target, now) : "00 : 00 : 00"}</div>
        <div className="countdown-labels"><span>HRS</span><span>MINS</span><span>SECS</span></div>
        <span className="prayer-orbit" aria-hidden="true"><i/><strong>{upcoming?.prayer ?? "Prayer"}</strong><small>up next</small></span>
        <div className="daily-card-meta"><b>{upcoming ? timings[upcoming.prayer] : "—"}</b><span>{location?.label ?? copy.localSchedule}</span></div>
      </button>

      <button type="button" className="daily-status-card date-summary-card" onClick={onCalendar} aria-label={`${copy.islamicDate}: ${hijri}. Open Islamic calendar.`}>
        <span className="daily-card-open" aria-hidden="true">↗</span>
        <div className="daily-card-label"><CalendarIcon/><span>{copy.islamicDate}</span></div>
        <strong>{hijri}</strong>
        <p>{gregorian}</p>
        <span className="daily-card-source">Hijri calendar</span>
      </button>

      <button type="button" className="daily-status-card verse-summary-card" onClick={() => onQuran({ surah: quranProgress.surah, ayah: quranProgress.ayah })} aria-label={`Continue Quran at Surah ${quranProgress.englishName ?? quranProgress.surah}, verse ${quranProgress.ayah}`}>
        <span className="daily-card-open" aria-hidden="true">↗</span>
        <div className="daily-card-label"><span className="quote-mark" aria-hidden="true">“</span><span>{quranProgress.surah === 1 && quranProgress.ayah === 1 ? copy.reminder : "Continue Quran"}</span></div>
        {quranProgress.surah === 1 && quranProgress.ayah === 1 ? <>
          <p className="hero-ayah" lang="ar" dir="rtl">وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ</p>
          <blockquote>{copy.success}</blockquote>
          <span className="daily-card-source">Surah Hud · 11:88</span>
          <span className="quran-progress-track" aria-hidden="true"><i /></span>
        </> : <>
          <p className="hero-ayah continue-reading-mark" lang="ar" dir="rtl">اقْرَأْ</p>
          <blockquote>Continue where you left off</blockquote>
          <span className="daily-card-source">{quranProgress.englishName ? `Surah ${quranProgress.englishName}` : `Surah ${quranProgress.surah}`} · {quranProgress.surah}:{quranProgress.ayah}</span>
          <span className="quran-progress-track" aria-hidden="true"><i /></span>
        </>}
      </button>

      <button type="button" className="daily-status-card qibla-summary-card" onClick={onQibla} aria-label={`${copy.qibla}. ${copy.qiblaHelp}. Open compass.`}>
        <span className="daily-card-open" aria-hidden="true">↗</span>
        <div className="daily-card-label"><CompassIcon/><span>{copy.qibla}</span></div>
        <span className="mini-qibla-content">
          <span className="mini-qibla-dial" aria-hidden="true">
            <b className="mini-qibla-n">N</b><b className="mini-qibla-e">E</b><b className="mini-qibla-s">S</b><b className="mini-qibla-w">W</b>
            <i className="mini-qibla-arrow"/><i className="mini-kaaba"/>
          </span>
          <span className="mini-qibla-copy"><strong>Open compass</strong><small>{location?.label ?? copy.qiblaHelp}</small></span>
        </span>
      </button>
    </div>
  );
}
