"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { destinations } from "../destinations/destination-data";
import { lughatEntries } from "../firozul-lughat/lughat-data";
import { useMediaPlayer } from "../media/MediaProvider";
import QiblaCompass from "../qibla/QiblaCompass";
import PrayerTimesStrip from "./PrayerTimesStrip";

export type FeatureId = "quran" | "prayer-times" | "qibla" | "islamic-calendar" | "mosque-finder" | "daily-duas" | "darood" | "zakat" | "kaza" | "lughat" | "names" | "destinations";
export type QuranTarget = { surah: number; ayah: number | null };

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
  return <header className="workspace-heading"><div><span>NOOR DAILY TOOL</span><h2 id={`workspace-${feature}-heading`} tabIndex={-1}>{title}</h2><p>{description}</p></div>{href ? <Link href={href}>Open full tool <span aria-hidden="true">→</span></Link> : null}</header>;
}

function QuranWorkspace({ target }: { target: QuranTarget }) {
  const [payload, setPayload] = useState<QuranPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoman, setShowRoman] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { current, play, quranPlayback } = useMediaPlayer();
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const surah = payload?.surah;
  const playingThis = current?.kind === "quran" && current.surahNumber === surah?.number;
  const activeVerse = playingThis ? quranPlayback.activeVerseNumber : target.ayah;

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
    verseRefs.current[activeVerse]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  return <>
    <WorkspaceHeader feature="quran" title={surah ? `Surah ${surah.englishName}` : "Quran Reader"} description={surah ? `${surah.meaning} · ${surah.ayahs.length} verses` : "Arabic, English meaning and full Surah audio."} href={surah ? `/quran?surah=${surah.number}${target.ayah ? `&ayah=${target.ayah}` : ""}` : "/quran"} />
    {loading ? <div className="workspace-state" role="status">Loading the Quran reader…</div> : payload?.error || !surah ? <div className="workspace-state error" role="alert">{payload?.error ?? "This Surah could not be loaded."}</div> : (
      <div className="home-quran-reader">
        <div className="home-quran-toolbar">
          <label><span>Surah</span><select value={surah.number} onChange={(event) => window.dispatchEvent(new CustomEvent("noor:activate-feature", { detail: { feature: "quran", href: `/quran?surah=${event.target.value}` } }))}>
            {[1,2,18,36,55,56,67,112,113,114].map((number) => <option value={number} key={number}>{number}. {number === 1 ? "Al-Fatihah" : number === 2 ? "Al-Baqarah" : number === 18 ? "Al-Kahf" : number === 36 ? "Ya-Sin" : number === 55 ? "Ar-Rahman" : number === 56 ? "Al-Waqi‘ah" : number === 67 ? "Al-Mulk" : number === 112 ? "Al-Ikhlas" : number === 113 ? "Al-Falaq" : "An-Nas"}</option>)}
          </select></label>
          <button type="button" onClick={() => setShowRoman((value) => !value)} aria-pressed={showRoman}>Transliteration {showRoman ? "on" : "off"}</button>
          <button type="button" onClick={() => setBookmarked((value) => !value)} aria-pressed={bookmarked}>{bookmarked ? "★ Saved" : "☆ Bookmark"}</button>
        </div>
        <div className="home-quran-verses" aria-live="polite">
          {surah.ayahs.map((ayah) => {
            const active = activeVerse === ayah.number;
            const progress = active && playingThis ? Math.round(quranPlayback.verseProgress * 100) : 0;
            return <div ref={(node) => { verseRefs.current[ayah.number] = node; }} className={active ? "active" : ""} style={{ "--verse-progress": `${progress}%` } as React.CSSProperties} key={ayah.number}>
              <span className="ayah-number">{ayah.number}</span>
              <div className="ayah-arabic-wrap"><p className="ayah-arabic" lang="ar" dir="rtl">{ayah.arabic}</p>{showRoman ? <small>{TRANSLITERATION[surah.number]?.[ayah.number - 1] ?? "Transliteration is available in the full reader."}</small> : null}</div>
              <p className="ayah-translation"><b>{ayah.number}</b>{ayah.english}</p>
            </div>;
          })}
        </div>
        <aside className="home-quran-audio">
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
  return <><WorkspaceHeader feature="prayer-times" title="Today’s Prayer Times" description="Live local timings, Hijri date, next prayer countdown and calculation settings." href="/namaz" /><div className="workspace-prayer"><PrayerTimesStrip /><div className="prayer-workspace-notes"><span>Calculation method and Hanafi/standard Asr are available in settings.</span><span>Use your location for the closest schedule.</span><span>Confirm congregation times with your mosque.</span></div></div></>;
}

function QiblaWorkspace() {
  return <><WorkspaceHeader feature="qibla" title="Qibla Compass" description="Live direction to the Kaaba with true-north and calibrated sensor modes." /><div className="workspace-qibla"><QiblaCompass /><aside><strong>280.08° WNW</strong><span>Mumbai reference bearing</span><p>Hold the phone flat, enable motion access, and keep it away from magnetic cases. The Kaaba arrow moves against the live phone heading.</p><ul><li>Green status means aligned</li><li>Recalibrate after rotating the screen</li><li>Your coordinates stay in this browser</li></ul></aside></div></>;
}

function CalendarWorkspace() {
  const [offset, setOffset] = useState(0);
  const month = useMemo(() => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() + offset); return date; }, [offset]);
  const days = useMemo(() => {
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const first = month.getDay();
    return { first, values: Array.from({ length: total }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)) };
  }, [month]);
  return <><WorkspaceHeader feature="islamic-calendar" title="Islamic Calendar" description="Gregorian and Hijri dates together, with important occasions kept inside NOOR." href="/islamic-calendar" /><div className="workspace-calendar"><section><header><button type="button" onClick={() => setOffset((value) => value - 1)} aria-label="Previous month">‹</button><strong>{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong><button type="button" onClick={() => setOffset((value) => value + 1)} aria-label="Next month">›</button></header><div className="calendar-week">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{Array.from({ length: days.first }, (_, index) => <i key={`blank-${index}`}/>) }{days.values.map((date) => { const today = date.toDateString() === new Date().toDateString(); const hijri = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric" }).format(date); return <button className={today ? "today" : ""} type="button" key={date.toISOString()}><strong>{date.getDate()}</strong><small>{hijri}</small></button>; })}</div></section><aside><span>IMPORTANT DATES</span>{["Ramadan · Month 9","Laylat al-Qadr · last ten nights","Eid al-Fitr · 1 Shawwal","Ashura · 10 Muharram","Eid al-Adha · 10 Dhul Hijjah"].map((item) => <button type="button" key={item}>{item}<b>＋</b></button>)}<small>Calculated dates can differ by local moon sighting.</small></aside></div></>;
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
      try {
        const response = await fetch(`/api/mosques?lat=${position.coords.latitude}&lng=${position.coords.longitude}&radius=5000`);
        const result = await response.json() as { mosques?: Mosque[]; error?: string };
        if (!response.ok) throw new Error(result.error);
        setMosques(result.mosques ?? []); setState("ready"); setMessage(result.mosques?.length ? `${result.mosques.length} prayer places found within 5 km.` : "No mapped mosques were found nearby.");
      } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : "The mosque service is unavailable."); }
    }, () => { setState("error"); setMessage("Location permission was denied. Allow location and try again."); }, { enableHighAccuracy: true, timeout: 10000 });
  };
  return <><WorkspaceHeader feature="mosque-finder" title="Mosque Finder" description="Nearby mosques from your location, shown as an internal NOOR list." href="/mosque-finder" /><div className="workspace-mosques"><aside><span aria-hidden="true">⌖</span><strong>Find a mosque near you</strong><p>Your coordinates are used only for this search and are not saved.</p><button type="button" onClick={locate} disabled={state === "locating" || state === "loading"}>{state === "locating" ? "Getting location…" : state === "loading" ? "Searching map…" : "Use current location"}</button><small role="status">{message}</small></aside><section>{mosques.slice(0, 5).map((mosque) => <article key={mosque.id}><div><span>{mosque.kind}</span><strong>{mosque.name}</strong><small>{mosque.address}</small></div><b>{mosque.distanceKm.toFixed(1)} km</b></article>)}{state === "idle" ? <div className="workspace-empty">Nearby mosque results will appear here.</div> : null}</section></div></>;
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
  return <><WorkspaceHeader feature="kaza" title="Kaza Namaz Planner" description="Estimate missed prayers and build a steady private completion plan." href="/qaza-namaz" /><div className="workspace-kaza"><section><label><span>Estimated missed days</span><input type="number" min="0" value={days} onChange={(event) => setDays(event.target.value)} placeholder="0"/></label><label><span>Daily completion goal</span><input type="number" min="1" value={goal} onChange={(event) => setGoal(Math.max(1, Number(event.target.value) || 1))}/></label><div>{["Fajr","Dhuhr","Asr","Maghrib","Isha"].map((prayer) => <span key={prayer}><b>{prayer}</b><small>{Math.max(0, Number(days) || 0).toLocaleString("en-IN")}</small></span>)}</div></section><aside><span>REMAINING PRAYERS</span><strong>{total.toLocaleString("en-IN")}</strong><p>{total ? `About ${Math.ceil(total / goal).toLocaleString("en-IN")} days at ${goal} per day.` : "Enter a careful estimate to begin."}</p><button type="button" onClick={() => setCompleted((value) => Math.min((Number(days) || 0) * 5, value + 1))}>Mark one completed</button><small>{completed.toLocaleString("en-IN")} marked complete on this visit</small></aside></div></>;
}

function LughatWorkspace() {
  const [query, setQuery] = useState("");
  const matches = lughatEntries.filter((entry) => [entry.term,entry.urdu,entry.roman,entry.meaning].join(" ").toLowerCase().includes(query.toLowerCase())).slice(0, 8);
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

export default function HomeFeatureWorkspace({ activeFeature, quranTarget }: { activeFeature: FeatureId; quranTarget: QuranTarget }) {
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
  return <section className="noor-dynamic-workspace" id={`panel-${activeFeature}`} role="tabpanel" aria-labelledby={`tab-${activeFeature}`} tabIndex={0} key={activeFeature}><div className="workspace-transition" aria-live="polite">{content}</div></section>;
}
