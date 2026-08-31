"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { destinations } from "../destinations/destination-data";
import { lughatEntries } from "../firozul-lughat/lughat-data";
import { useMediaPlayer } from "../media/MediaProvider";
import QiblaCompass from "../qibla/QiblaCompass";
import { readSavedList, SAVED_KEYS, writeSavedList } from "../site/saved-items";
import { writeNoorLocation } from "../site/location-settings";
import PrayerTimesStrip from "./PrayerTimesStrip";

export type FeatureId = "quran" | "prayer-times" | "qibla" | "islamic-calendar" | "mosque-finder" | "daily-duas" | "darood" | "zakat" | "kaza" | "lughat" | "names" | "destinations";
export type QuranTarget = { surah: number; ayah: number | null };
export type NoorLocale = "en" | "hi" | "ur";

const LocaleContext = createContext<NoorLocale>("en");
const WORKSPACE_COPY: Record<NoorLocale, Partial<Record<FeatureId, { title: string; description: string }>>> = {
  en: {},
  hi: {
    quran: { title: "क़ुरआन रीडर", description: "अरबी आयतें, अर्थ और पूरी सूरह की तिलावत।" },
    "prayer-times": { title: "आज की नमाज़ के समय", description: "स्थानीय समय, हिजरी तारीख़ और अगली नमाज़ की उलटी गिनती।" },
    qibla: { title: "क़िबला कम्पास", description: "आपकी लोकेशन से काबा की सही दिशा।" },
    "islamic-calendar": { title: "इस्लामी कैलेंडर", description: "ग्रेगोरियन और हिजरी तारीख़ें एक साथ।" },
    "mosque-finder": { title: "मस्जिद खोजें", description: "अपने पास की मस्जिदें नूर के अंदर देखें।" },
    "daily-duas": { title: "रोज़ाना दुआएँ", description: "दिन के हर अवसर के लिए प्रमाणित दुआएँ।" },
    darood: { title: "दरूद शरीफ़", description: "प्रमाणित और स्पष्ट रूप से चिन्हित सलवात।" },
    zakat: { title: "ज़कात कैलकुलेटर", description: "योग्य संपत्ति पर निजी 2.5% अनुमान।" },
    kaza: { title: "क़ज़ा नमाज़ योजना", description: "छूटी नमाज़ों का अनुमान और पूरा करने की योजना।" },
    lughat: { title: "फ़िरोज़-उल-लुग़ात", description: "अरबी, उर्दू, रोमन और अंग्रेज़ी इस्लामी शब्दावली।" },
    names: { title: "अल्लाह के 99 नाम", description: "अरबी नाम, उच्चारण और अर्थ।" },
    destinations: { title: "मुस्लिम धार्मिक स्थल", description: "पवित्र शहर और इस्लामी विरासत की जानकारी।" },
  },
  ur: {
    quran: { title: "قرآن ریڈر", description: "عربی آیات، ترجمہ اور مکمل سورت کی تلاوت۔" },
    "prayer-times": { title: "آج کی نماز کے اوقات", description: "مقامی اوقات، ہجری تاریخ اور اگلی نماز کی الٹی گنتی۔" },
    qibla: { title: "قبلہ کمپاس", description: "آپ کے مقام سے خانہ کعبہ کی درست سمت۔" },
    "islamic-calendar": { title: "اسلامی کیلنڈر", description: "عیسوی اور ہجری تاریخیں ایک ساتھ۔" },
    "mosque-finder": { title: "مسجد تلاش کریں", description: "قریبی مساجد نور کے اندر دیکھیں۔" },
    "daily-duas": { title: "روزانہ دعائیں", description: "دن کے ہر موقع کے لیے مستند دعائیں۔" },
    darood: { title: "درود شریف", description: "مستند اور واضح طور پر نشان زدہ صلوات۔" },
    zakat: { title: "زکوٰۃ کیلکولیٹر", description: "اہل اثاثوں پر نجی 2.5 فیصد تخمینہ۔" },
    kaza: { title: "قضا نماز منصوبہ", description: "رہ جانے والی نمازوں کا تخمینہ اور تکمیل کا منصوبہ۔" },
    lughat: { title: "فیروز اللغات", description: "عربی، اردو، رومن اور انگریزی اسلامی الفاظ۔" },
    names: { title: "اللہ کے 99 نام", description: "عربی نام، تلفظ اور معانی۔" },
    destinations: { title: "مسلم مذہبی مقامات", description: "مقدس شہروں اور اسلامی ورثے کی رہنمائی۔" },
  },
};

type QuranPayload = {
  surah?: {
    number: number;
    name: string;
    englishName: string;
    meaning: string;
    ayahs: Array<{ number: number; arabic: string; english: string }>;
    audio: { src: string; verseTimings: Array<{ number: number; from: number; to: number; duration: number }> };
  };
  error?: string;
};

const TRANSLITERATION: Record<number, string[]> = {
  1: [
    "Bismillāhir-Raḥmānir-Raḥīm",
    "Al-ḥamdu lillāhi rabbil-ʿālamīn",
    "Ar-Raḥmānir-Raḥīm",
    "Māliki yawmid-dīn",
    "Iyyāka naʿbudu wa iyyāka nastaʿīn",
    "Ihdinaṣ-ṣirāṭal-mustaqīm",
    "Ṣirāṭal-ladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa laḍ-ḍāllīn",
  ],
};

const DUAS = [
  { category: "Morning", title: "Morning remembrance", arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", roman: "Asbahna wa asbahal-mulku lillah.", meaning: "We have entered the morning and all sovereignty belongs to Allah.", source: "Sahih Muslim 2723" },
  { category: "Evening", title: "Evening remembrance", arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", roman: "Amsayna wa amsal-mulku lillah.", meaning: "We have entered the evening and all sovereignty belongs to Allah.", source: "Sahih Muslim 2723" },
  { category: "Travel", title: "Beginning a journey", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", roman: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin.", meaning: "Glory to Him who has subjected this to us, though we could not have controlled it.", source: "Quran 43:13" },
  { category: "Sleeping", title: "Before sleeping", arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", roman: "Bismika Allahumma amutu wa ahya.", meaning: "In Your name, O Allah, I die and I live.", source: "Sahih al-Bukhari 6324" },
  { category: "Food", title: "Before food", arabic: "بِسْمِ اللَّهِ", roman: "Bismillah.", meaning: "In the name of Allah.", source: "Sunan Abi Dawud 3767" },
  { category: "Forgiveness", title: "Seeking forgiveness", arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", roman: "Astaghfirullaha wa atubu ilayh.", meaning: "I seek Allah’s forgiveness and turn to Him in repentance.", source: "Sahih al-Bukhari 6307" },
];

const DAROOD = {
  title: "Darood Ibrahim",
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
  roman: "Allahumma salli ‘ala Muhammadin wa ‘ala aali Muhammad, kama sallaita ‘ala Ibrahima wa ‘ala aali Ibrahim, innaka Hamidum Majid.",
  meaning: "O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.",
  source: "Sahih al-Bukhari 3370",
};

function WorkspaceHeader({ feature, title, description, href }: { feature: FeatureId; title: string; description: string; href?: string }) {
  const locale = useContext(LocaleContext);
  const translated = WORKSPACE_COPY[locale][feature];
  const resolvedTitle = translated?.title ?? title;
  const fullPageLabel = locale === "hi" ? "पूरा पेज देखें" : locale === "ur" ? "مکمل صفحہ دیکھیں" : "View full page";

  return <header className="workspace-heading">
    <div>
      <span>{locale === "hi" ? "नूर दैनिक सुविधा" : locale === "ur" ? "نور روزانہ سہولت" : "NOOR DAILY TOOL"}</span>
      <h2 id={`workspace-${feature}-heading`} tabIndex={-1}>{resolvedTitle}</h2>
      <p>{translated?.description ?? description}</p>
    </div>
    {href ? <Link className="workspace-full-page" href={href} aria-label={`${fullPageLabel}: ${resolvedTitle}`}>
      <span>{fullPageLabel}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
    </Link> : null}
  </header>;
}

function QuranWorkspace({ target }: { target: QuranTarget }) {
  const [payload, setPayload] = useState<QuranPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoman, setShowRoman] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { current, play, quranPlayback } = useMediaPlayer();
  const versesRef = useRef<HTMLDivElement | null>(null);
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const surah = payload?.surah;
  const playingThis = current?.kind === "quran" && current.surahNumber === surah?.number;
  const activeVerse = playingThis ? quranPlayback.activeVerseNumber : target.ayah;
  const previewAyahs = useMemo(() => {
    if (!surah) return [];
    const anchor = activeVerse ?? 1;
    const start = Math.min(Math.max(anchor - 2, 0), Math.max(0, surah.ayahs.length - 3));
    return surah.ayahs.slice(start, start + 3);
  }, [activeVerse, surah]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setBookmarked(readSavedList(SAVED_KEYS.quranSurahs).includes(String(target.surah)));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [target.surah]);

  useEffect(() => {
    const controller = new AbortController();
    const frame = window.requestAnimationFrame(() => {
      setLoading(true);
      setPayload(null);
      fetch(`/api/quran/surah/${target.surah}`, { signal: controller.signal })
        .then(async (response) => {
          const result = await response.json() as QuranPayload;
          if (!response.ok) throw new Error(result.error ?? "Quran data is unavailable.");
          return result;
        })
        .then(setPayload)
        .catch((error: Error) => { if (error.name !== "AbortError") setPayload({ error: error.message }); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    });
    return () => { window.cancelAnimationFrame(frame); controller.abort(); };
  }, [target.surah]);

  useEffect(() => {
    if (!activeVerse) return;
    const container = versesRef.current;
    const verse = verseRefs.current[activeVerse];
    if (!container || !verse) return;
    const frame = window.requestAnimationFrame(() => {
      const containerBox = container.getBoundingClientRect();
      const verseBox = verse.getBoundingClientRect();
      const top = container.scrollTop + verseBox.top - containerBox.top - (container.clientHeight - verseBox.height) / 2;
      container.scrollTo({
        top: Math.max(0, top),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeVerse]);

  const begin = () => {
    if (!surah) return;
    play({
      kind: "quran",
      id: `surah-${surah.number}`,
      title: `Surah ${surah.englishName}`,
      subtitle: "Mishary Rashid Alafasy",
      src: surah.audio.src,
      surahNumber: surah.number,
      verseTimings: surah.audio.verseTimings,
      verses: surah.ayahs,
    });
  };

  const toggleSurahBookmark = () => {
    const key = String(surah?.number ?? target.surah);
    const current = readSavedList(SAVED_KEYS.quranSurahs);
    const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
    writeSavedList(SAVED_KEYS.quranSurahs, next);
    setBookmarked(next.includes(key));
  };

  return <>
    <WorkspaceHeader feature="quran" title={surah ? `Surah ${surah.englishName}` : "Quran Reader"} description={surah ? `${surah.meaning} · ${surah.ayahs.length} verses` : "Arabic, English meaning and full Surah audio."} href={surah ? `/quran?surah=${surah.number}${target.ayah ? `&ayah=${target.ayah}` : ""}` : "/quran"} />
    {loading ? <div className="workspace-state" role="status">Loading the Quran reader…</div> : payload?.error || !surah ? <div className="workspace-state error" role="alert">{payload?.error ?? "This Surah could not be loaded."}</div> : (
      <div className="home-quran-reader">
        <div className="home-quran-toolbar">
          <label><span>Surah</span><select value={surah.number} onChange={(event) => window.dispatchEvent(new CustomEvent("noor:activate-feature", { detail: { feature: "quran", href: `/quran?surah=${event.target.value}` } }))}>
            {[1,2,18,36,55,56,67,112,113,114].map((number) => <option value={number} key={number}>{number}. {number === 1 ? "Al-Fatihah" : number === 2 ? "Al-Baqarah" : number === 18 ? "Al-Kahf" : number === 36 ? "Ya-Sin" : number === 55 ? "Ar-Rahman" : number === 56 ? "Al-Waqi‘ah" : number === 67 ? "Al-Mulk" : number === 112 ? "Al-Ikhlas" : number === 113 ? "Al-Falaq" : "An-Nas"}</option>)}
          </select></label>
          <button type="button" onClick={() => setShowRoman((value) => !value)} aria-pressed={showRoman}>Transliteration {showRoman ? "on" : "off"}</button>
          <button type="button" onClick={toggleSurahBookmark} aria-pressed={bookmarked}>{bookmarked ? "★ Surah saved" : "☆ Save Surah"}</button>
        </div>
        <div className="home-quran-verses" ref={versesRef} aria-live="polite">
          {previewAyahs.map((ayah) => {
            const active = activeVerse === ayah.number;
            const progress = active && playingThis ? Math.round(quranPlayback.verseProgress * 100) : 0;
            return <div ref={(node) => { verseRefs.current[ayah.number] = node; }} className={active ? "active" : ""} aria-current={active ? "true" : undefined} style={{ "--verse-progress": `${progress}%` } as React.CSSProperties} key={ayah.number}>
              <span className="ayah-number">{ayah.number}</span>
              <div className="ayah-arabic-wrap"><p className="ayah-arabic" lang="ar" dir="rtl">{ayah.arabic}</p>{showRoman ? <small>{TRANSLITERATION[surah.number]?.[ayah.number - 1] ?? "Transliteration is available in the full reader."}</small> : null}</div>
              <p className="ayah-translation"><b>{ayah.number}</b>{ayah.english}</p>
            </div>;
          })}
        </div>
        <aside className="home-quran-audio">
          <small className="home-quran-preview-label">COMPACT PREVIEW · 3 OF {surah.ayahs.length} AYAHS</small>
          <span>RECITATION</span><strong>Mishary Rashid Alafasy</strong><p>{activeVerse ? `Ayah ${surah.number}:${activeVerse} follows the audio automatically.` : "Play the complete Surah with automatic Ayah highlighting."}</p>
          <button type="button" onClick={begin}>{playingThis && quranPlayback.isPlaying ? "Playing full Surah" : "▶ Play full Surah"}</button>
          <div className="home-quran-progress"><i style={{ width: playingThis && quranPlayback.duration ? `${(quranPlayback.currentTime / quranPlayback.duration) * 100}%` : "0%" }}/></div>
          <div><span>{playingThis ? Math.floor(quranPlayback.currentTime / 60) + ":" + String(Math.floor(quranPlayback.currentTime % 60)).padStart(2, "0") : "0:00"}</span><span>{playingThis && quranPlayback.duration ? Math.floor(quranPlayback.duration / 60) + ":" + String(Math.floor(quranPlayback.duration % 60)).padStart(2, "0") : "Full Surah"}</span></div>
          <Link href={`/quran?surah=${surah.number}`}>Continue reading</Link>
        </aside>
      </div>
    )}
  </>;
}

function PrayerWorkspace() {
  const locale = useContext(LocaleContext);
  return <><WorkspaceHeader feature="prayer-times" title="Today’s Prayer Times" description="Live local timings, Hijri date, next prayer countdown and calculation settings." href="/prayer-times" /><div className="workspace-prayer"><PrayerTimesStrip locale={locale} /><div className="prayer-workspace-notes"><span>Calculation method and Hanafi/standard Asr are available in settings.</span><span>Use your location for the closest schedule.</span><span>Confirm congregation times with your mosque.</span></div></div></>;
}

function QiblaWorkspace() {
  return <div className="workspace-qibla-only"><QiblaCompass minimal /></div>;
}

function CalendarWorkspace() {
  const [offset, setOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const locale = useContext(LocaleContext);
  const localeTag = locale === "hi" ? "hi-IN" : locale === "ur" ? "ur-PK" : "en-GB";
  const month = useMemo(() => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() + offset); return date; }, [offset]);
  const days = useMemo(() => {
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const first = month.getDay();
    return { first, values: Array.from({ length: total }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)) };
  }, [month]);
  const hijriFormatter = useMemo(() => new Intl.DateTimeFormat(localeTag, { calendar: "islamic-umalqura", day: "numeric", month: "long", year: "numeric" }), [localeTag]);
  const compactHijri = (date: Date) => {
    const parts = new Intl.DateTimeFormat(localeTag, { calendar: "islamic-umalqura", day: "numeric", month: "short" }).formatToParts(date);
    return { day: parts.find((part) => part.type === "day")?.value ?? "", month: parts.find((part) => part.type === "month")?.value ?? "" };
  };
  const firstHijri = compactHijri(days.values[0]);
  const lastHijri = compactHijri(days.values[days.values.length - 1]);
  const monthRange = firstHijri.month === lastHijri.month ? firstHijri.month : `${firstHijri.month} – ${lastHijri.month}`;
  const weekdays = locale === "hi" ? ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"] : locale === "ur" ? ["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"] : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const events = locale === "hi" ? [
    ["रमज़ान", "महीना 9", "रोज़ा, इबादत और क़ुरआन का महीना।"],
    ["लैलतुल क़द्र", "रमज़ान की अंतिम रातें", "स्थानीय मस्जिद की घोषणा देखें।"],
    ["ईद-उल-फ़ित्र", "1 शव्वाल", "रमज़ान पूरा होने की ईद।"],
    ["आशूरा", "10 मुहर्रम", "मुहर्रम की दसवीं तारीख़।"],
  ] : locale === "ur" ? [
    ["رمضان", "مہینہ 9", "روزے، عبادت اور قرآن کا مہینہ۔"],
    ["لیلۃ القدر", "رمضان کی آخری راتیں", "مقامی مسجد کے اعلان کی پیروی کریں۔"],
    ["عید الفطر", "1 شوال", "رمضان مکمل ہونے کی عید۔"],
    ["عاشورہ", "10 محرم", "محرم کی دسویں تاریخ۔"],
  ] : [
    ["Ramadan", "Month 9", "A month of fasting, worship and Quran."],
    ["Laylat al-Qadr", "Last nights of Ramadan", "Follow trusted local mosque announcements."],
    ["Eid al-Fitr", "1 Shawwal", "The celebration that completes Ramadan."],
    ["Ashura", "10 Muharram", "The tenth day of Muharram."],
  ];
  const todayLabel = locale === "hi" ? "आज" : locale === "ur" ? "آج" : "Today";
  const importantLabel = locale === "hi" ? "महत्वपूर्ण तारीख़ें" : locale === "ur" ? "اہم تاریخیں" : "Important dates";
  return <><WorkspaceHeader feature="islamic-calendar" title="Islamic Calendar" description="Gregorian and Hijri dates together, with important occasions kept inside NOOR." href="/islamic-calendar" /><div className="workspace-calendar"><section><header><button type="button" onClick={() => setOffset((value) => value - 1)} aria-label="Previous month">‹</button><div><strong>{month.toLocaleDateString(localeTag, { month: "long", year: "numeric" })}</strong><small>{monthRange} · 1448 AH</small></div><button className="calendar-today-button" type="button" onClick={() => { setOffset(0); setSelectedDate(new Date()); }}>{todayLabel}</button><button type="button" onClick={() => setOffset((value) => value + 1)} aria-label="Next month">›</button></header><div className="calendar-week">{weekdays.map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{Array.from({ length: days.first }, (_, index) => <i key={`blank-${index}`}/>) }{days.values.map((date) => { const today = date.toDateString() === new Date().toDateString(); const selected = date.toDateString() === selectedDate.toDateString(); const hijri = compactHijri(date); return <button className={`${today ? "today " : ""}${selected ? "selected " : ""}${date.getDay() === 5 ? "friday" : ""}`.trim()} type="button" key={date.toISOString()} aria-pressed={selected} onClick={() => setSelectedDate(date)}><strong>{date.getDate()}</strong><span>{date.toLocaleDateString(localeTag, { weekday: "short" })}</span><small>{hijri.day} {hijri.month}</small></button>; })}</div></section><aside><div className="calendar-selected-day"><span>{todayLabel.toUpperCase()}</span><strong>{hijriFormatter.format(selectedDate)}</strong><small>{selectedDate.toLocaleDateString(localeTag, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</small></div><span>{importantLabel.toUpperCase()}</span>{events.map(([title, date, detail]) => <article key={title}><div><strong>{title}</strong><small>{date}</small></div><p>{detail}</p></article>)}<small>{locale === "hi" ? "चाँद दिखाई देने के अनुसार तारीख़ एक दिन बदल सकती है।" : locale === "ur" ? "چاند دیکھنے کے مطابق تاریخ ایک دن مختلف ہو سکتی ہے۔" : "Calculated dates can differ by one day according to local moon sighting."}</small></aside></div></>;
}

type Mosque = { id: string; name: string; address: string; distanceKm: number; kind: string };
function MosqueWorkspace() {
  const [state, setState] = useState<"idle" | "locating" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("Use your location to find nearby masjids.");
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const locate = () => {
    if (!navigator.geolocation) { setState("error"); setMessage("Location is not supported in this browser."); return; }
    setState("locating");
    navigator.geolocation.getCurrentPosition(async (position) => {
      setState("loading");
      writeNoorLocation({ id: "current", label: "Current location", latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, source: "device" });
      try {
        const response = await fetch(`/api/mosques?lat=${position.coords.latitude}&lng=${position.coords.longitude}&radius=5000`);
        const result = await response.json() as { mosques?: Mosque[]; error?: string };
        if (!response.ok) throw new Error(result.error);
        setMosques(result.mosques ?? []); setState("ready"); setMessage(result.mosques?.length ? `${result.mosques.length} prayer places found within 5 km.` : "No mapped mosques were found nearby.");
      } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : "The mosque service is unavailable."); }
    }, () => { setState("error"); setMessage("Location permission was denied. Allow location and try again."); }, { enableHighAccuracy: true, timeout: 10000 });
  };
  return <><WorkspaceHeader feature="mosque-finder" title="Mosque Finder" description="Nearby mosques from your location, shown as an internal NOOR list." href="/mosque-finder" /><div className="workspace-mosques"><aside><span aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 43s14-11.4 14-25A14 14 0 1 0 10 18c0 13.6 14 25 14 25Z"/><circle cx="24" cy="18" r="5"/></svg></span><strong>Find a mosque near you</strong><p>Your selected location is kept only on this device and shared with Prayer Times and Qibla.</p><button type="button" onClick={locate} disabled={state === "locating" || state === "loading"}>{state === "locating" ? "Getting location…" : state === "loading" ? "Searching map…" : "Use current location"}</button><small role="status">{message}</small></aside><section>{mosques.map((mosque) => <article key={mosque.id}><div><span>{mosque.kind}</span><strong>{mosque.name}</strong><small>{mosque.address}</small></div><b>{mosque.distanceKm.toFixed(1)} km</b></article>)}{state === "idle" ? <div className="workspace-empty">Nearby mosque results will appear here.</div> : null}</section></div></>;
}

function DuasWorkspace() {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const dua = DUAS[index];
  return <><WorkspaceHeader feature="daily-duas" title="Daily Duas" description="Authentic supplications for the moments of your day." /><div className="workspace-duas"><nav aria-label="Dua categories">{DUAS.map((item, itemIndex) => <button className={itemIndex === index ? "active" : ""} type="button" onClick={() => { setIndex(itemIndex); setCount(0); }} key={item.category}>{item.category}</button>)}</nav><article><span>{dua.category.toUpperCase()} · {dua.source}</span><h3>{dua.title}</h3><p className="arabic" lang="ar" dir="rtl">{dua.arabic}</p><p>{dua.roman}</p><blockquote>{dua.meaning}</blockquote><div><button type="button" onClick={() => navigator.clipboard?.writeText(`${dua.arabic}\n${dua.meaning}`)}>Copy</button><button type="button" onClick={() => setCount((value) => value + 1)}>Count <b>{count}</b></button><button type="button">☆ Save</button></div></article></div></>;
}

function DaroodWorkspace() {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(100);
  return <><WorkspaceHeader feature="darood" title="Darood Sharif" description="Hadith-reported and clearly labelled traditional Salawat." href="/darood" /><div className="workspace-darood"><article><span>PROPHETIC WORDING · {DAROOD.source}</span><h3>{DAROOD.title}</h3><p className="arabic" lang="ar" dir="rtl">{DAROOD.arabic}</p><p>{DAROOD.roman}</p><blockquote>{DAROOD.meaning}</blockquote></article><aside><span>SALAWAT COUNTER</span><strong>{count}</strong><small>Daily goal {goal}</small><progress value={count} max={goal}/><button type="button" onClick={() => setCount((value) => value + 1)}>+ Count one</button><div><button type="button" onClick={() => setCount(0)}>Reset</button><select value={goal} onChange={(event) => setGoal(Number(event.target.value))} aria-label="Daily goal"><option value={33}>Goal 33</option><option value={100}>Goal 100</option><option value={313}>Goal 313</option></select></div></aside></div></>;
}

function ZakatWorkspace() {
  const [values, setValues] = useState({ gold: "", silver: "", cash: "", bank: "", investments: "", business: "", receivables: "", liabilities: "", nisab: "50000" });
  const total = Math.max(0, ["gold","silver","cash","bank","investments","business","receivables"].reduce((sum, key) => sum + (Number(values[key as keyof typeof values]) || 0), 0) - (Number(values.liabilities) || 0));
  const due = total >= (Number(values.nisab) || 0) ? total * 0.025 : 0;
  return <><WorkspaceHeader feature="zakat" title="Zakat Calculator" description="A private 2.5% estimate for qualifying assets after short-term liabilities." href="/zakat-calculator" /><div className="workspace-calculator"><section>{Object.entries(values).map(([key, value]) => <label key={key}><span>{key === "nisab" ? "Current Nisab value" : key.charAt(0).toUpperCase() + key.slice(1)}</span><div><b>₹</b><input inputMode="decimal" type="number" min="0" value={value} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} placeholder="0"/></div></label>)}</section><aside><span>YOUR ESTIMATE</span><small>Total eligible assets</small><strong>₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong><small>Zakat at 2.5%</small><b>₹{due.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</b><p>{due ? "Your net eligible wealth is above the Nisab entered." : "Enter assets and a current Nisab value to calculate."}</p><button type="button" onClick={() => setValues({ gold: "", silver: "", cash: "", bank: "", investments: "", business: "", receivables: "", liabilities: "", nisab: "50000" })}>Reset calculator</button></aside></div></>;
}

function KazaWorkspace() {
  const [days, setDays] = useState("");
  const [completed, setCompleted] = useState(0);
  const [goal, setGoal] = useState(5);
  const total = Math.max(0, (Number(days) || 0) * 5 - completed);
  return <><WorkspaceHeader feature="kaza" title="Qaza Namaz Planner" description="Estimate missed prayers and build a steady private completion plan." href="/qaza-namaz" /><div className="workspace-kaza"><section><label><span>Estimated missed days</span><input type="number" min="0" value={days} onChange={(event) => setDays(event.target.value)} placeholder="0"/></label><label><span>Daily completion goal</span><input type="number" min="1" value={goal} onChange={(event) => setGoal(Math.max(1, Number(event.target.value) || 1))}/></label><div>{["Fajr","Dhuhr","Asr","Maghrib","Isha"].map((prayer) => <span key={prayer}><b>{prayer}</b><small>{Math.max(0, Number(days) || 0).toLocaleString("en-IN")}</small></span>)}</div></section><aside><span>REMAINING PRAYERS</span><strong>{total.toLocaleString("en-IN")}</strong><p>{total ? `About ${Math.ceil(total / goal).toLocaleString("en-IN")} days at ${goal} per day.` : "Enter a careful estimate to begin."}</p><button type="button" onClick={() => setCompleted((value) => Math.min((Number(days) || 0) * 5, value + 1))}>Mark one completed</button><small>{completed.toLocaleString("en-IN")} marked complete on this visit</small></aside></div></>;
}

function LughatWorkspace() {
  const [query, setQuery] = useState("");
  const matches = lughatEntries.filter((entry) => [entry.term,entry.urdu,entry.roman,entry.meaning].join(" ").toLowerCase().includes(query.toLowerCase()));
  return <><WorkspaceHeader feature="lughat" title="Firoz-ul-Lughat" description="Arabic, Urdu, Roman and English Islamic vocabulary—without leaving NOOR." href="/firozul-lughat" /><div className="workspace-lughat"><div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Allah, Salah, Wudu, Zakat…" aria-label="Search Firoz-ul-Lughat"/><span>{lughatEntries.length} reviewed terms</span></div><section>{matches.map((entry) => <article key={entry.id}><span>{entry.category}</span><strong>{entry.term}</strong><b lang="ur" dir="rtl">{entry.urdu}</b><small>{entry.roman}</small><p>{entry.meaning}</p><em>{entry.use}</em></article>)}{!matches.length ? <div className="workspace-empty">No word found. Try a shorter spelling.</div> : null}</section></div></>;
}

type AllahName = { number: number; name: string; transliteration: string; meaning: string };
const FALLBACK_NAMES: AllahName[] = [
  { number: 1, name: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Most Compassionate" },
  { number: 2, name: "الرَّحِيمُ", transliteration: "Ar-Rahim", meaning: "The Most Merciful" },
  { number: 3, name: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King" },
  { number: 4, name: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy" },
  { number: 5, name: "السَّلَامُ", transliteration: "As-Salam", meaning: "The Source of Peace" },
  { number: 6, name: "الْمُؤْمِنُ", transliteration: "Al-Mu’min", meaning: "The Giver of Security" },
];
function NamesWorkspace() {
  const [names, setNames] = useState<AllahName[]>(FALLBACK_NAMES);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    fetch("/api/names").then((response) => response.ok ? response.json() : Promise.reject()).then((payload: { names?: AllahName[] }) => { if (payload.names?.length === 99) setNames(payload.names); }).catch(() => undefined);
  }, []);
  const filtered = names.filter((name) => `${name.name} ${name.transliteration} ${name.meaning}`.toLowerCase().includes(query.toLowerCase()));
  const current = names[selected] ?? names[0];
  return <><WorkspaceHeader feature="names" title="99 Names of Allah" description="Arabic names, transliteration, meanings and personal progress inside NOOR." /><div className="workspace-names"><aside><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a Name or meaning…" aria-label="Search the 99 Names"/><div>{filtered.map((name) => <button className={current.number === name.number ? "active" : ""} type="button" onClick={() => setSelected(names.findIndex((item) => item.number === name.number))} key={name.number}><span>{name.number}</span><b lang="ar" dir="rtl">{name.name}</b><strong>{name.transliteration}</strong></button>)}</div></aside><article><span>NAME {current.number} OF 99</span><p lang="ar" dir="rtl">{current.name}</p><h3>{current.transliteration}</h3><blockquote>{current.meaning}</blockquote><progress value={current.number} max={99}/><div><button type="button" onClick={() => setSelected((value) => (value - 1 + names.length) % names.length)}>← Previous</button><button type="button">☆ Save</button><button type="button" onClick={() => setSelected((value) => (value + 1) % names.length)}>Next →</button></div></article></div></>;
}

function DestinationsWorkspace() {
  const [selected, setSelected] = useState(0);
  const destination = destinations[selected];
  return <><WorkspaceHeader feature="destinations" title="Muslim Destinations" description="Sacred cities and Islamic heritage guidance, fully contained inside NOOR." href="/destinations" /><div className="workspace-destinations"><nav>{destinations.map((item, index) => <button className={selected === index ? "active" : ""} type="button" onClick={() => setSelected(index)} key={item.slug}><span>{item.category}</span><strong>{item.name}</strong><small>{item.country}</small></button>)}</nav><article><div className="destination-ornament"><span aria-hidden="true">☾</span><b>{destination.region}</b></div><span>{destination.category.toUpperCase()} · {destination.country}</span><h3>{destination.name}</h3>{destination.arabic ? <p className="arabic" lang="ar" dir="rtl">{destination.arabic}</p> : null}<p>{destination.summary}</p><h4>Important places</h4><ul>{destination.places.map((place) => <li key={place}>{place}</li>)}</ul><details><summary>Planning and etiquette</summary><p>{destination.planning}</p><p>{destination.etiquette}</p></details><button type="button">☆ Save destination</button></article></div></>;
}

const STRIP_FEATURE_IDS = new Set<FeatureId>(["mosque-finder", "daily-duas", "darood", "zakat", "kaza", "lughat", "names", "destinations"]);
const FEATURE_REGION_LABELS: Record<FeatureId, string> = {
  quran: "Quran reader",
  "prayer-times": "Prayer times",
  qibla: "Qibla compass",
  "islamic-calendar": "Islamic calendar",
  "mosque-finder": "Mosque finder",
  "daily-duas": "Daily duas",
  darood: "Darood Sharif",
  zakat: "Zakat calculator",
  kaza: "Qaza Namaz",
  lughat: "Firoz-ul-Lughat",
  names: "99 Names of Allah",
  destinations: "Muslim destinations",
};

export default function HomeFeatureWorkspace({ activeFeature, quranTarget, locale = "en" }: { activeFeature: FeatureId; quranTarget: QuranTarget; locale?: NoorLocale }) {
  let content: React.ReactNode;
  switch (activeFeature) {
    case "prayer-times": content = <PrayerWorkspace />; break;
    case "qibla": content = <QiblaWorkspace />; break;
    case "islamic-calendar": content = <CalendarWorkspace />; break;
    case "mosque-finder": content = <MosqueWorkspace />; break;
    case "daily-duas": content = <DuasWorkspace />; break;
    case "darood": content = <DaroodWorkspace />; break;
    case "zakat": content = <ZakatWorkspace />; break;
    case "kaza": content = <KazaWorkspace />; break;
    case "lughat": content = <LughatWorkspace />; break;
    case "names": content = <NamesWorkspace />; break;
    case "destinations": content = <DestinationsWorkspace />; break;
    default: content = <QuranWorkspace target={quranTarget} />;
  }
  const isStripFeature = STRIP_FEATURE_IDS.has(activeFeature);
  return <LocaleContext.Provider value={locale}><section className={`noor-dynamic-workspace${activeFeature === "qibla" ? " qibla-only-panel" : ""}`} id={`panel-${activeFeature}`} role={isStripFeature ? "tabpanel" : "region"} aria-labelledby={isStripFeature ? `tab-${activeFeature}` : undefined} aria-label={isStripFeature ? undefined : FEATURE_REGION_LABELS[activeFeature]} tabIndex={0} key={activeFeature}><div className="workspace-transition" aria-live="polite">{content}</div></section></LocaleContext.Provider>;
}
