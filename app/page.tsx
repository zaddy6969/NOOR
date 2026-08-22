"use client";

import { useEffect, useMemo, useState } from "react";

type IconName =
  | "arrow" | "book" | "briefcase" | "calendar" | "check" | "chevron"
  | "compass" | "donate" | "family" | "heart" | "info" | "institution"
  | "lantern" | "menu" | "moon" | "mosque" | "pause" | "people" | "pin"
  | "play" | "prayer" | "quote" | "search" | "sparkle" | "sun" | "tasbih"
  | "user" | "video" | "x";

type Feature = {
  id: string;
  title: string;
  subtitle: string;
  category: "Faith" | "Naat" | "Knowledge" | "Community";
  icon: IconName;
  eyebrow: string;
  description: string;
  points: string[];
};

type Naat = {
  id: string;
  title: string;
  writer: string;
  reciter: string;
  category: string;
  languages: string[];
  summary: string;
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4 4-2Z"/></>,
    donate: <><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z"/><path d="M12 10v6M9 13h6"/></>,
    family: <><circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2"/><path d="M3 21a6 6 0 0 1 12 0M14 14a5 5 0 0 1 7 4.6"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    institution: <><path d="m3 9 9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></>,
    lantern: <><path d="M8 7h8l2 4-2 9H8l-2-9 2-4Z"/><path d="M9 7V4h6v3M9 12h6M12 12v5"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
    mosque: <><path d="M4 21V11h16v10M8 21v-5a4 4 0 0 1 8 0v5M7 11a5 5 0 0 1 10 0"/><path d="M12 3v3"/></>,
    pause: <><path d="M9 6v12M15 6v12"/></>,
    people: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20a6 6 0 0 1 12 0M14 15a5 5 0 0 1 7 4.5"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></>,
    play: <path d="m8 5 11 7-11 7Z"/>,
    prayer: <><path d="M5 21h14M7 21v-8a5 5 0 0 1 10 0v8"/><path d="M10 7a2 2 0 1 1 4 0"/></>,
    quote: <><path d="M9 11H5a4 4 0 0 0 4 4v3H5v-3a7 7 0 0 1 7-7M19 11h-4a4 4 0 0 0 4 4v3h-4v-3a7 7 0 0 1 7-7"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    sparkle: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    tasbih: <><circle cx="12" cy="7" r="2"/><circle cx="7.5" cy="10" r="2"/><circle cx="7" cy="15" r="2"/><circle cx="11" cy="18" r="2"/><circle cx="16" cy="16" r="2"/><circle cx="17" cy="11" r="2"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    video: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3Z"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const prayers = [
  { name: "Fajr", time: "4:54", period: "AM", minutes: 294 },
  { name: "Sunrise", time: "6:08", period: "AM", minutes: 368 },
  { name: "Dhuhr", time: "12:24", period: "PM", minutes: 744 },
  { name: "Asr", time: "3:46", period: "PM", minutes: 946 },
  { name: "Maghrib", time: "6:39", period: "PM", minutes: 1119 },
  { name: "Isha", time: "7:53", period: "PM", minutes: 1193 },
];

const features: Feature[] = [
  { id: "ahle-sunnat", title: "Ahle Sunnat wal Jamaat", subtitle: "Belief, tradition and respectful learning", category: "Faith", icon: "mosque", eyebrow: "FOUNDATION", description: "A clear introductory learning path covering core beliefs, love of the Prophet ﷺ, Sunnah and spiritual character.", points: ["Beginner-friendly chapters", "References for scholar review", "English, Urdu and Hindi ready"] },
  { id: "family-tree", title: "Family Tree", subtitle: "A respectful visual lineage guide", category: "Knowledge", icon: "family", eyebrow: "HISTORY", description: "Explore a simplified, text-only family tree with biographies and historical context. No illustrated depictions are used.", points: ["Expandable generations", "Short biographies", "Source notes and glossary"] },
  { id: "lyrics", title: "Naat Lyrics", subtitle: "Read, save and practise kalam", category: "Naat", icon: "book", eyebrow: "LIBRARY", description: "A clean lyrics reader inspired by the strongest parts of the reference sites, without the clutter.", points: ["Roman, Urdu and Hindi views", "Writer and reciter credits", "Save, share and reading mode"] },
  { id: "khanqah", title: "Khanqah & Urs", subtitle: "Centers, annual Urs and visitor guidance", category: "Community", icon: "lantern", eyebrow: "HERITAGE", description: "A directory for Khanqahs, Urs dates, etiquette, programmes and verified contact details.", points: ["Search by city", "Annual event calendar", "Verification status"] },
  { id: "donation", title: "Donation Box", subtitle: "Transparent causes by category", category: "Community", icon: "donate", eyebrow: "GIVING", description: "Browse clear donation categories for food, education, medical help, masjids and emergency relief.", points: ["Category-wise impact", "Receipt-ready flow", "Verified organization badge"] },
  { id: "writers", title: "Naat by Writer", subtitle: "Browse kalam by poet and author", category: "Naat", icon: "quote", eyebrow: "WRITERS", description: "Writer profiles connect every kalam to its author, language, collection and related works.", points: ["Alphabetical directory", "Featured collections", "Biography and works"] },
  { id: "reciters", title: "Naat by Reciter", subtitle: "Discover trusted Naat Khawans", category: "Naat", icon: "people", eyebrow: "RECITERS", description: "Reciter profiles group available recitations, languages and popular collections in one place.", points: ["Filter by language", "Audio-ready profiles", "Related kalam"] },
  { id: "waqiyahs", title: "Famous Waqiyahs", subtitle: "Meaningful stories with lessons", category: "Knowledge", icon: "sparkle", eyebrow: "STORIES", description: "Short, carefully sourced Islamic narratives presented with the lesson, context and reading time.", points: ["Five-minute reads", "Topic filters", "Source and review notes"] },
  { id: "festivals", title: "Islamic Festivals", subtitle: "Dates, meaning and preparation", category: "Knowledge", icon: "calendar", eyebrow: "CALENDAR", description: "A simple calendar for Ramadan, Eid, Milad, Muharram and other important occasions.", points: ["Hijri date view", "Preparation checklists", "Local event links"] },
  { id: "qibla", title: "Qibla Compass", subtitle: "Find the Kaaba direction from your location", category: "Faith", icon: "compass", eyebrow: "DIRECTION", description: "A privacy-first Qibla tool that calculates the direction to the Kaaba and follows the live compass on supported phones.", points: ["Location-based bearing", "Live phone compass", "Private on-device calculation"] },
  { id: "quotes", title: "Quranic Quotes", subtitle: "Ayat for reflection and sharing", category: "Knowledge", icon: "quote", eyebrow: "QURAN", description: "A searchable collection of short Quranic reminders organized by hope, patience, gratitude and prayer.", points: ["Arabic and translation", "Surah and ayah reference", "Save to favourites"] },
  { id: "pillars", title: "Five Pillars of Islam", subtitle: "A guided essentials course", category: "Faith", icon: "institution", eyebrow: "ESSENTIALS", description: "Understand Shahadah, Salah, Zakat, Sawm and Hajj through short, connected lessons.", points: ["Step-by-step learning", "Progress markers", "FAQs in every lesson"] },
  { id: "tawheed", title: "Tawheed", subtitle: "The oneness of Allah", category: "Faith", icon: "sun", eyebrow: "BELIEF", description: "A carefully written introduction to Tawheed, worship, intention and reliance upon Allah.", points: ["Plain-language lessons", "Key terminology", "Scholar-reviewed references"] },
  { id: "namaz", title: "Namaz", subtitle: "Complete Wudu and prayer guide", category: "Faith", icon: "prayer", eyebrow: "SALAH", description: "Learn purification, every prayer step, timings, Rak‘ahs, recitations, congregation and special circumstances in a complete Hanafi learning hub.", points: ["Full Wudu and Ghusl guide", "Complete Salah sequence", "Arabic recitations and sources"] },
  { id: "roza", title: "Roza", subtitle: "Fasting guidance throughout the year", category: "Faith", icon: "moon", eyebrow: "FASTING", description: "Practical guidance for Ramadan and voluntary fasts, with sehri, iftar and missed-fast information.", points: ["Fasting checklist", "Ramadan mode", "Health and travel notes"] },
  { id: "zakat", title: "Zakat", subtitle: "Learn, calculate and give responsibly", category: "Faith", icon: "donate", eyebrow: "CHARITY", description: "A guided Zakat section with asset categories, a simple calculator concept and trusted distribution guidance.", points: ["Nisab explainer", "Asset checklist", "Private calculation"] },
  { id: "hajj", title: "Hajj", subtitle: "A calm journey planner", category: "Faith", icon: "compass", eyebrow: "PILGRIMAGE", description: "Prepare for Hajj with the sequence of rites, packing lists, duas and a day-by-day journey view.", points: ["Ritual timeline", "Packing checklist", "Dua collection"] },
  { id: "matrimony", title: "Matrimony", subtitle: "Privacy-first, family-aware introductions", category: "Community", icon: "heart", eyebrow: "FAMILY", description: "A moderated Islamic matrimony concept focused on privacy, guardianship preferences and serious intentions.", points: ["Private profiles", "Family involvement options", "Report and moderation tools"] },
  { id: "durood", title: "Durood Sharif", subtitle: "Read, learn and build a daily habit", category: "Faith", icon: "tasbih", eyebrow: "REMEMBRANCE", description: "A dedicated collection with Arabic, transliteration, translation, benefits and a gentle recitation counter.", points: ["Multiple Durood collections", "Audio-ready pronunciation", "Daily goal tracker"] },
  { id: "institutes", title: "Institutes & Madrasas", subtitle: "Find trusted learning near you", category: "Community", icon: "institution", eyebrow: "DIRECTORY", description: "A searchable directory for Islamic institutes, madrasas, courses and admission information.", points: ["City and course filters", "Contact and admission details", "Verified listings"] },
  { id: "jobs", title: "Jobs & Career", subtitle: "Ethical opportunities and guidance", category: "Community", icon: "briefcase", eyebrow: "OPPORTUNITIES", description: "A focused jobs board for Islamic institutions, halal businesses, teaching, charity and community roles.", points: ["Role and location filters", "Career resources", "Organization profiles"] },
  { id: "scholars", title: "Islamic Scholars", subtitle: "Profiles, works and learning channels", category: "Knowledge", icon: "user", eyebrow: "SCHOLARS", description: "Discover scholar profiles with fields of study, institutions, books, lectures and verified channels.", points: ["Topic-based discovery", "Works and lectures", "Verification notes"] },
  { id: "channels", title: "Islamic Channels", subtitle: "Useful content without the noise", category: "Knowledge", icon: "video", eyebrow: "MEDIA", description: "A curated directory of educational channels, recitation streams, lectures and children’s learning.", points: ["Language filters", "Content labels", "Safe external links"] },
  { id: "faqs", title: "Islamic FAQs", subtitle: "Simple answers with visible references", category: "Knowledge", icon: "info", eyebrow: "QUESTIONS", description: "Frequently asked questions arranged by worship, family, daily life and Islamic calendar.", points: ["Quick search", "Reference panel", "Ask a scholar handoff"] },
];

const naats: Naat[] = [
  { id: "lam-yati", title: "Lam Yati Nazeero Kafi Nazarin", writer: "Imam Ahmed Raza Khan", reciter: "Owais Raza Qadri", category: "Naat", languages: ["Roman", "Urdu", "Hindi"], summary: "A celebrated multilingual kalam presented with writer credit, reciter links and an uncluttered reading view." },
  { id: "mustafa-jaane", title: "Mustafa Jaan-e-Rehmat Pe Lakhon Salam", writer: "Imam Ahmed Raza Khan", reciter: "Muhammad Owais Raza Qadri", category: "Salam", languages: ["Roman", "Urdu", "Hindi"], summary: "A structured Salam reader with verses, language tabs, favourites and related collections." },
  { id: "balaghal-ula", title: "Balaghal Ula Bi Kamalihi", writer: "Traditional collection", reciter: "Qari Shahid Mahmood", category: "Naat", languages: ["Roman", "Urdu", "English"], summary: "A concise reader prepared for recitation practice and translation notes." },
  { id: "ya-nabi-salam", title: "Ya Nabi Salam Alaika", writer: "Traditional collection", reciter: "Multiple reciters", category: "Salam", languages: ["Roman", "Urdu", "Hindi"], summary: "A multilingual Salam entry with reciter discovery and related reading." },
  { id: "bhar-do-jholi", title: "Bhar Do Jholi Meri", writer: "Traditional collection", reciter: "Featured reciters", category: "Qawwali", languages: ["Roman", "Urdu", "Hindi"], summary: "A searchable entry connected to writers, reciters, language options and saved lists." },
  { id: "sab-se-aula", title: "Sab Se Aula O Aala Hamara Nabi", writer: "Imam Ahmed Raza Khan", reciter: "Featured reciters", category: "Naat", languages: ["Roman", "Urdu", "Hindi"], summary: "A clean practice page for readers and Naat Khawans." },
];

const pillars = [
  { n: "01", title: "Shahadah", text: "Faith and testimony" },
  { n: "02", title: "Salah", text: "Five daily prayers" },
  { n: "03", title: "Zakat", text: "Purifying wealth" },
  { n: "04", title: "Sawm", text: "Fasting in Ramadan" },
  { n: "05", title: "Hajj", text: "Pilgrimage to Makkah" },
];

const faqItems = [
  { q: "How will religious content be verified?", a: "Every belief, worship and history article is designed to display its source notes and review status. Sensitive rulings should be reviewed by qualified Ahle Sunnat scholars before publication." },
  { q: "Can I browse Naats by writer or reciter?", a: "Yes. The Naat library supports title search, language filters, writer collections and reciter profiles from the same calm interface." },
  { q: "Will donations be processed on this website?", a: "The interface is ready for category-based giving, but real payments must remain disabled until a verified organization and secure payment partner are connected." },
  { q: "How is privacy handled for matrimony?", a: "The planned flow minimizes public information, supports family or guardian involvement, and requires moderation before profiles can be visible." },
];

function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [naatFilter, setNaatFilter] = useState("All");
  const [dhikr, setDhikr] = useState(18);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const hydrateTimer = window.setTimeout(() => {
      setNow(new Date());
      const storedTheme = window.localStorage.getItem("noor-theme");
      const storedSaved = window.localStorage.getItem("noor-saved-naats");
      const storedDhikr = window.localStorage.getItem("noor-dhikr");
      if (storedTheme === "dark") setDark(true);
      if (storedSaved) setSaved(JSON.parse(storedSaved));
      if (storedDhikr) setDhikr(Number(storedDhikr));
    }, 0);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => { window.clearTimeout(hydrateTimer); window.clearInterval(timer); };
  }, []);

  useEffect(() => { window.localStorage.setItem("noor-theme", dark ? "dark" : "light"); }, [dark]);
  useEffect(() => { window.localStorage.setItem("noor-saved-naats", JSON.stringify(saved)); }, [saved]);
  useEffect(() => { window.localStorage.setItem("noor-dhikr", String(dhikr)); }, [dhikr]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const prayerState = useMemo(() => {
    if (!now) return { next: prayers[4], seconds: 0 };
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(now);
    const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
    const currentSeconds = value("hour") * 3600 + value("minute") * 60 + value("second");
    const next = prayers.find((prayer) => prayer.minutes * 60 > currentSeconds) ?? prayers[0];
    const target = next.minutes * 60 + (next === prayers[0] && currentSeconds > prayers[5].minutes * 60 ? 86400 : 0);
    return { next, seconds: target - currentSeconds };
  }, [now]);

  const hijriDate = now ? new Intl.DateTimeFormat("en-IN-u-ca-islamic-umalqura", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" }).format(now) : "Islamic date";
  const gregorianDate = now ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now) : "Today";

  const filteredFeatures = useMemo(() => {
    const term = query.trim().toLowerCase();
    return features.filter((feature) => (category === "All" || feature.category === category) && (!term || `${feature.title} ${feature.subtitle} ${feature.category}`.toLowerCase().includes(term)));
  }, [category, query]);

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [...features.slice(0, 5), ...naats.slice(0, 3)];
    return [...features, ...naats].filter((item) => JSON.stringify(item).toLowerCase().includes(term)).slice(0, 10);
  }, [query]);

  const filteredNaats = useMemo(() => {
    if (naatFilter === "All") return naats;
    return naats.filter((naat) => naat.category === naatFilter || naat.languages.includes(naatFilter) || naat.writer.includes(naatFilter));
  }, [naatFilter]);

  const openFeature = (feature: Feature) => {
    const dedicatedRoutes: Record<string, string> = {
      namaz: "/namaz",
      "family-tree": "/family-tree",
      quotes: "/quran",
      matrimony: "/matrimony",
      festivals: "/islamic-calendar",
      qibla: "/qibla",
    };
    if (dedicatedRoutes[feature.id]) {
      window.location.assign(dedicatedRoutes[feature.id]);
      return;
    }
    window.location.assign(`/topics/${feature.id}`);
  };

  const openNaat = (naat: Naat) => window.location.assign(`/naat/${naat.id}`);

  const openItem = (item: Feature | Naat) => {
    if ("subtitle" in item) openFeature(item);
    else openNaat(item);
    setSearchOpen(false);
  };

  const toggleSaved = (id: string) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setToast(saved.includes(id) ? "Removed from saved" : "Saved to your NOOR library");
  };

  return (
    <main className={dark ? "site dark" : "site"} id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="NOOR home"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
          <a href="#daily" onClick={() => setMenuOpen(false)}>Daily</a>
          <a href="#naat-library" onClick={() => setMenuOpen(false)}>Naat Library</a>
          <a href="#faith" onClick={() => setMenuOpen(false)}>Faith</a>
          <a href="#community" onClick={() => setMenuOpen(false)}>Community</a>
        </nav>
        <div className="header-actions">
          <button className="header-search" type="button" onClick={() => setSearchOpen(true)}><Icon name="search" size={17}/><span>Search NOOR</span><kbd>⌘ K</kbd></button>
          <button className="round-button" type="button" onClick={() => setDark(!dark)} aria-label="Toggle theme"><Icon name={dark ? "sun" : "moon"}/></button>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Icon name={menuOpen ? "x" : "menu"}/></button>
        </div>
      </header>

      <section className="hero-shell" id="daily">
        <div className="hero-copy">
          <p className="eyebrow"><span/> ONE PEACEFUL PLACE FOR DAILY FAITH</p>
          <h1>Learn. Remember.<br/><em>Stay connected.</em></h1>
          <p className="hero-intro">Prayer, Quran, Naat, Islamic learning and trusted community resources—organized simply for everyday use.</p>
          <button className="main-search" type="button" onClick={() => setSearchOpen(true)}><Icon name="search"/><span>Search Naats, duas, scholars, institutes…</span><kbd>⌘ K</kbd></button>
          <div className="date-row"><span>{hijriDate}</span><i/><span>{gregorianDate}</span></div>
        </div>

        <article className="prayer-card">
          <div className="prayer-pattern">۞</div>
          <div className="prayer-top"><span><Icon name="moon" size={15}/> NEXT PRAYER</span><span><Icon name="pin" size={14}/> Bengaluru</span></div>
          <div className="prayer-main"><div><h2>{prayerState.next.name}</h2><p>Local demonstration schedule</p></div><div className="big-time"><strong>{prayerState.next.time}</strong><small>{prayerState.next.period}</small></div></div>
          <div className="countdown"><span>BEGINS IN</span><strong>{formatCountdown(Math.max(0, prayerState.seconds))}</strong></div>
          <div className="prayer-list">{prayers.filter((prayer) => prayer.name !== "Sunrise").map((prayer) => <div className={prayer.name === prayerState.next.name ? "active" : ""} key={prayer.name}><span>{prayer.name}</span><strong>{prayer.time}</strong></div>)}</div>
        </article>
      </section>

      <section className="quick-tools" aria-label="Daily tools">
        <button onClick={() => openFeature(features.find((feature) => feature.id === "namaz")!)}><span><Icon name="prayer"/></span><div><strong>Prayer & Wudu</strong><small>Complete Hanafi learning guide</small></div><Icon name="chevron" size={16}/></button>
        <button onClick={() => openFeature(features.find((feature) => feature.id === "quotes")!)}><span><Icon name="book"/></span><div><strong>Quran</strong><small>Read, reflect and save</small></div><Icon name="chevron" size={16}/></button>
        <button onClick={() => openFeature(features.find((feature) => feature.id === "durood")!)}><span><Icon name="tasbih"/></span><div><strong>Dhikr & Durood</strong><small>{dhikr} recitations today</small></div><Icon name="chevron" size={16}/></button>
        <button onClick={() => openFeature(features.find((feature) => feature.id === "festivals")!)}><span><Icon name="calendar"/></span><div><strong>Islamic Calendar</strong><small>Events and reminders</small></div><Icon name="chevron" size={16}/></button>
        <button onClick={() => openFeature(features.find((feature) => feature.id === "qibla")!)}><span><Icon name="compass"/></span><div><strong>Qibla Compass</strong><small>Live direction from your location</small></div><Icon name="chevron" size={16}/></button>
      </section>

      <section className="content-section naat-section" id="naat-library">
        <div className="section-heading"><div><p className="eyebrow">NAAT & KALAM LIBRARY</p><h2>Words of love, made easier to find.</h2><p>Browse by title, writer, reciter or language. Each entry opens in a focused reading view.</p></div><button className="text-button" onClick={() => setSearchOpen(true)}>Search full library <Icon name="arrow" size={17}/></button></div>
        <div className="filter-row" role="group" aria-label="Filter Naat library">{["All", "Naat", "Salam", "Roman", "Urdu", "Hindi", "Imam Ahmed Raza Khan"].map((item) => <button className={naatFilter === item ? "active" : ""} type="button" onClick={() => setNaatFilter(item)} key={item}>{item}</button>)}</div>
        <div className="naat-layout">
          <div className="naat-list">
            {filteredNaats.map((naat, index) => (
              <article className="naat-row" key={naat.id}>
                <button className="naat-index" type="button" onClick={() => openNaat(naat)}>{String(index + 1).padStart(2, "0")}</button>
                <button className="naat-info" type="button" onClick={() => openNaat(naat)}><span>{naat.category}</span><h3>{naat.title}</h3><p>Writer: {naat.writer} <i/> Reciter: {naat.reciter}</p></button>
                <div className="language-tags">{naat.languages.map((language) => <span key={language}>{language}</span>)}</div>
                <button className={saved.includes(naat.id) ? "save-button saved" : "save-button"} type="button" onClick={() => toggleSaved(naat.id)} aria-label={saved.includes(naat.id) ? "Remove saved Naat" : "Save Naat"}><Icon name="heart" size={17}/></button>
                <button className="row-arrow" type="button" onClick={() => openNaat(naat)} aria-label={`Read ${naat.title}`}><Icon name="arrow" size={17}/></button>
              </article>
            ))}
          </div>
          <aside className="library-aside">
            <p className="eyebrow">BROWSE COLLECTIONS</p>
            <button onClick={() => openFeature(features.find((feature) => feature.id === "writers")!)}><span className="aside-icon"><Icon name="quote"/></span><div><strong>By writer</strong><small>Poets and complete works</small></div><b>42</b></button>
            <button onClick={() => openFeature(features.find((feature) => feature.id === "reciters")!)}><span className="aside-icon"><Icon name="people"/></span><div><strong>By reciter</strong><small>Naat Khawan profiles</small></div><b>68</b></button>
            <button onClick={() => openFeature(features.find((feature) => feature.id === "lyrics")!)}><span className="aside-icon"><Icon name="book"/></span><div><strong>By language</strong><small>Roman, Urdu, Hindi</small></div><b>03</b></button>
            <div className="aside-note"><Icon name="info" size={17}/><p>Lyrics should be published only after rights and source checks. This build demonstrates the complete reader experience without copying full songs.</p></div>
          </aside>
        </div>
      </section>

      <section className="belief-band" id="faith">
        <div className="belief-copy"><p className="eyebrow">FAITH, PRACTICE & CHARACTER</p><h2>A clear path through the essentials of Islam.</h2><p>Short lessons, visible references and a calm progression—made for learners at every stage.</p><button className="light-button" onClick={() => openFeature(features.find((feature) => feature.id === "ahle-sunnat")!)}>Begin with Ahle Sunnat <Icon name="arrow" size={17}/></button></div>
        <div className="pillars-panel"><div className="pillar-heading"><span>THE FIVE PILLARS</span><small>Tap any pillar to explore</small></div>{pillars.map((pillar) => <button type="button" key={pillar.title} onClick={() => openFeature(features.find((feature) => feature.id === ({Shahadah:"tawheed", Salah:"namaz", Zakat:"zakat", Sawm:"roza", Hajj:"hajj"} as Record<string,string>)[pillar.title])!)}><span>{pillar.n}</span><div><strong>{pillar.title}</strong><small>{pillar.text}</small></div><Icon name="chevron" size={16}/></button>)}</div>
      </section>

      <section className="content-section explore-section">
        <div className="section-heading"><div><p className="eyebrow">EXPLORE NOOR</p><h2>Everything, without the clutter.</h2><p>Choose an area, then open only the detail you need.</p></div></div>
        <div className="category-tabs" role="group" aria-label="Feature categories">{["All", "Faith", "Naat", "Knowledge", "Community"].map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}<span>{item === "All" ? features.length : features.filter((feature) => feature.category === item).length}</span></button>)}</div>
        <div className="feature-grid">{filteredFeatures.map((feature) => <button className="feature-card" type="button" onClick={() => openFeature(feature)} key={feature.id}><span className="feature-icon"><Icon name={feature.icon}/></span><span className="feature-category">{feature.eyebrow}</span><h3>{feature.title}</h3><p>{feature.subtitle}</p><span className="feature-link">{["namaz", "family-tree", "quotes", "matrimony", "festivals", "qibla"].includes(feature.id) ? "Open full experience" : "Open full guide"} <Icon name="arrow" size={15}/></span></button>)}</div>
      </section>

      <section className="content-section family-section">
        <div className="section-heading"><div><p className="eyebrow">FAMILY & SACRED HISTORY</p><h2>A respectful family-tree experience.</h2><p>Text-only, easy to follow and designed for sourced biographies.</p></div><button className="text-button" onClick={() => openFeature(features.find((feature) => feature.id === "family-tree")!)}>Open full tree <Icon name="arrow" size={17}/></button></div>
        <div className="family-tree" role="img" aria-label="Simplified family tree of Prophet Muhammad, peace be upon him">
          <div className="tree-node parents"><span>PARENTS</span><strong>Hazrat Abdullah & Sayyidah Amina</strong></div><i className="tree-line vertical one"/>
          <div className="tree-node prophet"><span>THE BELOVED PROPHET ﷺ</span><strong>Prophet Muhammad ﷺ</strong></div><i className="tree-line vertical two"/><i className="tree-line horizontal"/>
          <div className="tree-node daughter"><span>BELOVED DAUGHTER</span><strong>Sayyidah Fatimah al-Zahra</strong><small>Married to Hazrat Ali</small></div>
          <div className="tree-children"><div className="tree-node"><span>GRANDSON</span><strong>Imam Hasan</strong></div><div className="tree-node"><span>GRANDSON</span><strong>Imam Husayn</strong></div></div>
        </div>
      </section>

      <section className="community-section" id="community">
        <div className="community-head"><p className="eyebrow">COMMUNITY SERVICES</p><h2>Useful connections, handled with care.</h2><p>Directories and services are clearly separated from learning content, with verification and privacy notes where they matter.</p></div>
        <div className="service-grid">
          {["donation", "matrimony", "jobs", "institutes"].map((id) => { const feature = features.find((item) => item.id === id)!; return <button className={`service-card ${id}`} type="button" key={id} onClick={() => openFeature(feature)}><div className="service-top"><span><Icon name={feature.icon}/></span><Icon name="arrow" size={18}/></div><p>{feature.eyebrow}</p><h3>{feature.title}</h3><span>{feature.subtitle}</span>{id === "donation" && <div className="donation-tags"><small>Food</small><small>Education</small><small>Medical</small></div>}{id === "jobs" && <div className="job-preview"><small>12 roles</small><small>5 cities</small></div>}</button>; })}
        </div>
      </section>

      <section className="content-section quote-section">
        <article className="quran-quote"><div className="quote-ornament">۞</div><p className="eyebrow">QURANIC REMINDER</p><blockquote lang="ar" dir="rtl">إِنَّ مَعَ الْعُسْرِ يُسْرًا</blockquote><h2>Indeed, with hardship comes ease.</h2><span>Surah Ash-Sharh · 94:6</span><button type="button" onClick={() => openFeature(features.find((feature) => feature.id === "quotes")!)}>Explore Quranic quotes <Icon name="arrow" size={16}/></button></article>
        <div className="dhikr-panel"><p className="eyebrow">TODAY’S DHIKR</p><h3>SubhanAllah</h3><p>Glory be to Allah</p><button className="counter" type="button" onClick={() => setDhikr((value) => value + 1)} aria-label="Add one dhikr"><span className="counter-ring" style={{ "--progress": `${Math.min((dhikr / 33) * 360, 360)}deg` } as React.CSSProperties}><strong>{dhikr}</strong><small>OF 33</small></span></button><div><button type="button" onClick={() => setDhikr(0)}>Reset</button><span>Tap to count</span></div></div>
      </section>

      <section className="content-section faq-section">
        <div className="section-heading"><div><p className="eyebrow">COMMON QUESTIONS</p><h2>Clear answers. Visible responsibility.</h2></div><button className="text-button" onClick={() => openFeature(features.find((feature) => feature.id === "faqs")!)}>Browse all FAQs <Icon name="arrow" size={17}/></button></div>
        <div className="faq-list">{faqItems.map((item, index) => <article className={openFaq === index ? "open" : ""} key={item.q}><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{String(index + 1).padStart(2,"0")}</span><strong>{item.q}</strong><i>{openFaq === index ? "−" : "+"}</i></button>{openFaq === index && <p>{item.a}</p>}</article>)}</div>
      </section>

      <section className="scholar-note"><Icon name="info"/><div><strong>Trust before publishing</strong><p>Religious rulings, historical claims, institute listings, matrimonial profiles and donation partners should be reviewed and verified before public launch.</p></div></section>

      <footer>
        <div className="footer-main"><div><a className="brand footer-brand" href="#top"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></a><p>A calmer way to learn, remember and stay connected.</p></div><div><strong>Learn</strong><a href="#faith">Faith</a><a href="#faith">Five Pillars</a><a href="/quran">Quran</a><a href="#community">Scholars</a></div><div><strong>Library</strong><a href="#naat-library">Naat Lyrics</a><a href="#naat-library">Writers</a><a href="#naat-library">Reciters</a><a href="#community">Waqiyahs</a></div><div><strong>Community</strong><a href="#community">Institutes</a><a href="#community">Jobs</a><a href="/matrimony">Matrimony</a><a href="#community">Donations</a></div></div>
        <div className="footer-bottom"><span>© 2026 NOOR. Made with care for the Ummah.</span><span>Educational platform · Scholar review required</span></div>
      </footer>

      {searchOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="Search NOOR"><button className="overlay-close" type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="x"/></button><div className="search-dialog"><div className="search-input"><Icon name="search"/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Naats, writers, scholars, pillars…"/><kbd>ESC</kbd></div><p className="search-label">{query ? `${searchResults.length} RESULTS` : "POPULAR IN NOOR"}</p><div className="search-results">{searchResults.map((item) => <button type="button" onClick={() => openItem(item)} key={item.id}><span><Icon name={"subtitle" in item ? item.icon : "book"}/></span><div><strong>{item.title}</strong><small>{"subtitle" in item ? `${item.category} · ${item.subtitle}` : `${item.category} · ${item.writer}`}</small></div><Icon name="chevron" size={16}/></button>)}</div></div></div>}

      {toast && <div className="toast"><Icon name="check" size={16}/>{toast}</div>}
    </main>
  );
}
