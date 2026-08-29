"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import HomeFeatureWorkspace, { type FeatureId, type QuranTarget } from "./home/HomeFeatureWorkspace";

type IconName = "book" | "clock" | "compass" | "calendar" | "mosque" | "dua" | "darood" | "zakat" | "prayer" | "dictionary" | "names" | "pin" | "search" | "moon" | "profile";

type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type PrayerPayload = { timings?: Record<PrayerName, string>; hijri?: string | null };

const FEATURES: Array<{ id: FeatureId; label: string; icon: IconName }> = [
  { id: "quran", label: "Quran", icon: "book" },
  { id: "prayer-times", label: "Prayer Times", icon: "clock" },
  { id: "qibla", label: "Qibla", icon: "compass" },
  { id: "islamic-calendar", label: "Islamic Calendar", icon: "calendar" },
  { id: "mosque-finder", label: "Mosque Finder", icon: "mosque" },
  { id: "daily-duas", label: "Daily Duas", icon: "dua" },
  { id: "darood", label: "Darood Sharif", icon: "darood" },
  { id: "zakat", label: "Zakat Calculator", icon: "zakat" },
  { id: "kaza", label: "Kaza Namaz", icon: "prayer" },
  { id: "lughat", label: "Firozul Lugat", icon: "dictionary" },
  { id: "names", label: "99 Names", icon: "names" },
  { id: "destinations", label: "Muslim Destinations", icon: "pin" },
];

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: <><path d="M4 4.5h6a4 4 0 0 1 4 4V21a4 4 0 0 0-4-4H4Z"/><path d="M20 4.5h-2a4 4 0 0 0-4 4V21a4 4 0 0 1 4-4h2Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6.5V12l4 2.3"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m16.8 7.2-3 6.6-6.6 3 3-6.6Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/><path d="M16 14a3 3 0 1 0 3 3 3.6 3.6 0 0 1-3-3Z"/></>,
    mosque: <><path d="M4 21V11h16v10M8 21v-5a4 4 0 0 1 8 0v5M7 11a5 5 0 0 1 10 0M12 3v3M3 21h18"/></>,
    dua: <><path d="M8.5 21 5.7 18.1a4 4 0 0 1-1.1-2.8V9.7a1.5 1.5 0 0 1 3 0v3.8-7a1.5 1.5 0 0 1 3 0V14l1.4 1.6 1.4-1.6V6.5a1.5 1.5 0 0 1 3 0v7-3.8a1.5 1.5 0 0 1 3 0v5.6a4 4 0 0 1-1.1 2.8L15.5 21"/></>,
    darood: <><circle cx="12" cy="4.5" r="1.6"/><circle cx="7.5" cy="7.5" r="1.6"/><circle cx="6" cy="12.5" r="1.6"/><circle cx="9" cy="17" r="1.6"/><circle cx="15" cy="17" r="1.6"/><circle cx="18" cy="12.5" r="1.6"/><circle cx="16.5" cy="7.5" r="1.6"/><path d="M12 18.6V22"/></>,
    zakat: <><circle cx="12" cy="12" r="9"/><path d="m8 16 8-8M8.5 8.5h.01M15.5 15.5h.01"/></>,
    prayer: <><path d="M4 21h16M8 21v-6.3a4 4 0 0 1 8 0V21"/><circle cx="12" cy="7" r="2.1"/></>,
    dictionary: <><path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z"/><path d="M20 4h-3a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h3Z"/></>,
    names: <><path d="m12 2 2.3 3.2 3.9-.4.4 3.9L22 11l-2 3.4.8 3.8-3.9.8-2.6 3-2.8-2.8-3.9.7-.7-3.9L3 13.6l2-3.4-.8-3.8 3.9-.8Z"/><text x="12" y="14" textAnchor="middle" stroke="none" fill="currentColor" fontSize="7">99</text></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    moon: <path d="M20 15.5A8 8 0 1 1 11.5 4 6.3 6.3 0 0 0 20 15.5Z"/>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function nextPrayer(timings: PrayerPayload["timings"], now: Date) {
  if (!timings) return null;
  for (const prayer of PRAYERS) {
    const [h, m] = timings[prayer].split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) continue;
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target > now) return { prayer, target };
  }
  const [h, m] = timings.Fajr.split(":").map(Number);
  const target = new Date(now);
  target.setDate(target.getDate() + 1);
  target.setHours(h, m, 0, 0);
  return { prayer: "Fajr" as PrayerName, target };
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("quran");
  const [quranTarget] = useState<QuranTarget>({ surah: 1, ayah: null });
  const [now, setNow] = useState(() => new Date());
  const [prayerData, setPrayerData] = useState<PrayerPayload | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    fetch("/api/prayer-times?latitude=12.9716&longitude=77.5946&method=1&school=1")
      .then((response) => response.json())
      .then((data: PrayerPayload) => setPrayerData(data))
      .catch(() => setPrayerData(null));
    return () => window.clearInterval(timer);
  }, []);

  const upcoming = useMemo(() => nextPrayer(prayerData?.timings, now), [prayerData?.timings, now]);
  const countdown = useMemo(() => {
    if (!upcoming) return { h: "04", m: "15", s: "33" };
    const sec = Math.max(0, Math.floor((upcoming.target.getTime() - now.getTime()) / 1000));
    return {
      h: String(Math.floor(sec / 3600)).padStart(2, "0"),
      m: String(Math.floor((sec % 3600) / 60)).padStart(2, "0"),
      s: String(sec % 60).padStart(2, "0"),
    };
  }, [now, upcoming]);

  const prayerTime = upcoming && prayerData?.timings?.[upcoming.prayer]
    ? new Date(`${now.toDateString()} ${prayerData.timings[upcoming.prayer]}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "07:30 PM";

  const hijri = useMemo(() => {
    try {
      const formatted = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(now);
      return formatted.replace(" AH", "") + " AH";
    } catch { return prayerData?.hijri ?? "24 Safar 1447 AH"; }
  }, [now, prayerData?.hijri]);

  const activate = (id: FeatureId) => {
    setActiveFeature(id);
    window.setTimeout(() => workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <main className="noor-reference-preview">
      <div className="noor-ref-shell">
        <header className="noor-ref-header">
          <Link className="noor-ref-brand" href="/" aria-label="NOOR Daily Muslim home">
            <span className="noor-ref-crescent" aria-hidden="true"><i /></span>
            <span><strong>NOOR</strong><small>DAILY MUSLIM</small></span>
          </Link>
          <div className="noor-ref-actions">
            <button className="noor-ref-search" type="button"><Icon name="search"/><span>Search everything...</span></button>
            <button className="noor-ref-round" type="button" aria-label="Dark mode"><Icon name="moon"/></button>
            <button className="noor-ref-language" type="button">EN</button>
            <Link className="noor-ref-round" href="/sign-in" aria-label="Profile"><Icon name="profile"/></Link>
          </div>
        </header>

        <section className="noor-ref-hero" aria-label="NOOR daily dashboard">
          <div className="noor-ref-greeting">
            <h1>Assalamu Alaikum</h1>
            <p>May Allah bless your day <span>🌿</span></p>
          </div>

          <div className="noor-ref-dashboard">
            <article className="noor-ref-card noor-ref-prayer-card">
              <span>Next Prayer</span>
              <h3>{upcoming?.prayer ?? "Isha"}</h3>
              <span className="crescent-large" aria-hidden="true" />
              <div className="noor-ref-countdown">
                <div><strong>{countdown.h}</strong><small>HRS</small></div>
                <div><strong>{countdown.m}</strong><small>MINS</small></div>
                <div><strong>{countdown.s}</strong><small>SECS</small></div>
              </div>
              <div className="noor-ref-prayer-time">{prayerTime}</div>
            </article>

            <article className="noor-ref-card noor-ref-date-card">
              <span>Islamic Date</span>
              <h3>{hijri}</h3>
              <p>{now.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
              <button className="noor-ref-outline-btn" type="button" onClick={() => activate("islamic-calendar")}>View Calendar</button>
            </article>

            <article className="noor-ref-card noor-ref-quran-card">
              <span>Quran Tracker</span>
              <p>Continue your journey</p>
              <div className="noor-ref-quran-track">
                <strong>Surah Al-Kahf</strong>
                <span>Ayah 32/110</span>
                <div className="noor-ref-progress-row"><div className="noor-ref-progress"><i /></div><b>29%</b></div>
              </div>
              <button className="noor-ref-outline-btn" type="button" onClick={() => activate("quran")}>Continue Reading</button>
            </article>
          </div>

          <nav className="noor-ref-feature-rail" aria-label="NOOR features">
            {FEATURES.map((feature) => (
              <button className={activeFeature === feature.id ? "active" : ""} type="button" onClick={() => activate(feature.id)} key={feature.id}>
                <Icon name={feature.icon}/><span>{feature.label}</span>
              </button>
            ))}
          </nav>

          <p className="noor-ref-preview-note">Preview branch only — the live production homepage is unchanged.</p>
        </section>
      </div>

      <div className="noor-ref-workspace-wrap" ref={workspaceRef}>
        <HomeFeatureWorkspace activeFeature={activeFeature} quranTarget={quranTarget} />
      </div>
    </main>
  );
}
