"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrayerSchedule } from "../prayer-times/usePrayerSchedule";
import { formatCountdown } from "../../lib/prayer-schedule";

type Locale = "en" | "hi" | "ur";
const LABELS = {
  en: {
    next: "Next prayer",
    calendar: "Islamic calendar",
    resume: "Resume Quran",
    dua: "Daily duas",
    change: "Change city",
    qibla: "Open Qibla compass",
  },
  hi: {
    next: "अगली नमाज़",
    calendar: "इस्लामी कैलेंडर",
    resume: "क़ुरआन जारी रखें",
    dua: "रोज़ाना दुआएँ",
    change: "शहर बदलें",
    qibla: "क़िबला खोलें",
  },
  ur: {
    next: "اگلی نماز",
    calendar: "اسلامی کیلنڈر",
    resume: "قرآن جاری رکھیں",
    dua: "روزانہ دعائیں",
    change: "شہر بدلیں",
    qibla: "قبلہ کھولیں",
  },
};
export default function HeroDailyStatus({
  locale,
  onPrayer,
  onCalendar,
  onQuran,
  onQibla,
}: {
  locale: Locale;
  onPrayer: () => void;
  onCalendar: () => void;
  onQuran: (target: { surah: number; ayah: number }) => void;
  onQibla: () => void;
}) {
  const {
    location,
    confirmed,
    schedule,
    now,
    loading,
    error,
    cached,
    upcoming,
  } = usePrayerSchedule();
  const [progress, setProgress] = useState<{
    surah: number;
    ayah: number;
    englishName?: string;
  } | null>(null);
  useEffect(() => {
    const sync = () => {
      try {
        const value = JSON.parse(
          localStorage.getItem("noor-quran-progress-v1") ?? "null",
        );
        if (
          value &&
          Number.isInteger(value.surah) &&
          value.surah >= 1 &&
          value.surah <= 114 &&
          Number.isInteger(value.ayah) &&
          value.ayah >= 1
        )
          setProgress(value);
      } catch {
        /* no reading history */
      }
    };
    sync();
    window.addEventListener("noor:quran-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("noor:quran-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const copy = LABELS[locale];
  const localeTag =
    locale === "hi" ? "hi-IN" : locale === "ur" ? "ur-PK" : "en-GB";
  const gregorian = now
    ? new Intl.DateTimeFormat(localeTag, {
        timeZone: schedule?.timezone ?? location.timezone,
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now)
    : "Loading date…";
  return (
    <>
      <div className="daily-location-line">
        <span>
          {location.label}
          {!confirmed ? " · default city" : ""}
          {schedule ? " · " + schedule.timezone : ""}
        </span>
        <Link href="/prayer-times">{copy.change} →</Link>
      </div>
      <div className="noor-daily-status" aria-label="Today in NOOR">
        <button
          type="button"
          className="daily-status-card prayer-summary-card"
          onClick={onPrayer}
          aria-label={
            copy.next +
            ": " +
            (upcoming?.prayer ?? (loading ? "Loading" : "Unavailable")) +
            ". Open prayer times."
          }
        >
          <span className="daily-card-label">{copy.next}</span>
          <strong>
            {loading ? "Loading…" : (upcoming?.prayer ?? "Unavailable")}
          </strong>
          <div className="prayer-countdown" aria-hidden="true">
            {upcoming && now ? formatCountdown(upcoming.target, now) : "—"}
          </div>
          <span className="sr-only">
            {upcoming
              ? upcoming.prayer + " at " + upcoming.time
              : "No verified next-prayer time is available."}
          </span>
          <div className="daily-card-meta">
            <b>
              {upcoming?.time ?? "—"}
              {upcoming?.tomorrow ? " · tomorrow" : ""}
            </b>
            <span>
              {error ||
                (cached
                  ? "Saved schedule for today"
                  : (schedule?.method ?? "Checking local schedule"))}
            </span>
          </div>
        </button>
        <button
          type="button"
          className="daily-status-card verse-summary-card"
          onClick={() => onQuran(progress ?? { surah: 1, ayah: 1 })}
        >
          <span className="daily-card-label">
            {progress ? copy.resume : "Read Quran"}
          </span>
          <strong>
            {progress?.englishName ??
              (progress ? "Surah " + progress.surah : "Al-Fatihah")}
          </strong>
          <p>
            {progress
              ? "Continue at " + progress.surah + ":" + progress.ayah
              : "Begin with the opening Surah"}
          </p>
          <span className="daily-card-source">Open the reader →</span>
        </button>
        <button
          type="button"
          className="daily-status-card date-summary-card"
          onClick={onCalendar}
        >
          <span className="daily-card-label">{copy.calendar}</span>
          <strong>{schedule?.hijri ?? "Check Hijri date"}</strong>
          <p>{gregorian}</p>
          <span className="daily-card-source">
            Calculated date · local sighting may differ
          </span>
        </button>
        <button
          type="button"
          className="daily-status-card qibla-summary-card"
          onClick={onQibla}
        >
          <span className="daily-card-label">Qibla</span>
          <strong>{copy.qibla}</strong>
          <p>Find the bearing from your selected location</p>
          <span className="daily-card-source">Open compass →</span>
        </button>
      </div>
      <div className="daily-ayah-link">
        <Link href="/quran?surah=11&ayah=88">
          <span lang="ar" dir="rtl">
            وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
          </span>{" "}
          My success is only through Allah. · Quran 11:88 →
        </Link>
        <Link href="/#daily-duas">{copy.dua} →</Link>
      </div>
    </>
  );
}
