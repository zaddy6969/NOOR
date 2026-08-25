"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PrayerTimesStrip from "./home/PrayerTimesStrip";
import SiteFooter from "./site/SiteFooter";
import { HeaderUtilities } from "./site/SiteUtilities";

type Category = "All" | "Daily" | "Learn" | "Naat" | "Community";
type IconName = "book" | "calendar" | "compass" | "prayer" | "beads" | "audio" | "mosque" | "tree" | "gift" | "pen" | "mic" | "help" | "story" | "pillars" | "moon" | "coins" | "hajj" | "heart" | "school" | "work" | "scholar" | "video" | "pin" | "bag" | "map";

type Feature = {
  title: string;
  description: string;
  href: string;
  category: Exclude<Category, "All">;
  icon: IconName;
};

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 11h18"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/></>,
    prayer: <><path d="M5 21h14M7 21v-8a5 5 0 0 1 10 0v8"/><path d="M10 7a2 2 0 1 1 4 0"/></>,
    beads: <><circle cx="12" cy="6" r="1.8"/><circle cx="7.5" cy="9" r="1.8"/><circle cx="7" cy="14" r="1.8"/><circle cx="11" cy="18" r="1.8"/><circle cx="16" cy="15" r="1.8"/><circle cx="17" cy="10" r="1.8"/></>,
    audio: <><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    mosque: <><path d="M4 21V11h16v10M8 21v-5a4 4 0 0 1 8 0v5M7 11a5 5 0 0 1 10 0M12 3v3"/></>,
    tree: <><circle cx="12" cy="5" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M12 7v5M6 16v-4h12v4"/></>,
    gift: <><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8H7.5a2.5 2.5 0 1 1 2.1-3.9L12 8Zm0 0h4.5a2.5 2.5 0 1 0-2.1-3.9L12 8Z"/></>,
    pen: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m13.5 8 3 3"/></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.2c-1 .6-1.7 1.2-1.7 2.3M12 17h.01"/></>,
    story: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M8 17h11M9 8h6M9 12h5"/></>,
    pillars: <><path d="m3 8 9-5 9 5M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18"/></>,
    moon: <path d="M21 12.5A9 9 0 1 1 11.5 3 7 7 0 0 0 21 12.5Z"/>,
    coins: <><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/></>,
    hajj: <><path d="M5 21V7h14v14H5Z"/><path d="M5 11h14M9 7V4h6v3"/></>,
    heart: <path d="M20.8 4.8a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.2a5.4 5.4 0 1 0-7.7 7.7L12 21l8.8-8.5a5.4 5.4 0 0 0 0-7.7Z"/>,
    school: <><path d="m3 9 9-5 9 5M5 10v9m14-9v9M3 21h18M9 13h6v8"/></>,
    work: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18"/></>,
    scholar: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0M8 3l4-2 4 2"/></>,
    video: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3Z"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3V6Z"/><path d="M8 3v15m8-12v15"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const dailyTools: Feature[] = [
  { title: "Quran", description: "Read Arabic, English meaning and full-Surah audio", href: "/quran", category: "Daily", icon: "book" },
  { title: "Prayer & Wudu", description: "Complete Salah and purification guide", href: "/namaz", category: "Daily", icon: "prayer" },
  { title: "Qibla Compass", description: "Live direction to the Kaaba", href: "/qibla", category: "Daily", icon: "compass" },
  { title: "Islamic Calendar", description: "Hijri dates and important occasions", href: "/islamic-calendar", category: "Daily", icon: "calendar" },
  { title: "Darood Sharif", description: "Read, save and count trusted Salawat", href: "/darood", category: "Daily", icon: "beads" },
  { title: "Zakat Calculator", description: "Estimate Nisab and Zakat privately", href: "/zakat-calculator", category: "Daily", icon: "coins" },
  { title: "Qaza Namaz", description: "Calculate missed prayers and make a plan", href: "/qaza-namaz", category: "Daily", icon: "prayer" },
  { title: "Naat & Salam", description: "Separate audio, video and reading pages", href: "/naat", category: "Naat", icon: "audio" },
  { title: "Mosque Finder", description: "Find live nearby masjids by distance", href: "/mosque-finder", category: "Daily", icon: "pin" },
];

const features: Feature[] = [
  ...dailyTools,
  { title: "Ahle Sunnat wal Jamaat", description: "Belief, tradition and respectful learning", href: "/topics/ahle-sunnat", category: "Learn", icon: "mosque" },
  { title: "Family Tree", description: "Open an interactive lineage tree", href: "/family-tree", category: "Learn", icon: "tree" },
  { title: "Naat Lyrics", description: "Kalam library with writer and reciter credits", href: "/naat", category: "Naat", icon: "book" },
  { title: "Khanqah & Urs", description: "Centres, annual Urs and visitor information", href: "/topics/khanqah", category: "Community", icon: "mosque" },
  { title: "Donation Categories", description: "Food, education, medical and relief causes", href: "/topics/donation", category: "Community", icon: "gift" },
  { title: "Naat by Writer", description: "Browse poets and their complete works", href: "/topics/writers", category: "Naat", icon: "pen" },
  { title: "Naat by Reciter", description: "Browse Naat Khawans and recordings", href: "/topics/reciters", category: "Naat", icon: "mic" },
  { title: "Islamic FAQs", description: "Clear answers with references", href: "/topics/faqs", category: "Learn", icon: "help" },
  { title: "Famous Waqiyahs", description: "Sourced stories and practical lessons", href: "/topics/waqiyahs", category: "Learn", icon: "story" },
  { title: "Quranic Quotes", description: "Ayat with Arabic and English meaning", href: "/quran", category: "Learn", icon: "book" },
  { title: "Five Pillars", description: "Faith, Salah, Zakat, fasting and Hajj", href: "/topics/pillars", category: "Learn", icon: "pillars" },
  { title: "Tawheed", description: "Learn about the oneness of Allah", href: "/topics/tawheed", category: "Learn", icon: "mosque" },
  { title: "Roza", description: "Ramadan and voluntary fasting guidance", href: "/topics/roza", category: "Learn", icon: "moon" },
  { title: "Zakat Guide", description: "Nisab, assets and responsible giving", href: "/topics/zakat", category: "Learn", icon: "coins" },
  { title: "Hajj", description: "Rites, journey plan, duas and checklist", href: "/topics/hajj", category: "Learn", icon: "hajj" },
  { title: "Matrimony", description: "Private, family-aware introductions", href: "/matrimony", category: "Community", icon: "heart" },
  { title: "Institutes & Madrasas", description: "Find Islamic learning and admissions", href: "/topics/institutes", category: "Community", icon: "school" },
  { title: "Jobs & Career", description: "Ethical roles and career resources", href: "/topics/jobs", category: "Community", icon: "work" },
  { title: "Islamic Scholars", description: "Profiles, works and verified channels", href: "/topics/scholars", category: "Learn", icon: "scholar" },
  { title: "Islamic Channels", description: "Curated lectures, recitation and learning", href: "/topics/channels", category: "Community", icon: "video" },
  { title: "Firoz-ul-Lughat", description: "Urdu and Islamic words with clear meanings", href: "/firozul-lughat", category: "Learn", icon: "book" },
  { title: "Shop by Category", description: "Prayer, books, gifts and pilgrimage essentials", href: "/shop", category: "Community", icon: "bag" },
  { title: "Muslim Destinations", description: "Sacred, Sufi and Islamic heritage places", href: "/destinations", category: "Learn", icon: "map" },
  { title: "Religious Tourism", description: "Plan a respectful journey and private checklist", href: "/religious-tourism", category: "Community", icon: "hajj" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setToday(new Date()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return features.filter((feature) => {
      const matchesCategory = category === "All" || feature.category === category;
      const matchesTerm = !term || `${feature.title} ${feature.description}`.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [category, query]);

  const hijriDate = today
    ? new Intl.DateTimeFormat("en-IN-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(today)
    : "Islamic date";
  const gregorianDate = today
    ? new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "long" }).format(today)
    : "Today";

  return (
    <main className="noor-home-compact">
      <header className="compact-home-header">
        <Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link>
        <div className="home-header-right"><nav><Link href="/quran">Quran</Link><Link href="/naat">Naat</Link><Link href="/qibla">Qibla</Link><Link href="/islamic-calendar">Calendar</Link></nav><HeaderUtilities /></div>
      </header>

      <section className="compact-home-intro">
        <div><p>YOUR DAILY MUSLIM COMPANION</p><h1>Everything useful.<br/><em>Nothing confusing.</em></h1></div>
        <div className="compact-home-date"><strong>{hijriDate}</strong><span>{gregorianDate}</span></div>
      </section>

      <PrayerTimesStrip />

      <section className="daily-launcher" aria-labelledby="daily-tools-title">
        <div className="compact-section-title"><div><span>DAILY TOOLS</span><h2 id="daily-tools-title">Open what you need</h2></div></div>
        <div className="daily-launcher-grid">{dailyTools.map((tool) => <Link href={tool.href} key={tool.title}><span className="compact-feature-icon"><Icon name={tool.icon}/></span><div><strong>{tool.title}</strong><small>{tool.description}</small></div><b aria-hidden="true">›</b></Link>)}</div>
      </section>

      <section className="all-features-compact" aria-labelledby="all-features-title">
        <div className="compact-section-title"><div><span>ALL FEATURES</span><h2 id="all-features-title">Find a feature</h2></div><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search features" aria-label="Search all features" /></div>
        <div className="compact-category-tabs" role="group" aria-label="Feature categories">{(["All", "Daily", "Learn", "Naat", "Community"] as Category[]).map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        <div className="compact-feature-grid">{filtered.map((feature) => <Link href={feature.href} key={`${feature.title}-${feature.href}`}><span className="compact-feature-icon"><Icon name={feature.icon}/></span><div><strong>{feature.title}</strong><small>{feature.description}</small></div></Link>)}</div>
        {filtered.length === 0 ? <p className="compact-empty">No feature matched your search.</p> : null}
      </section>

      <SiteFooter />
    </main>
  );
}
