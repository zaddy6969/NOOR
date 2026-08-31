"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import HeroDailyStatus from "./home/HeroDailyStatus";
import HomeFeatureWorkspace, { type FeatureId, type QuranTarget } from "./home/HomeFeatureWorkspace";
import HomePersonalRail from "./home/HomePersonalRail";
import SiteFooter from "./site/SiteFooter";
import { HeaderUtilities } from "./site/SiteUtilities";

type IconName = "book" | "clock" | "compass" | "calendar" | "mosque" | "dua" | "darood" | "zakat" | "prayer" | "dictionary" | "names" | "pin" | "home" | "grid" | "search" | "profile" | "music" | "family" | "shop" | "community" | "learn" | "info";
type NoorLocale = "en" | "hi" | "ur";

const HOME_COPY: Record<NoorLocale, {
  greeting: string;
  blessing: string;
  search: string;
  explore: string;
  more: string;
  viewAll: string;
  showLess: string;
}> = {
  en: { greeting: "Assalamu Alaikum", blessing: "May Allah bless your day", search: "Search everything…", explore: "EXPLORE NOOR", more: "More features", viewAll: "View all", showLess: "Show less" },
  hi: { greeting: "अस्सलामु अलैकुम", blessing: "अल्लाह आपके दिन में बरकत दे", search: "सब कुछ खोजें…", explore: "नूर देखें", more: "और सुविधाएँ", viewAll: "सभी देखें", showLess: "कम दिखाएँ" },
  ur: { greeting: "السلام علیکم", blessing: "اللہ آپ کے دن میں برکت دے", search: "سب کچھ تلاش کریں…", explore: "نور دریافت کریں", more: "مزید سہولیات", viewAll: "سب دیکھیں", showLess: "کم دکھائیں" },
};

const FEATURE_LABELS: Record<NoorLocale, Partial<Record<FeatureId, string>>> = {
  en: {},
  hi: { quran: "क़ुरआन", "prayer-times": "नमाज़ के समय", qibla: "क़िबला", "islamic-calendar": "इस्लामी कैलेंडर", "mosque-finder": "मस्जिद खोजें", "daily-duas": "रोज़ाना दुआएँ", darood: "दरूद शरीफ़", zakat: "ज़कात कैलकुलेटर", kaza: "क़ज़ा नमाज़", lughat: "फ़िरोज़ुल लुग़ात", names: "99 नाम", destinations: "मुस्लिम स्थल" },
  ur: { quran: "قرآن", "prayer-times": "نماز کے اوقات", qibla: "قبلہ", "islamic-calendar": "اسلامی کیلنڈر", "mosque-finder": "مسجد تلاش کریں", "daily-duas": "روزانہ دعائیں", darood: "درود شریف", zakat: "زکوٰۃ کیلکولیٹر", kaza: "قضا نماز", lughat: "فیروز اللغات", names: "99 نام", destinations: "مسلم مقامات" },
};

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
    music: <><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    family: <><circle cx="12" cy="5" r="2.4"/><circle cx="6" cy="15" r="2.4"/><circle cx="18" cy="15" r="2.4"/><path d="M12 7.5v3M6 12.5v-2h12v2"/></>,
    shop: <><path d="M4 9h16l-1 12H5Z"/><path d="m6 9 1-5h10l1 5M9 13v4m6-4v4"/></>,
    community: <><circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2.5 21a5.5 5.5 0 0 1 11 0M13 21a4.5 4.5 0 0 1 8.5-2"/></>,
    learn: <><path d="M3 5h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3Z"/><path d="M21 5h-5a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h5Z"/><path d="M6 9h4M6 12h4"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
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
  { id: "kaza", label: "Qaza Namaz", icon: "prayer" },
  { id: "lughat", label: "Firoz-ul-Lughat", icon: "dictionary" },
  { id: "names", label: "99 Names", icon: "names" },
  { id: "destinations", label: "Muslim Destinations", icon: "pin" },
];

const FEATURE_IDS = new Set(FEATURES.map((feature) => feature.id));
const HERO_FEATURE_IDS = new Set<FeatureId>(["quran", "prayer-times", "qibla", "islamic-calendar"]);
const FEATURE_STRIP = FEATURES.filter((feature) => !HERO_FEATURE_IDS.has(feature.id));

type MoreFeature = {
  label: string;
  description: string;
  href: string;
  art: string;
};

type MoreFeatureGroup = {
  label: string;
  icon: IconName;
  features: MoreFeature[];
};

const MORE_FEATURE_GROUPS: MoreFeatureGroup[] = [
  {
    label: "Spiritual Learning",
    icon: "book",
    features: [
      { label: "Naat & Salam", description: "Listen, watch and read beautiful naats", href: "/naat", art: "learning-r1-c1" },
      { label: "Prayer & Wudu", description: "A complete guide to salah and purification", href: "/namaz", art: "learning-r1-c2" },
      { label: "Five Pillars", description: "Learn the foundations of Muslim life", href: "/topics/pillars", art: "learning-r1-c3" },
      { label: "Ahle Sunnat", description: "Beliefs and guidance from authentic sources", href: "/topics/ahle-sunnat", art: "learning-r1-c4" },
    ],
  },
  {
    label: "Faith & Knowledge",
    icon: "learn",
    features: [
      { label: "Tawheed", description: "Understand the oneness of Allah", href: "/topics/tawheed", art: "learning-r2-c1" },
      { label: "Islamic History", description: "Read meaningful Waqiyahs—accounts from Islamic history", href: "/topics/waqiyahs", art: "learning-r2-c2" },
      { label: "Islamic Quotes", description: "Sourced reminders for everyday reflection", href: "/topics/quotes", art: "learning-r2-c3" },
      { label: "Scholars", description: "Discover trusted teachers and their work", href: "/topics/scholars", art: "learning-r2-c4" },
    ],
  },
  {
    label: "Community & Family",
    icon: "community",
    features: [
      { label: "Family Tree", description: "Explore your Islamic lineage and heritage", href: "/family-tree", art: "life-r1-c1" },
      { label: "Shop by Category", description: "Browse the thoughtfully curated NOOR shop", href: "/shop", art: "life-r1-c2" },
      { label: "Matrimony", description: "Find a compatible partner with privacy", href: "/matrimony", art: "life-r1-c3" },
      { label: "Institutes", description: "Find Islamic learning near you", href: "/topics/institutes", art: "life-r1-c4" },
    ],
  },
  {
    label: "Travel & Seasons",
    icon: "pin",
    features: [
      { label: "Religious Tourism", description: "Plan meaningful journeys to sacred places", href: "/religious-tourism", art: "life-r2-c1" },
      { label: "Ramadan & Roza", description: "Fasting guidance and seasonal resources", href: "/topics/roza", art: "life-r2-c2" },
      { label: "Hajj Guide", description: "Prepare for the rites, journey and etiquette", href: "/topics/hajj", art: "life-r2-c3" },
      { label: "Islamic Festivals", description: "Understand dates, meaning and practice", href: "/topics/festivals", art: "life-r2-c4" },
    ],
  },
  {
    label: "About & Support",
    icon: "info",
    features: [
      { label: "Jobs & Careers", description: "Build a fulfilling, faith-conscious career", href: "/topics/jobs", art: "support-r1-c1" },
      { label: "Islamic FAQs", description: "Clear answers to common questions", href: "/topics/faqs", art: "support-r1-c2" },
      { label: "Islamic Glossary", description: "Understand Arabic and Urdu terms", href: "/glossary", art: "support-r2-c1" },
      { label: "About NOOR", description: "Read about our purpose and standards", href: "/about", art: "support-r2-c2" },
    ],
  },
];

const MORE_GROUP_LABELS: Record<NoorLocale, Record<string, string>> = {
  en: {},
  hi: { "Spiritual Learning": "रूहानी शिक्षा", "Faith & Knowledge": "ईमान और ज्ञान", "Community & Family": "समाज और परिवार", "Travel & Seasons": "यात्रा और इस्लामी मौसम", "About & Support": "नूर और सहायता" },
  ur: { "Spiritual Learning": "روحانی تعلیم", "Faith & Knowledge": "ایمان اور علم", "Community & Family": "برادری اور خاندان", "Travel & Seasons": "سفر اور اسلامی موسم", "About & Support": "نور اور مدد" },
};

const MORE_FEATURE_LABELS: Record<NoorLocale, Record<string, [string, string]>> = {
  en: {},
  hi: {
    "/naat": ["नात और सलाम", "खूबसूरत नात सुनें, देखें और पढ़ें"], "/namaz": ["नमाज़ और वुज़ू", "पाकी और नमाज़ की पूरी मार्गदर्शिका"], "/topics/pillars": ["इस्लाम के पाँच स्तंभ", "मुस्लिम जीवन की बुनियाद समझें"], "/topics/ahle-sunnat": ["अहले सुन्नत", "प्रामाणिक स्रोतों से अक़ीदा और मार्गदर्शन"],
    "/topics/tawheed": ["तौहीद", "अल्लाह की एकता को समझें"], "/topics/waqiyahs": ["इस्लामी वाक़ियात", "इतिहास से अर्थपूर्ण घटनाएँ पढ़ें"], "/topics/quotes": ["इस्लामी कथन", "स्रोत सहित रोज़ाना याद-दिहानी"], "/topics/scholars": ["उलमा", "विश्वसनीय शिक्षकों और उनके कार्य को जानें"],
    "/family-tree": ["पारिवारिक वंश", "इस्लामी विरासत और नसब देखें"], "/shop": ["श्रेणी अनुसार सुझाव", "नूर की चुनी हुई सूची देखें"], "/matrimony": ["निकाह", "गोपनीयता के साथ सही रिश्ता खोजें"], "/topics/institutes": ["इस्लामी संस्थान", "अपने पास शिक्षा के केंद्र खोजें"],
    "/religious-tourism": ["धार्मिक यात्रा", "पवित्र स्थलों की सार्थक योजना बनाएँ"], "/topics/roza": ["रमज़ान और रोज़ा", "रोज़े की राहनुमाई और संसाधन"], "/topics/hajj": ["हज मार्गदर्शिका", "सफ़र, अरकान और आदाब की तैयारी"], "/topics/festivals": ["इस्लामी अवसर", "तारीख़, अर्थ और अमल समझें"],
    "/topics/jobs": ["रोज़गार और करियर", "दीन के अनुरूप करियर बनाएँ"], "/topics/faqs": ["इस्लामी सवाल", "आम सवालों के साफ़ जवाब"], "/glossary": ["इस्लामी शब्दकोश", "अरबी और उर्दू शब्द समझें"], "/about": ["नूर के बारे में", "हमारा उद्देश्य और मानक पढ़ें"],
  },
  ur: {
    "/naat": ["نعت و سلام", "خوبصورت نعتیں سنیں، دیکھیں اور پڑھیں"], "/namaz": ["نماز اور وضو", "پاکی اور نماز کی مکمل رہنمائی"], "/topics/pillars": ["اسلام کے پانچ ستون", "مسلمان زندگی کی بنیادیں سمجھیں"], "/topics/ahle-sunnat": ["اہل سنت", "معتبر ذرائع سے عقیدہ اور رہنمائی"],
    "/topics/tawheed": ["توحید", "اللہ کی وحدانیت کو سمجھیں"], "/topics/waqiyahs": ["اسلامی واقعات", "تاریخ کے بامعنی واقعات پڑھیں"], "/topics/quotes": ["اسلامی اقوال", "حوالے کے ساتھ روزانہ نصیحت"], "/topics/scholars": ["علماء", "معتبر اساتذہ اور ان کے کام کو جانیں"],
    "/family-tree": ["خاندانی شجرہ", "اسلامی نسب اور ورثہ دیکھیں"], "/shop": ["زمرہ وار تجاویز", "نور کی منتخب فہرست دیکھیں"], "/matrimony": ["رشتۂ نکاح", "رازداری کے ساتھ موزوں رشتہ تلاش کریں"], "/topics/institutes": ["اسلامی ادارے", "قریب کے تعلیمی مراکز تلاش کریں"],
    "/religious-tourism": ["مذہبی سفر", "مقدس مقامات کے سفر کی منصوبہ بندی"], "/topics/roza": ["رمضان اور روزہ", "روزے کی رہنمائی اور وسائل"], "/topics/hajj": ["حج رہنما", "ارکان، سفر اور آداب کی تیاری"], "/topics/festivals": ["اسلامی مواقع", "تاریخ، معنی اور عمل سمجھیں"],
    "/topics/jobs": ["روزگار اور کیریئر", "دین کے مطابق کیریئر بنائیں"], "/topics/faqs": ["اسلامی سوالات", "عام سوالات کے واضح جواب"], "/glossary": ["اسلامی لغت", "عربی اور اردو الفاظ سمجھیں"], "/about": ["نور کے بارے میں", "ہمارا مقصد اور معیار پڑھیں"],
  },
};

function readHash(): FeatureId {
  const value = window.location.hash.slice(1);
  return FEATURE_IDS.has(value as FeatureId) ? value as FeatureId : "quran";
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("quran");
  const [quranTarget, setQuranTarget] = useState<QuranTarget>({ surah: 1, ayah: null });
  const [showAllTools, setShowAllTools] = useState(false);
  const [locale, setLocale] = useState<NoorLocale>("en");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const copy = HOME_COPY[locale];

  const activate = useCallback((id: FeatureId, options?: { history?: boolean; focus?: boolean; reveal?: boolean }) => {
    setActiveFeature(id);
    try {
      const stored = JSON.parse(window.localStorage.getItem("noor-recent-features-v1") ?? "[]") as unknown;
      const previous = Array.isArray(stored) ? stored.filter((item): item is FeatureId => typeof item === "string" && FEATURE_IDS.has(item as FeatureId)) : [];
      const recent = [id, ...previous.filter((item) => item !== id)].slice(0, 6);
      window.localStorage.setItem("noor-recent-features-v1", JSON.stringify(recent));
      window.dispatchEvent(new CustomEvent("noor:recent-features"));
    } catch { /* personal shortcuts are optional */ }
    if (options?.history !== false && window.location.hash !== `#${id}`) window.history.pushState({ feature: id }, "", `#${id}`);
    window.requestAnimationFrame(() => {
      tabRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      window.requestAnimationFrame(() => {
        if (options?.reveal !== false) workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (options?.focus) document.getElementById(`workspace-${id}-heading`)?.focus({ preventScroll: true });
      });
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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("noor-language");
      if (saved === "en" || saved === "hi" || saved === "ur") setLocale(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("noor-language", locale);
    document.documentElement.lang = locale === "hi" ? "hi" : locale === "ur" ? "ur" : "en";
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
  }, [locale]);

  return (
    <main className="noor-tabbed-home" lang={locale === "hi" ? "hi" : locale === "ur" ? "ur" : "en"} dir={locale === "ur" ? "rtl" : "ltr"}>
      <header className="noor-shell-header">
        <Link className="reference-brand" href="#quran" onClick={(event) => { event.preventDefault(); activate("quran", { reveal: false }); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="NOOR Daily Muslim home">
          <span className="reference-logo" aria-hidden="true"><i /></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span>
        </Link>
        <div className="noor-header-actions">
          <HeaderUtilities />
          <label className="noor-language"><span className="sr-only">Interface language; Hindi and Urdu are in beta</span><select value={locale} onChange={(event) => setLocale(event.target.value as NoorLocale)} aria-label="Interface language; Hindi and Urdu are in beta"><option value="en">EN</option><option value="ur">اردو · Beta</option><option value="hi">हिंदी · Beta</option></select></label>
          <Link className="noor-profile" href="/sign-in" aria-label="Your NOOR account"><NoorIcon name="profile" /></Link>
        </div>
      </header>

      <section className="noor-fixed-hero" aria-labelledby="noor-home-title">
        <span className="noor-pattern noor-pattern-left" aria-hidden="true"/><span className="noor-pattern noor-pattern-right" aria-hidden="true"/>
        <div className="noor-hero-inner">
          <div className="noor-greeting-row"><div><span>NOOR DAILY MUSLIM</span><h1 id="noor-home-title">{copy.greeting}</h1><p>{copy.blessing}<i aria-hidden="true">✦</i></p></div></div>
          <HeroDailyStatus locale={locale} onPrayer={() => activate("prayer-times", { focus: true })} onCalendar={() => activate("islamic-calendar", { focus: true })} onQuran={(target) => { setQuranTarget(target); activate("quran", { focus: true }); }} onQibla={() => activate("qibla", { focus: true })} />
        </div>
      </section>

      <section className="noor-feature-shell" aria-label="NOOR daily features">
        <div className="noor-feature-tabs" role="tablist" aria-label="Choose a NOOR feature">
          {FEATURE_STRIP.map((feature, index) => (
            <button
              ref={(node) => { tabRefs.current[feature.id] = node; }}
              className={activeFeature === feature.id ? "active" : ""}
              id={`tab-${feature.id}`}
              role="tab"
              aria-selected={activeFeature === feature.id}
              aria-controls={`panel-${feature.id}`}
              tabIndex={activeFeature === feature.id || (HERO_FEATURE_IDS.has(activeFeature) && index === 0) ? 0 : -1}
              type="button"
              onClick={() => activate(feature.id, { focus: true })}
              onKeyDown={(event) => {
                const current = FEATURE_STRIP.findIndex((item) => item.id === feature.id);
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                const next = (current + (event.key === "ArrowRight" ? 1 : -1) + FEATURE_STRIP.length) % FEATURE_STRIP.length;
                activate(FEATURE_STRIP[next].id);
                tabRefs.current[FEATURE_STRIP[next].id]?.focus();
              }}
              key={feature.id}
            >
              <NoorIcon name={feature.icon}/><span>{FEATURE_LABELS[locale][feature.id] ?? feature.label}</span>
            </button>
          ))}
        </div>
        <HomePersonalRail locale={locale} activeFeature={activeFeature} onSelect={(feature) => activate(feature, { focus: true })} />

        <div className="noor-tool-anchor" id="selected-tool" ref={workspaceRef}>
          <HomeFeatureWorkspace activeFeature={activeFeature} quranTarget={quranTarget} locale={locale} />
        </div>

        <section className={`noor-more-features${showAllTools ? " expanded" : ""}`} aria-labelledby="more-features-title">
          <header>
            <div><span>{copy.explore}</span><h2 id="more-features-title">{copy.more}</h2></div>
            <button type="button" aria-expanded={showAllTools} onClick={() => setShowAllTools((value) => !value)}>
              {showAllTools ? copy.showLess : copy.viewAll}<span aria-hidden="true">{showAllTools ? "↑" : "→"}</span>
            </button>
          </header>
          <div className="noor-more-feature-groups">
            {MORE_FEATURE_GROUPS.slice(0, showAllTools ? MORE_FEATURE_GROUPS.length : 2).map((group) => (
              <section className="noor-more-feature-group" aria-labelledby={`more-group-${group.label.replaceAll(" ", "-").toLowerCase()}`} key={group.label}>
                <h3 id={`more-group-${group.label.replaceAll(" ", "-").toLowerCase()}`}>
                  <NoorIcon name={group.icon}/><span>{MORE_GROUP_LABELS[locale][group.label] ?? group.label}</span><i aria-hidden="true" />
                </h3>
                <div className="noor-more-feature-grid">
                  {group.features.map((feature) => {
                    const localized = MORE_FEATURE_LABELS[locale][feature.href];
                    return (
                    <Link className="noor-more-feature-card" href={feature.href} key={feature.href}>
                      <span className="noor-more-feature-copy">
                        <strong>{localized?.[0] ?? feature.label}</strong>
                        <small>{localized?.[1] ?? feature.description}</small>
                        <b aria-hidden="true">→</b>
                      </span>
                      <span className={`noor-more-feature-art ${feature.art}`} aria-hidden="true" />
                    </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </section>

      <SiteFooter locale={locale} />

      <nav className="noor-mobile-nav" aria-label="Mobile navigation">
        <button className={activeFeature === "quran" ? "active" : ""} type="button" onClick={() => { activate("quran", { reveal: false }); window.scrollTo({ top: 0, behavior: "smooth" }); }}><NoorIcon name="home"/><span>Home</span></button>
        <button type="button" onClick={() => activate("quran")}><NoorIcon name="book"/><span>Quran</span></button>
        <button type="button" onClick={() => activate("prayer-times")}><NoorIcon name="prayer"/><span>Prayer</span></button>
        <button type="button" onClick={() => activate("qibla")}><NoorIcon name="compass"/><span>Qibla</span></button>
        <button type="button" onClick={() => document.querySelector<HTMLElement>(".noor-feature-tabs")?.scrollIntoView({ behavior: "smooth" })}><NoorIcon name="grid"/><span>More</span></button>
      </nav>
    </main>
  );
}
