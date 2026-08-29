"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import HomeFeatureWorkspace, { type FeatureId, type QuranTarget } from "./home/HomeFeatureWorkspace";
import PrayerTimesStrip from "./home/PrayerTimesStrip";
import SiteFooter from "./site/SiteFooter";
import { HeaderUtilities, SearchLauncher } from "./site/SiteUtilities";

type IconName = "book" | "clock" | "compass" | "calendar" | "mosque" | "dua" | "darood" | "zakat" | "prayer" | "dictionary" | "names" | "pin" | "home" | "grid" | "search" | "profile";

export function NoorIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: <><path d="M3.8 5.5A3.7 3.7 0 0 1 7.5 2H11a3 3 0 0 1 3 3v16a3 3 0 0 0-3-3H7.5a3.7 3.7 0 0 0-3.7 3.5Z"/><path d="M20.2 5.5A3.7 3.7 0 0 0 16.5 2H14v19a3 3 0 0 1 3-3h3.2Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6.5V12l3.8 2.2"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m16.5 7.5-2.8 6.2-6.2 2.8 2.8-6.2Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/><path d="M16 14a3 3 0 1 0 3 3 3.4 3.4 0 0 1-3-3Z"/></>,
    mosque: <><path d="M4 21V11h16v10M8 21v-5a4 4 0 0 1 8 0v5M7 11a5 5 0 0 1 10 0M12 3v3M3 21h18"/></>,
    dua: <><path d="M8.5 21 5.7 18.1a4 4 0 0 1-1.1-2.8V9.7a1.5 1.5 0 0 1 3 0v3.8-7a1.5 1.5 0 0 1 3 0V14l1.4 1.6 1.4-1.6V6.5a1.5 1.5 0 0 1 3 0v7-3.8a1.5 1.5 0 0 1 3 0v5.6a4 4 0 0 1-1.1 2.8L15.5 21"/></>,
    darood: <><circle cx="12" cy="4.5" r="1.6"/><circle cx="7.5" cy="7.5" r="1.6"/><circle cx="6" cy="12.5" r="1.6"/><circle cx="9" cy="17" r="1.6"/><circle cx="15" cy="17" r="1.6"/><circle cx="18" cy="12.5" r="1.6"/><circle cx="16.5" cy="7.5" r="1.6"/><path d="M12 18.6V22"/></>,
    zakat: <><circle cx="12" cy="12" r="9"/><path d="m8 16 8-8M8.5 8.5h.01M15.5 15.5h.01"/></>,
    prayer: <><path d="M4 21h16M8 21v-6.3a4 4 0 0 1 8 0V21"/><circle cx="12" cy="7" r="2.1"/><path d="M9.5 11.5h5"/></>,
    dictionary: <><path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z"/><path d="M20 4h-3a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h3Z"/></>,
    names: <><path d="m12 2 2.3 3.2 3.9-.4.4 3.9L22 11l-2 3.4.8 3.8-3.9.8-2.6 3-2.8-2.8-3.9.7-.7-3.9L3 13.6l2-3.4-.8-3.8 3.9-.8Z"/><text x="12" y="14" textAnchor="middle" stroke="none" fill="currentColor" fontSize="7">99</text></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    home: <><path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

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

const FEATURE_IDS = new Set(FEATURES.map((feature) => feature.id));

function readHash(): FeatureId {
  const value = window.location.hash.slice(1);
  return FEATURE_IDS.has(value as FeatureId) ? value as FeatureId : "quran";
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("quran");
  const [quranTarget, setQuranTarget] = useState<QuranTarget>({ surah: 1, ayah: null });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activate = useCallback((id: FeatureId, options?: { history?: boolean; focus?: boolean }) => {
    setActiveFeature(id);
    if (options?.history !== false && window.location.hash !== `#${id}`) window.history.pushState({ feature: id }, "", `#${id}`);
    window.requestAnimationFrame(() => {
      tabRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      if (options?.focus) document.getElementById(`workspace-${id}-heading`)?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const sync = () => setActiveFeature(readHash());
    sync();
    const onFeature = (event: Event) => {
      const detail = (event as CustomEvent<{ feature?: FeatureId; href?: string }>).detail;
      if (!detail?.feature || !FEATURE_IDS.has(detail.feature)) return;
      if (detail.feature === "quran" && detail.href) {
        const url = new URL(detail.href, window.location.origin);
        const surah = Number(url.searchParams.get("surah"));
        const ayah = Number(url.searchParams.get("ayah"));
        if (surah >= 1 && surah <= 114) setQuranTarget({ surah, ayah: ayah > 0 ? ayah : null });
      }
      activate(detail.feature, { focus: true });
    };
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    window.addEventListener("noor:activate-feature", onFeature);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("noor:activate-feature", onFeature);
    };
  }, [activate]);

  return (
    <main className="noor-tabbed-home">
      <header className="noor-shell-header">
        <Link className="reference-brand" href="#quran" onClick={(event) => { event.preventDefault(); activate("quran"); }} aria-label="NOOR Daily Muslim home">
          <span className="reference-logo" aria-hidden="true"><i /></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span>
        </Link>
        <nav className="noor-main-nav" aria-label="Main navigation">
          <button className="active" type="button" onClick={() => activate("quran")}>Home</button>
          <button type="button" onClick={() => activate("quran")}>Quran</button>
          <Link href="/namaz">Learn</Link><Link href="/matrimony">Community</Link><Link href="/shop">Shop</Link><Link href="/about">Premium</Link>
        </nav>
        <div className="noor-header-actions">
          <HeaderUtilities />
          <label className="noor-language"><span className="sr-only">Language</span><select defaultValue="en" aria-label="Language"><option value="en">EN</option><option value="ur">اردو</option><option value="hi">हिंदी</option></select></label>
          <Link className="noor-profile" href="/sign-in" aria-label="Your NOOR account"><NoorIcon name="profile" /></Link>
        </div>
      </header>

      <section className="noor-fixed-hero" aria-labelledby="noor-home-title">
        <span className="noor-pattern noor-pattern-left" aria-hidden="true"/><span className="noor-pattern noor-pattern-right" aria-hidden="true"/>
        <div className="noor-hero-inner">
          <span className="noor-hero-crescent" aria-hidden="true"><i/>✦</span>
          <p>YOUR DAILY MUSLIM COMPANION</p>
          <h1 id="noor-home-title">Faith, beautifully organised.</h1>
          <span>Your daily companion for Quran, prayer, knowledge and a better you.</span>
          <SearchLauncher className="noor-hero-search"><NoorIcon name="search"/><span>What would you like to explore?</span><kbd>⌘ K</kbd></SearchLauncher>
          <div className="noor-hero-actions">
            <button type="button" onClick={() => activate("quran")}><NoorIcon name="book"/>Read Quran</button>
            <button type="button" onClick={() => activate("prayer-times")}><NoorIcon name="clock"/>Prayer Times</button>
            <button type="button" onClick={() => activate("mosque-finder")}><NoorIcon name="pin"/>Find a Mosque</button>
          </div>
        </div>
      </section>

      <section className="noor-feature-shell" aria-label="NOOR daily features">
        <div className="noor-feature-tabs" role="tablist" aria-label="Choose a NOOR feature">
          {FEATURES.map((feature) => (
            <button
              ref={(node) => { tabRefs.current[feature.id] = node; }}
              className={activeFeature === feature.id ? "active" : ""}
              id={`tab-${feature.id}`}
              role="tab"
              aria-selected={activeFeature === feature.id}
              aria-controls={`panel-${feature.id}`}
              tabIndex={activeFeature === feature.id ? 0 : -1}
              type="button"
              onClick={() => activate(feature.id, { focus: true })}
              onKeyDown={(event) => {
                const current = FEATURES.findIndex((item) => item.id === feature.id);
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                const next = (current + (event.key === "ArrowRight" ? 1 : -1) + FEATURES.length) % FEATURES.length;
                activate(FEATURES[next].id);
                tabRefs.current[FEATURES[next].id]?.focus();
              }}
              key={feature.id}
            >
              <NoorIcon name={feature.icon}/><span>{feature.label}</span>
            </button>
          ))}
        </div>

        <HomeFeatureWorkspace activeFeature={activeFeature} quranTarget={quranTarget} />
        <div className="noor-prayer-summary"><PrayerTimesStrip /></div>
      </section>

      <SiteFooter />

      <nav className="noor-mobile-nav" aria-label="Mobile navigation">
        <button className={activeFeature === "quran" ? "active" : ""} type="button" onClick={() => activate("quran")}><NoorIcon name="home"/><span>Home</span></button>
        <button type="button" onClick={() => activate("quran")}><NoorIcon name="book"/><span>Quran</span></button>
        <button type="button" onClick={() => activate("prayer-times")}><NoorIcon name="prayer"/><span>Prayer</span></button>
        <button type="button" onClick={() => activate("qibla")}><NoorIcon name="compass"/><span>Qibla</span></button>
        <button type="button" onClick={() => document.querySelector<HTMLElement>(".noor-feature-tabs")?.scrollIntoView({ behavior: "smooth" })}><NoorIcon name="grid"/><span>More</span></button>
      </nav>
    </main>
  );
}
