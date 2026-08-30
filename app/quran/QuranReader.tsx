"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useMediaPlayer } from "../media/MediaProvider";
import { readSavedList, SAVED_KEYS, writeSavedList } from "../site/saved-items";

type SurahSummary = { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string };
type Ayah = { number: number; arabic: string; english: string; juz: number; page: number };
type VerseTiming = { number: number; from: number; to: number; duration: number };
type SurahDetail = { number: number; name: string; englishName: string; meaning: string; revelationType: string; ayahs: Ayah[]; audio: { src: string; duration: number; verseTimings: VerseTiming[] } };

const fallbackSurahs: SurahSummary[] = [
  { number: 1, name: "ٱلْفَاتِحَة", englishName: "Al-Faatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "ٱلْبَقَرَة", englishName: "Al-Baqara", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 18, name: "ٱلْكَهْف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Yaseen", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 55, name: "ٱلرَّحْمَٰن", englishName: "Ar-Rahmaan", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 67, name: "ٱلْمُلْك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 112, name: "ٱلْإِخْلَاص", englishName: "Al-Ikhlaas", englishNameTranslation: "Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
];

export default function QuranReader({ initialSurah = 1, initialAyah = null }: { initialSurah?: number; initialAyah?: number | null }) {
  const { current, play, quranPlayback } = useMediaPlayer();
  const [surahs, setSurahs] = useState<SurahSummary[]>(fallbackSurahs);
  const [selected, setSelected] = useState(initialSurah);
  const [requestVersion, setRequestVersion] = useState(0);
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMeaning, setShowMeaning] = useState(true);
  const [arabicSize, setArabicSize] = useState(36);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [autoFollow, setAutoFollow] = useState(true);
  const initialScrollDone = useRef(false);

  useEffect(() => {
    const saved = readSavedList(SAVED_KEYS.quranVerses);
    const timer = window.setTimeout(() => {
      setBookmarks(saved);
    }, 0);
    fetch("/api/quran/surahs")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { surahs?: SurahSummary[] }) => { if (Array.isArray(data.surahs)) setSurahs(data.surahs); })
      .catch(() => undefined);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/quran/surah/${selected}`, { signal: controller.signal })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }: { ok: boolean; data: { surah?: SurahDetail; error?: string } }) => {
        if (!ok || !data.surah) throw new Error(data.error ?? "Surah unavailable");
        setDetail(data.surah);
      })
      .catch((reason: Error) => { if (reason.name !== "AbortError") setError(reason.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [selected, requestVersion]);

  useEffect(() => {
    if (!detail || !initialAyah || initialScrollDone.current) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`ayah-${initialAyah}`);
      if (target) {
        initialScrollDone.current = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [detail, initialAyah]);

  const activeAyahNumber = current?.kind === "quran" && current.id === `quran-${detail?.number}` ? quranPlayback.activeVerseNumber : null;

  useEffect(() => {
    if (!activeAyahNumber || !autoFollow || !quranPlayback.isPlaying) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`ayah-${activeAyahNumber}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeAyahNumber, autoFollow, quranPlayback.isPlaying]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return surahs;
    return surahs.filter((surah) => `${surah.number} ${surah.englishName} ${surah.englishNameTranslation} ${surah.name}`.toLowerCase().includes(term));
  }, [query, surahs]);

  const chooseSurah = (number: number) => {
    setLoading(true);
    setError("");
    if (number === selected) setRequestVersion((value) => value + 1);
    else setSelected(number);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToAyah = (number: string) => {
    document.getElementById(`ayah-${number}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleBookmark = (ayah: number) => {
    const key = `${selected}:${ayah}`;
    const next = bookmarks.includes(key) ? bookmarks.filter((item) => item !== key) : [...bookmarks, key];
    setBookmarks(next);
    writeSavedList(SAVED_KEYS.quranVerses, next);
    setNotice(next.includes(key) ? `Saved ${key}` : `Removed ${key}`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const copyAyah = async (ayah: Ayah) => {
    await navigator.clipboard.writeText(`${ayah.arabic}\n${ayah.english}\nQuran ${selected}:${ayah.number}`);
    setNotice(`Copied ${selected}:${ayah.number}`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  return (
    <div className="quran-reader">
      <aside className="quran-sidebar">
        <div className="quran-sidebar-head"><span>114 SURAHS</span><strong>Choose a chapter</strong><input type="search" placeholder="Search Surah or number" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search Surahs" /></div>
        <div className="quran-surah-list">{filtered.map((surah) => <button className={selected === surah.number ? "active" : ""} type="button" key={surah.number} onClick={() => chooseSurah(surah.number)}><span>{surah.number}</span><div><strong>{surah.englishName}</strong><small>{surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs</small></div><b lang="ar" dir="rtl">{surah.name}</b></button>)}</div>
      </aside>

      <section className="quran-reading-panel">
        <div className="quran-reader-tools">
          <label><span>Jump to Ayah</span><select onChange={(event) => jumpToAyah(event.target.value)} defaultValue=""><option value="" disabled>Choose</option>{detail?.ayahs.map((ayah) => <option value={ayah.number} key={ayah.number}>{detail.number}:{ayah.number}</option>)}</select></label>
          <label><span>Arabic size</span><input type="range" min="27" max="54" value={arabicSize} onChange={(event) => setArabicSize(Number(event.target.value))} /></label>
          <div className="quran-tool-actions"><button className={autoFollow ? "active" : ""} type="button" onClick={() => setAutoFollow((value) => !value)}>{autoFollow ? "Auto-follow on" : "Auto-follow off"}</button><button className={showMeaning ? "active" : ""} type="button" onClick={() => setShowMeaning((value) => !value)}>{showMeaning ? "English meaning on" : "English meaning off"}</button></div>
        </div>

        {loading && <div className="quran-loading"><span/><span/><span/></div>}
        {error && <div className="quran-error"><strong>Reader temporarily unavailable</strong><p>{error}</p><button type="button" onClick={() => chooseSurah(selected)}>Try again</button></div>}
        {!loading && !error && detail && <>
          <header className="quran-surah-hero"><p>SURAH {detail.number} · {detail.revelationType.toUpperCase()}</p><h1>{detail.englishName}</h1><span>{detail.meaning} · {detail.ayahs.length} Ayahs</span><b lang="ar" dir="rtl">{detail.name}</b></header>
          <section className="quran-surah-player" aria-label={`Full recitation of Surah ${detail.englishName}`}>
            <div><span>FULL SURAH RECITATION</span><strong>Play {detail.englishName} from beginning to end</strong><small>Mishary Rashid Alafasy · continuous recording · timed English meaning follows every Ayah</small></div>
            <button type="button" onClick={() => play({ kind: "quran", id: `quran-${detail.number}`, title: `Surah ${detail.englishName}`, subtitle: "Mishary Rashid Alafasy · full Surah", src: detail.audio.src, surahNumber: detail.number, verseTimings: detail.audio.verseTimings, verses: detail.ayahs.map(({ number, arabic, english }) => ({ number, arabic, english })) })}>
              <span aria-hidden="true">▶</span>{current?.id === `quran-${detail.number}` ? `Playing · Ayah ${activeAyahNumber ?? 1}` : "Play full Surah with auto-follow"}
            </button>
          </section>
          <div className="quran-attribution"><span>Arabic Uthmani text</span><span>English meaning: Marmaduke Pickthall</span><span>Full audio: Mishary Rashid Alafasy</span><span>All reading and verse navigation stays inside NOOR</span></div>
          <div className="ayah-list">{detail.ayahs.map((ayah) => {
            const key = `${detail.number}:${ayah.number}`;
            const saved = bookmarks.includes(key);
            const active = ayah.number === activeAyahNumber;
            const progressStyle = active ? ({ "--ayah-progress": `${Math.round(quranPlayback.verseProgress * 100)}%` } as CSSProperties) : undefined;
            return <article className={`ayah-card${active ? " is-playing" : ""}`} id={`ayah-${ayah.number}`} key={ayah.number} aria-current={active ? "true" : undefined} style={progressStyle}>
              <div className="ayah-toolbar"><span>{detail.number}:{ayah.number}</span><div><small>Juz {ayah.juz || "—"} · Page {ayah.page || "—"}</small><button type="button" onClick={() => copyAyah(ayah)} aria-label={`Copy verse ${key}`}>Copy</button><button className={saved ? "saved" : ""} type="button" onClick={() => toggleBookmark(ayah.number)} aria-label={`${saved ? "Remove" : "Save"} verse ${key}`}>{saved ? "Saved" : "Save"}</button></div></div>
              <p className="ayah-arabic" lang="ar" dir="rtl" style={{ fontSize: `${arabicSize}px` }}>{ayah.arabic}</p>
              {showMeaning && <p className="ayah-meaning"><span>{ayah.number}</span>{ayah.english}</p>}
            </article>;
          })}</div>
        </>}
      </section>
      {notice && <div className="quran-notice" role="status">{notice}</div>}
    </div>
  );
}
