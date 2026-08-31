"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useMediaPlayer } from "../media/MediaProvider";
import { readSavedList, SAVED_KEYS, writeSavedList } from "../site/saved-items";

type SurahSummary = { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string };
type Ayah = { number: number; arabic: string; english: string; juz: number; page: number };
type VerseTiming = { number: number; from: number; to: number; duration: number };
type SurahDetail = { number: number; name: string; englishName: string; meaning: string; revelationType: string; ayahs: Ayah[]; audio: { src: string; duration: number; verseTimings: VerseTiming[]; reciterId?: string; reciterName?: string } };
type WordMeaning = { position: number; arabic: string; meaning: string; transliteration: string };
type StudyPanel = { type: "words" | "tafsir" | "note"; reference: string; title: string; loading: boolean; error: string; text: string; words: WordMeaning[]; truncated?: boolean };
type QuranSearchResult = { surah: number; ayah: number; title: string; excerpt: string };

const TRANSLATIONS = [
  { id: "en.sahih", label: "Saheeh International" },
  { id: "en.pickthall", label: "Pickthall" },
  { id: "ur.jalandhry", label: "Urdu · Jalandhry" },
  { id: "hi.hindi", label: "Hindi" },
];

const RECITERS = [
  { id: "alafasy", label: "Mishary Alafasy" },
  { id: "sudais", label: "Abdurrahman as-Sudais" },
  { id: "husary", label: "Mahmoud Al-Husary" },
  { id: "minshawi", label: "Muhammad al-Minshawi" },
];

function calculateStreak(days: string[]) {
  const unique = new Set(days);
  const cursor = new Date();
  const today = cursor.toISOString().slice(0, 10);
  if (!unique.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let count = 0;
  while (unique.has(cursor.toISOString().slice(0, 10))) {
    count += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return count;
}

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
  const [translation, setTranslation] = useState("en.sahih");
  const [reciter, setReciter] = useState("alafasy");
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [studyPanel, setStudyPanel] = useState<StudyPanel | null>(null);
  const [verseResults, setVerseResults] = useState<QuranSearchResult[]>([]);
  const [searchingVerses, setSearchingVerses] = useState(false);
  const [pendingAyah, setPendingAyah] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [readingStreak, setReadingStreak] = useState(0);
  const initialScrollDone = useRef(false);

  const rememberAyah = useCallback((ayah: number) => {
    if (!detail) return;
    window.localStorage.setItem("noor-quran-progress-v1", JSON.stringify({ surah: detail.number, ayah, englishName: detail.englishName, updatedAt: new Date().toISOString() }));
    try {
      const previous = JSON.parse(window.localStorage.getItem("noor-quran-reading-days-v1") ?? "[]") as string[];
      const today = new Date().toISOString().slice(0, 10);
      const next = Array.from(new Set([...previous, today])).slice(-366);
      window.localStorage.setItem("noor-quran-reading-days-v1", JSON.stringify(next));
      setReadingStreak(calculateStreak(next));
    } catch { /* reading still works if storage is unavailable */ }
  }, [detail]);

  useEffect(() => {
    const saved = readSavedList(SAVED_KEYS.quranVerses);
    const timer = window.setTimeout(() => {
      setBookmarks(saved);
      try {
        const preferences = JSON.parse(window.localStorage.getItem("noor-quran-preferences-v1") ?? "{}") as { translation?: string; reciter?: string };
        if (TRANSLATIONS.some((item) => item.id === preferences.translation)) setTranslation(preferences.translation as string);
        if (RECITERS.some((item) => item.id === preferences.reciter)) setReciter(preferences.reciter as string);
        const savedNotes = JSON.parse(window.localStorage.getItem("noor-quran-notes-v1") ?? "{}") as Record<string, string>;
        if (savedNotes && typeof savedNotes === "object") setNotes(savedNotes);
        const readingDays = JSON.parse(window.localStorage.getItem("noor-quran-reading-days-v1") ?? "[]") as string[];
        if (Array.isArray(readingDays)) setReadingStreak(calculateStreak(readingDays));
      } catch { /* keep accessible defaults */ }
      setPreferencesReady(true);
    }, 0);
    fetch("/api/quran/surahs")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { surahs?: SurahSummary[] }) => { if (Array.isArray(data.surahs)) setSurahs(data.surahs); })
      .catch(() => undefined);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    window.localStorage.setItem("noor-quran-preferences-v1", JSON.stringify({ translation, reciter }));
  }, [preferencesReady, translation, reciter]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/quran/surah/${selected}?translation=${encodeURIComponent(translation)}&reciter=${encodeURIComponent(reciter)}`, { signal: controller.signal })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }: { ok: boolean; data: { surah?: SurahDetail; error?: string } }) => {
        if (!ok || !data.surah) throw new Error(data.error ?? "Surah unavailable");
        setDetail(data.surah);
      })
      .catch((reason: Error) => { if (reason.name !== "AbortError") setError(reason.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [selected, requestVersion, translation, reciter]);

  useEffect(() => {
    if (!detail) return;
    const ayah = initialAyah && initialAyah <= detail.ayahs.length ? initialAyah : 1;
    window.localStorage.setItem("noor-quran-progress-v1", JSON.stringify({ surah: detail.number, ayah, englishName: detail.englishName, updatedAt: new Date().toISOString() }));
  }, [detail, initialAyah]);

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

  const activeAyahNumber = current?.kind === "quran" && current.id === `quran-${detail?.number}-${reciter}` ? quranPlayback.activeVerseNumber : null;

  useEffect(() => {
    if (!activeAyahNumber || !autoFollow || !quranPlayback.isPlaying) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`ayah-${activeAyahNumber}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeAyahNumber, autoFollow, quranPlayback.isPlaying]);

  useEffect(() => {
    if (!activeAyahNumber || !detail) return;
    window.localStorage.setItem("noor-quran-progress-v1", JSON.stringify({ surah: detail.number, ayah: activeAyahNumber, englishName: detail.englishName, updatedAt: new Date().toISOString() }));
  }, [activeAyahNumber, detail]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return surahs;
    return surahs.filter((surah) => `${surah.number} ${surah.englishName} ${surah.englishNameTranslation} ${surah.name}`.toLowerCase().includes(term));
  }, [query, surahs]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearchingVerses(true);
      fetch(`/api/quran/search?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((payload: { results?: QuranSearchResult[] }) => setVerseResults(Array.isArray(payload.results) ? payload.results : []))
        .catch(() => { if (!controller.signal.aborted) setVerseResults([]); })
        .finally(() => { if (!controller.signal.aborted) setSearchingVerses(false); });
    }, 260);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    if (!detail || !pendingAyah) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`ayah-${pendingAyah}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      rememberAyah(pendingAyah);
      setPendingAyah(null);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [detail, pendingAyah, rememberAyah]);

  const chooseSurah = (number: number) => {
    setLoading(true);
    setError("");
    if (number === selected) setRequestVersion((value) => value + 1);
    else setSelected(number);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseVerseResult = (result: QuranSearchResult) => {
    setPendingAyah(result.ayah);
    setQuery("");
    setVerseResults([]);
    setLoading(true);
    setError("");
    if (result.surah === selected) setRequestVersion((value) => value + 1);
    else setSelected(result.surah);
  };

  const jumpToAyah = (number: string) => {
    document.getElementById(`ayah-${number}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    rememberAyah(Number(number));
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

  const openStudy = (type: "words" | "tafsir", ayah: Ayah) => {
    const reference = `${selected}:${ayah.number}`;
    setStudyPanel({ type, reference, title: type === "words" ? "Word-by-word meaning" : "Tafsir", loading: true, error: "", text: "", words: [] });
    rememberAyah(ayah.number);
    const endpoint = type === "words" ? `/api/quran/words/${selected}/${ayah.number}` : `/api/quran/tafsir/${selected}/${ayah.number}`;
    fetch(endpoint)
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }: { ok: boolean; data: { error?: string; words?: WordMeaning[]; text?: string; title?: string; truncated?: boolean } }) => {
        if (!ok) throw new Error(data.error ?? "Study resource unavailable");
        setStudyPanel({ type, reference, title: data.title ?? (type === "words" ? "Word-by-word meaning" : "Tafsir"), loading: false, error: "", text: data.text ?? "", words: data.words ?? [], truncated: data.truncated });
      })
      .catch((reason: Error) => setStudyPanel((current) => current ? { ...current, loading: false, error: reason.message } : null));
  };

  const openNote = (ayah: Ayah) => {
    const reference = `${selected}:${ayah.number}`;
    rememberAyah(ayah.number);
    setStudyPanel({ type: "note", reference, title: "Private Ayah note", loading: false, error: "", text: notes[reference] ?? "", words: [] });
  };

  const saveNote = () => {
    if (!studyPanel || studyPanel.type !== "note") return;
    const clean = studyPanel.text.trim();
    const next = { ...notes };
    if (clean) next[studyPanel.reference] = clean;
    else delete next[studyPanel.reference];
    setNotes(next);
    window.localStorage.setItem("noor-quran-notes-v1", JSON.stringify(next));
    setNotice(clean ? `Note saved for ${studyPanel.reference}` : `Note removed from ${studyPanel.reference}`);
    setStudyPanel(null);
    window.setTimeout(() => setNotice(""), 1800);
  };

  return (
    <div className="quran-reader">
      <aside className="quran-sidebar">
        <div className="quran-sidebar-head"><span>114 SURAHS · ALL AYAHS</span><strong>Find Quran</strong><input type="search" placeholder="Surah, 2:255, mercy or Arabic…" value={query} onChange={(event) => { const next = event.target.value; setQuery(next); if (next.trim().length < 2) { setVerseResults([]); setSearchingVerses(false); } }} aria-label="Search Surahs, Ayahs, topics or Arabic words" /></div>
        {query.trim().length >= 2 ? <div className="quran-verse-results" aria-live="polite"><span>{searchingVerses ? "SEARCHING QURAN…" : `${verseResults.length} AYAH RESULTS`}</span>{verseResults.map((result) => <button type="button" onClick={() => chooseVerseResult(result)} key={`${result.surah}:${result.ayah}`}><strong>{result.title}</strong><small>{result.excerpt}</small></button>)}</div> : null}
        <div className="quran-surah-list">{filtered.map((surah) => <button className={selected === surah.number ? "active" : ""} type="button" key={surah.number} onClick={() => chooseSurah(surah.number)}><span>{surah.number}</span><div><strong>{surah.englishName}</strong><small>{surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs</small></div><b lang="ar" dir="rtl">{surah.name}</b></button>)}</div>
      </aside>

      <section className="quran-reading-panel">
        <div className="quran-reader-tools">
          <label><span>Jump to Ayah</span><select onChange={(event) => jumpToAyah(event.target.value)} defaultValue=""><option value="" disabled>Choose</option>{detail?.ayahs.map((ayah) => <option value={ayah.number} key={ayah.number}>{detail.number}:{ayah.number}</option>)}</select></label>
          <label><span>Translation</span><select value={translation} onChange={(event) => { setLoading(true); setError(""); setTranslation(event.target.value); }}>{TRANSLATIONS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
          <label><span>Reciter</span><select value={reciter} onChange={(event) => { setLoading(true); setError(""); setReciter(event.target.value); }}>{RECITERS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
          <label><span>Arabic size</span><input type="range" min="27" max="54" value={arabicSize} onChange={(event) => setArabicSize(Number(event.target.value))} /></label>
          <div className="quran-tool-actions"><button className={autoFollow ? "active" : ""} type="button" onClick={() => setAutoFollow((value) => !value)}>{autoFollow ? "Auto-follow on" : "Auto-follow off"}</button><button className={showMeaning ? "active" : ""} type="button" onClick={() => setShowMeaning((value) => !value)}>{showMeaning ? "Translation on" : "Translation off"}</button></div>
        </div>

        {loading && <div className="quran-loading"><span/><span/><span/></div>}
        {error && <div className="quran-error"><strong>Reader temporarily unavailable</strong><p>{error}</p><button type="button" onClick={() => chooseSurah(selected)}>Try again</button></div>}
        {!loading && !error && detail && <>
          <header className="quran-surah-hero"><p>SURAH {detail.number} · {detail.revelationType.toUpperCase()}</p><h1>{detail.englishName}</h1><span>{detail.meaning} · {detail.ayahs.length} Ayahs</span><b lang="ar" dir="rtl">{detail.name}</b></header>
          <section className="quran-surah-player" aria-label={`Full recitation of Surah ${detail.englishName}`}>
            <div><span>FULL SURAH RECITATION</span><strong>Play {detail.englishName} from beginning to end</strong><small>{detail.audio.reciterName ?? RECITERS.find((item) => item.id === reciter)?.label} · continuous recording{detail.audio.verseTimings.length ? " · timed Ayah follow" : ""}</small></div>
            <button type="button" onClick={() => play({ kind: "quran", id: `quran-${detail.number}-${reciter}`, title: `Surah ${detail.englishName}`, subtitle: `${detail.audio.reciterName ?? "Quran recitation"} · full Surah`, src: detail.audio.src, surahNumber: detail.number, verseTimings: detail.audio.verseTimings, verses: detail.ayahs.map(({ number, arabic, english }) => ({ number, arabic, english })) })}>
              <span aria-hidden="true">▶</span>{current?.id === `quran-${detail.number}-${reciter}` ? `Playing · Ayah ${activeAyahNumber ?? 1}` : "Play full Surah with auto-follow"}
            </button>
          </section>
          <div className="quran-attribution"><span>Arabic Uthmani text</span><span>Meaning: {TRANSLATIONS.find((item) => item.id === translation)?.label}</span><span>Audio: {detail.audio.reciterName ?? RECITERS.find((item) => item.id === reciter)?.label}</span><span>Reading position is saved privately on this device</span><span>{readingStreak ? `${readingStreak}-day reading streak` : "Read today to begin a streak"}</span></div>
          <div className="ayah-list">{detail.ayahs.map((ayah) => {
            const key = `${detail.number}:${ayah.number}`;
            const saved = bookmarks.includes(key);
            const active = ayah.number === activeAyahNumber;
            const progressStyle = active ? ({ "--ayah-progress": `${Math.round(quranPlayback.verseProgress * 100)}%` } as CSSProperties) : undefined;
            return <article className={`ayah-card${active ? " is-playing" : ""}`} id={`ayah-${ayah.number}`} key={ayah.number} aria-current={active ? "true" : undefined} style={progressStyle}>
              <div className="ayah-toolbar"><span>{detail.number}:{ayah.number}</span><div><small>Juz {ayah.juz || "—"} · Page {ayah.page || "—"}</small><button type="button" onClick={() => openStudy("words", ayah)}>Words</button><button type="button" onClick={() => openStudy("tafsir", ayah)}>Tafsir</button><button className={notes[key] ? "saved" : ""} type="button" onClick={() => openNote(ayah)}>{notes[key] ? "Noted" : "Note"}</button><button type="button" onClick={() => copyAyah(ayah)} aria-label={`Copy verse ${key}`}>Copy</button><button className={saved ? "saved" : ""} type="button" onClick={() => toggleBookmark(ayah.number)} aria-label={`${saved ? "Remove" : "Save"} verse ${key}`}>{saved ? "Saved" : "Save"}</button></div></div>
              <p className="ayah-arabic" lang="ar" dir="rtl" style={{ fontSize: `${arabicSize}px` }}>{ayah.arabic}</p>
              {showMeaning && <p className="ayah-meaning"><span>{ayah.number}</span>{ayah.english}</p>}
            </article>;
          })}</div>
        </>}
      </section>
      {notice && <div className="quran-notice" role="status">{notice}</div>}
      {studyPanel ? <div className="quran-study-overlay" role="dialog" aria-modal="true" aria-labelledby="quran-study-title">
        <button className="quran-study-backdrop" type="button" onClick={() => setStudyPanel(null)} aria-label="Close study panel" />
        <section className="quran-study-panel">
          <header><div><span>{studyPanel.reference}</span><h2 id="quran-study-title">{studyPanel.title}</h2></div><button type="button" onClick={() => setStudyPanel(null)} aria-label="Close study panel">×</button></header>
          {studyPanel.loading ? <div className="quran-study-loading">Loading trusted study material…</div> : null}
          {studyPanel.error ? <div className="quran-error"><strong>Study resource unavailable</strong><p>{studyPanel.error}</p></div> : null}
          {!studyPanel.loading && !studyPanel.error && studyPanel.type === "words" ? <div className="quran-word-grid">{studyPanel.words.map((word) => <article key={word.position}><b lang="ar" dir="rtl">{word.arabic}</b><strong>{word.meaning}</strong><small>{word.transliteration}</small></article>)}</div> : null}
          {!studyPanel.loading && !studyPanel.error && studyPanel.type === "tafsir" ? <div className="quran-tafsir-text">{studyPanel.text.split("\n").filter(Boolean).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 18)}`}>{paragraph}</p>)}{studyPanel.truncated ? <small>This abridged panel shows the opening portion of the source commentary.</small> : null}</div> : null}
          {studyPanel.type === "note" ? <div className="quran-note-editor"><label htmlFor="quran-note">Your reflection</label><textarea id="quran-note" value={studyPanel.text} onChange={(event) => setStudyPanel({ ...studyPanel, text: event.target.value })} placeholder="Write a private note about this Ayah…" maxLength={3000} autoFocus/><small>Saved only on this device · {studyPanel.text.length}/3000</small></div> : null}
          <footer><span>{studyPanel.type === "note" ? "Private device note" : "Source: Quran Foundation"}</span><button type="button" onClick={studyPanel.type === "note" ? saveNote : () => setStudyPanel(null)}>{studyPanel.type === "note" ? "Save note" : "Done"}</button></footer>
        </section>
      </div> : null}
    </div>
  );
}
