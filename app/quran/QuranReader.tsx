"use client";
import { personalStorage } from "@/lib/personal-storage";

import NoorSelect from "../site/NoorSelect";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import CompletionPlan from "./CompletionPlan";
import { useNoorCopy } from "../site/SiteUtilities";
import ReadingGoal from "./ReadingGoal";
import PracticeControls from "./PracticeControls";
import { JUZ_STARTS } from "@/lib/quran-structure";
import DownloadButton from "../offline/DownloadButton";
import { useMediaPlayer, type MediaItem } from "../media/MediaProvider";
import { readSavedList, SAVED_KEYS, writeSavedList } from "../site/saved-items";

type SurahSummary = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};
type Ayah = {
  number: number;
  arabic: string;
  english: string;
  juz: number;
  page: number;
};
type VerseTiming = {
  number: number;
  from: number;
  to: number;
  duration: number;
};
type SurahDetail = {
  number: number;
  name: string;
  englishName: string;
  meaning: string;
  revelationType: string;
  ayahs: Ayah[];
  audio: {
    src: string;
    duration: number;
    verseTimings: VerseTiming[];
    reciterId?: string;
    reciterName?: string;
  };
};
type WordMeaning = {
  position: number;
  arabic: string;
  meaning: string;
  transliteration: string;
};
type StudyPanel = {
  type: "words" | "tafsir" | "note";
  reference: string;
  title: string;
  loading: boolean;
  error: string;
  text: string;
  words: WordMeaning[];
  truncated?: boolean;
};
type QuranSearchResult = {
  surah: number;
  ayah: number;
  title: string;
  excerpt: string;
};

const TRANSLATIONS = [
  { id: "en.sahih", label: "Saheeh International" },
  { id: "en.pickthall", label: "Pickthall" },
  { id: "ur.jalandhry", label: "Urdu · Jalandhry" },
  { id: "hi.hindi", label: "Hindi · Farooq Khan & Nadwi" },
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
  {
    number: 1,
    name: "ٱلْفَاتِحَة",
    englishName: "Al-Faatiha",
    englishNameTranslation: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan",
  },
  {
    number: 2,
    name: "ٱلْبَقَرَة",
    englishName: "Al-Baqara",
    englishNameTranslation: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan",
  },
  {
    number: 18,
    name: "ٱلْكَهْف",
    englishName: "Al-Kahf",
    englishNameTranslation: "The Cave",
    numberOfAyahs: 110,
    revelationType: "Meccan",
  },
  {
    number: 36,
    name: "يس",
    englishName: "Yaseen",
    englishNameTranslation: "Ya Sin",
    numberOfAyahs: 83,
    revelationType: "Meccan",
  },
  {
    number: 55,
    name: "ٱلرَّحْمَٰن",
    englishName: "Ar-Rahmaan",
    englishNameTranslation: "The Beneficent",
    numberOfAyahs: 78,
    revelationType: "Medinan",
  },
  {
    number: 67,
    name: "ٱلْمُلْك",
    englishName: "Al-Mulk",
    englishNameTranslation: "The Sovereignty",
    numberOfAyahs: 30,
    revelationType: "Meccan",
  },
  {
    number: 112,
    name: "ٱلْإِخْلَاص",
    englishName: "Al-Ikhlaas",
    englishNameTranslation: "Sincerity",
    numberOfAyahs: 4,
    revelationType: "Meccan",
  },
];

function surahMediaItem(detail: SurahDetail, reciter: string): MediaItem {
  return {
    kind: "quran",
    id: `quran-${detail.number}-${reciter}`,
    title: `Surah ${detail.englishName}`,
    subtitle: `${detail.audio.reciterName ?? "Quran recitation"} · full Surah`,
    src: detail.audio.src,
    surahNumber: detail.number,
    verseTimings: detail.audio.verseTimings,
    verses: detail.ayahs.map(({ number, arabic, english }) => ({ number, arabic, english })),
  };
}

export default function QuranReader({
  initialSurah = 1,
  initialAyah = null,
  resume = false,
}: {
  initialSurah?: number;
  initialAyah?: number | null;
  resume?: boolean;
}) {
  const { t } = useNoorCopy();
  const { current, play, close, quranPlayback } = useMediaPlayer();
  const pendingReciterPlayback = useRef<{ surah: number; reciter: string } | null>(null);
  const [surahs, setSurahs] = useState<SurahSummary[]>(fallbackSurahs);
  const [selected, setSelected] = useState(initialSurah);
  const [requestVersion, setRequestVersion] = useState(0);
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMeaning, setShowMeaning] = useState(true);
  const [readerMode, setReaderMode] = useState<"Reading" | "Listening" | "Study">("Reading");
  const settingsId = useId();
  const [settingsOpen, setSettingsOpen] = useState(false);
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
  const [pendingAyah, setPendingAyah] = useState<number | null>(initialAyah);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [readingStreak, setReadingStreak] = useState(0);
  const studyRef = useRef<HTMLDivElement>(null);
  const studyRequest = useRef<AbortController | null>(null);
  const closeStudy = useCallback(() => { studyRequest.current?.abort(); setStudyPanel(null); }, []);
  useEffect(() => () => studyRequest.current?.abort(), []);
  const studyOpen = Boolean(studyPanel);
  useEffect(() => {
    if (!studyOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = studyRef.current;
    const elements = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex="0"]',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));
    elements()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeStudy();
      }
      if (event.key === "Tab") {
        const items = elements();
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [studyOpen, closeStudy]);

  const rememberAyah = useCallback(
    (ayah: number) => {
      if (
        !detail ||
        !Number.isInteger(ayah) ||
        ayah < 1 ||
        ayah > detail.ayahs.length
      )
        return;
      try {
        personalStorage.setItem(
          "noor-quran-progress-v1",
          JSON.stringify({
            surah: detail.number,
            ayah,
            englishName: detail.englishName,
            updatedAt: new Date().toISOString(),
          }),
        );
      } catch {
        /* reader remains usable without storage */
      }
      const url = new URL(window.location.href);
      url.searchParams.set("surah", String(detail.number));
      url.searchParams.set("ayah", String(ayah));
      window.history.replaceState(null, "", url);
      try {
        const previous = JSON.parse(
          personalStorage.getItem("noor-quran-reading-days-v1") ?? "[]",
        ) as string[];
        const today = new Date().toISOString().slice(0, 10);
        const next = Array.from(new Set([...previous, today])).slice(-366);
        personalStorage.setItem(
          "noor-quran-reading-days-v1",
          JSON.stringify(next),
        );
        setReadingStreak(calculateStreak(next));
        const localDay = new Date().toLocaleDateString("en-CA");
        const history = JSON.parse(
          personalStorage.getItem("noor-read-ayahs-v1") ?? "{}",
        );
        const references = Array.isArray(history[localDay])
          ? history[localDay]
          : [];
        const record = {
          [localDay]: [...new Set([...references, detail.number + ":" + ayah])],
        };
        personalStorage.setItem("noor-read-ayahs-v1", JSON.stringify(record));
        window.dispatchEvent(new Event("noor:quran-progress"));
      } catch {
        /* reading still works if storage is unavailable */
      }
    },
    [detail],
  );

  useEffect(() => {
    const saved = readSavedList(SAVED_KEYS.quranVerses);
    const timer = window.setTimeout(() => {
      setBookmarks(saved);
      try {
        const preferences = JSON.parse(
          personalStorage.getItem("noor-quran-preferences-v1") ?? "{}",
        ) as { translation?: string; reciter?: string };
        if (TRANSLATIONS.some((item) => item.id === preferences.translation))
          setTranslation(preferences.translation as string);
        if (RECITERS.some((item) => item.id === preferences.reciter))
          setReciter(preferences.reciter as string);
        const savedNotes = JSON.parse(
          personalStorage.getItem("noor-quran-notes-v1") ?? "{}",
        ) as Record<string, string>;
        if (savedNotes && typeof savedNotes === "object") setNotes(savedNotes);
        const readingDays = JSON.parse(
          personalStorage.getItem("noor-quran-reading-days-v1") ?? "[]",
        ) as string[];
        if (Array.isArray(readingDays))
          setReadingStreak(calculateStreak(readingDays));
      } catch {
        /* keep accessible defaults */
      }
      const url = new URL(window.location.href);
      const requestedSurah = Number(url.searchParams.get("surah"));
      const requestedAyah = Number(url.searchParams.get("ayah"));
      if (requestedSurah >= 1 && requestedSurah <= 114) {
        setSelected(requestedSurah);
        if (requestedAyah > 0) setPendingAyah(requestedAyah);
      } else if (resume) {
        try {
          const progress = JSON.parse(
            personalStorage.getItem("noor-quran-progress-v1") ?? "null",
          );
          if (progress && progress.surah >= 1 && progress.surah <= 114) {
            setSelected(progress.surah);
            setPendingAyah(progress.ayah);
          }
        } catch {
          /* start at Al-Fatihah */
        }
      }
      const requestedTranslation = url.searchParams.get("translation");
      const requestedReciter = url.searchParams.get("reciter");
      if (TRANSLATIONS.some((item) => item.id === requestedTranslation))
        setTranslation(requestedTranslation!);
      if (RECITERS.some((item) => item.id === requestedReciter))
        setReciter(requestedReciter!);
      setPreferencesReady(true);
    }, 0);
    fetch("/api/quran/surahs")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { surahs?: SurahSummary[] }) => {
        if (Array.isArray(data.surahs)) setSurahs(data.surahs);
      })
      .catch(() => undefined);
    return () => window.clearTimeout(timer);
  }, [resume]);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      personalStorage.setItem(
        "noor-quran-preferences-v1",
        JSON.stringify({ translation, reciter }),
      );
    } catch {
      /* preferences are optional */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("translation", translation);
    url.searchParams.set("reciter", reciter);
    history.replaceState(null, "", url);
  }, [preferencesReady, translation, reciter]);

  useEffect(() => {
    if (!preferencesReady) return;
    const controller = new AbortController();
    fetch(
      `/api/quran/surah/${selected}?translation=${encodeURIComponent(translation)}&reciter=${encodeURIComponent(reciter)}`,
      { signal: controller.signal },
    )
      .then((response) =>
        response.json().then((data) => ({ ok: response.ok, data })),
      )
      .then(
        ({
          ok,
          data,
        }: {
          ok: boolean;
          data: { surah?: SurahDetail; error?: string };
        }) => {
          if (controller.signal.aborted) return;
          if (!ok || !data.surah)
            throw new Error(data.error ?? "Surah unavailable");
          setDetail(data.surah);
          const pending = pendingReciterPlayback.current;
          if (pending?.surah === selected && pending.reciter === reciter) {
            pendingReciterPlayback.current = null;
            play(surahMediaItem(data.surah, reciter));
          }
        },
      )
      .catch((reason: Error) => {
        if (!controller.signal.aborted) {
          pendingReciterPlayback.current = null;
          setError(reason.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selected, requestVersion, translation, reciter, preferencesReady, play]);

  const activeAyahNumber =
    current?.kind === "quran" &&
    current.id === `quran-${detail?.number}-${reciter}`
      ? quranPlayback.activeVerseNumber
      : null;

  useEffect(() => {
    if (!activeAyahNumber || !autoFollow || !quranPlayback.isPlaying) return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(`ayah-${activeAyahNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeAyahNumber, autoFollow, quranPlayback.isPlaying]);

  useEffect(() => {
    if (!activeAyahNumber || !detail) return;
    try { personalStorage.setItem(
      "noor-quran-progress-v1",
      JSON.stringify({
        surah: detail.number,
        ayah: activeAyahNumber,
        englishName: detail.englishName,
        updatedAt: new Date().toISOString(),
      }),
    );
    } catch { /* Audio remains usable when browser storage is blocked. */ }
  }, [activeAyahNumber, detail]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return surahs;
    return surahs.filter((surah) =>
      `${surah.number} ${surah.englishName} ${surah.englishNameTranslation} ${surah.name}`
        .toLowerCase()
        .includes(term),
    );
  }, [query, surahs]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearchingVerses(true);
      fetch(`/api/quran/search?q=${encodeURIComponent(term)}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((payload: { results?: QuranSearchResult[] }) =>
          setVerseResults(
            Array.isArray(payload.results) ? payload.results : [],
          ),
        )
        .catch(() => {
          if (!controller.signal.aborted) setVerseResults([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearchingVerses(false);
        });
    }, 260);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!detail || detail.number !== selected || !pendingAyah || loading)
      return;
    let cancelled = false;
    let frame = 0;
    const timer = window.setTimeout(() => {
      void document.fonts.ready.then(() => {
        if (cancelled) return;
        frame = requestAnimationFrame(() => {
          if (cancelled) return;
          document
            .getElementById(`ayah-${pendingAyah}`)
            ?.scrollIntoView({ behavior: "instant", block: "start" });
          rememberAyah(pendingAyah);
          setPendingAyah(null);
        });
      });
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [detail, selected, pendingAyah, loading, rememberAyah]);

  useEffect(() => {
    if (!detail || loading || pendingAyah) return;
    let userScrolled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const markInput = () => {
      userScrolled = true;
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        [
          "PageDown",
          "PageUp",
          "ArrowDown",
          "ArrowUp",
          " ",
          "Home",
          "End",
        ].includes(event.key) &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement) &&
        !(event.target instanceof HTMLSelectElement)
      )
        markInput();
    };
    const onScroll = () => {
      if (!userScrolled) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const card = [
          ...document.querySelectorAll<HTMLElement>(".ayah-card"),
        ].find((item) => {
          const rect = item.getBoundingClientRect();
          return rect.bottom > 120 && rect.top < window.innerHeight;
        });
        if (card) rememberAyah(Number(card.id.replace("ayah-", "")));
        userScrolled = false;
      }, 600);
    };
    window.addEventListener("wheel", markInput, { passive: true });
    window.addEventListener("touchmove", markInput, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", markInput);
      window.removeEventListener("touchmove", markInput);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [detail, loading, pendingAyah, rememberAyah]);

  const chooseSurah = (number: number) => {
    setLoading(true);
    setError("");
    setPendingAyah(1);
    if (number === selected) setRequestVersion((value) => value + 1);
    else setSelected(number);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseVerseResult = (result: QuranSearchResult) => {
    closeStudy();
    setPendingAyah(result.ayah);
    setQuery("");
    setVerseResults([]);
    setLoading(true);
    setError("");
    if (result.surah === selected) setRequestVersion((value) => value + 1);
    else setSelected(result.surah);
  };

  const jumpToAyah = (number: string) => {
    document
      .getElementById(`ayah-${number}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    rememberAyah(Number(number));
  };

  const toggleBookmark = (ayah: number) => {
    const key = `${selected}:${ayah}`;
    const current = readSavedList(SAVED_KEYS.quranVerses);
    const next = current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key];
    if (!writeSavedList(SAVED_KEYS.quranVerses, next)) return;
    setBookmarks(next);
    setNotice(next.includes(key) ? `Saved ${key}` : `Removed ${key}`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const copyAyah = async (ayah: Ayah) => {
    try {
      await navigator.clipboard.writeText(`${ayah.arabic}\n${ayah.english}\nQuran ${selected}:${ayah.number}`);
      setNotice(`Copied ${selected}:${ayah.number}`);
    } catch { setNotice("Copy is unavailable. Select the verse text to copy it manually."); }
    window.setTimeout(() => setNotice(""), 4000);
  };

  const openStudy = (type: "words" | "tafsir", ayah: Ayah) => {
    studyRequest.current?.abort();
    const controller = new AbortController();
    studyRequest.current = controller;
    const reference = `${selected}:${ayah.number}`;
    setStudyPanel({
      type,
      reference,
      title: type === "words" ? "Word-by-word meaning" : "Tafsir",
      loading: true,
      error: "",
      text: "",
      words: [],
    });
    rememberAyah(ayah.number);
    const endpoint =
      type === "words"
        ? `/api/quran/words/${selected}/${ayah.number}`
        : `/api/quran/tafsir/${selected}/${ayah.number}`;
    fetch(endpoint, { signal: controller.signal })
      .then((response) =>
        response.json().then((data) => ({ ok: response.ok, data })),
      )
      .then(
        ({
          ok,
          data,
        }: {
          ok: boolean;
          data: {
            error?: string;
            words?: WordMeaning[];
            text?: string;
            title?: string;
            truncated?: boolean;
          };
        }) => {
          if (controller.signal.aborted) return;
          if (!ok) throw new Error(data.error ?? "Study resource unavailable");
          setStudyPanel({
            type,
            reference,
            title:
              data.title ??
              (type === "words" ? "Word-by-word meaning" : "Tafsir"),
            loading: false,
            error: "",
            text: data.text ?? "",
            words: data.words ?? [],
            truncated: data.truncated,
          });
        },
      )
      .catch((reason: Error) => {
        if (controller.signal.aborted) return;
        setStudyPanel((current) => current?.reference === reference && current.type === type
          ? { ...current, loading: false, error: reason.message } : current);
      });
  };

  const openNote = (ayah: Ayah) => {
    studyRequest.current?.abort();
    const reference = `${selected}:${ayah.number}`;
    rememberAyah(ayah.number);
    setStudyPanel({
      type: "note",
      reference,
      title: "Private Ayah note",
      loading: false,
      error: "",
      text: notes[reference] ?? "",
      words: [],
    });
  };

  const saveNote = () => {
    if (!studyPanel || studyPanel.type !== "note") return;
    const clean = studyPanel.text.trim();
    const next = { ...notes };
    if (clean) next[studyPanel.reference] = clean;
    else delete next[studyPanel.reference];
    try {
      personalStorage.setItem("noor-quran-notes-v1", JSON.stringify(next));
    } catch {
      setStudyPanel({ ...studyPanel, error: "This browser could not save your note. Keep a copy before closing." });
      return;
    }
    setNotes(next);
    setNotice(
      clean
        ? `Note saved for ${studyPanel.reference}`
        : `Note removed from ${studyPanel.reference}`,
    );
    setStudyPanel(null);
    window.setTimeout(() => setNotice(""), 1800);
  };

  return (
    <div className={`quran-reader quran-mode-${readerMode.toLowerCase()}`}>
      <aside className="quran-sidebar">
        <div className="quran-sidebar-head">
          <span>114 SURAHS · ALL AYAHS</span>
          <strong>Find Quran</strong>
          <input
            type="search"
            placeholder="Surah, 2:255, mercy or Arabic…"
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              if (next.trim().length < 2) {
                setVerseResults([]);
                setSearchingVerses(false);
              }
            }}
            aria-label="Search Surahs, Ayahs, topics or Arabic words"
          />
        </div>
        {query.trim().length >= 2 ? (
          <div className="quran-verse-results" aria-live="polite">
            <span>
              {searchingVerses
                ? "SEARCHING QURAN…"
                : `${verseResults.length} AYAH RESULTS`}
            </span>
            {verseResults.map((result) => (
              <button
                type="button"
                onClick={() => chooseVerseResult(result)}
                key={`${result.surah}:${result.ayah}`}
              >
                <strong>{result.title}</strong>
                <small>{result.excerpt}</small>
              </button>
            ))}
          </div>
        ) : null}
        <div className="quran-surah-list">
          {filtered.map((surah) => (
            <button
              className={selected === surah.number ? "active" : ""}
              type="button"
              key={surah.number}
              onClick={() => chooseSurah(surah.number)}
            >
              <span>{surah.number}</span>
              <div>
                <strong>{surah.englishName}</strong>
                <small>
                  {surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs
                </small>
              </div>
              <b lang="ar" dir="rtl">
                {surah.name}
              </b>
            </button>
          ))}
        </div>
      </aside>

      <section className="quran-reading-panel">
        <div className="quran-reader-toolbar">
          <div className="quran-mode-switch" role="group" aria-label={t("Reader mode")}>
            {(["Reading", "Listening", "Study"] as const).map((mode) => <button type="button" key={mode} aria-pressed={readerMode === mode} onClick={() => setReaderMode(mode)}>{t(mode)}</button>)}
          </div>
          <button className="quran-settings-toggle" type="button" aria-expanded={settingsOpen} aria-controls={settingsId} onClick={() => setSettingsOpen(value => !value)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/></svg>
            {t("Settings")}
          </button>
        </div>
        <div className="quran-quick-controls">
          <label><span>{t("Juz")}</span><NoorSelect aria-label="Jump to Juz" value="" onChange={(event) => {
            const start = JUZ_STARTS[Number(event.target.value) - 1];
            if (start) chooseVerseResult({ surah: start.surah, ayah: start.ayah, title: `Juz ${start.juz}`, excerpt: "" });
          }}><option value="" disabled>{t("Choose Juz")}</option>{JUZ_STARTS.map((start) => <option key={start.juz} value={start.juz}>Juz {start.juz} · {start.surah}:{start.ayah}</option>)}</NoorSelect></label>
          <label>
            <span>{t("Ayah")}</span>
            <NoorSelect aria-label={t("Jump to Ayah")}
              onChange={(event) => jumpToAyah(event.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                {t("Choose Ayah")}
              </option>
              {detail?.ayahs.map((ayah) => (
                <option value={ayah.number} key={ayah.number}>
                  {detail.number}:{ayah.number}
                </option>
              ))}
            </NoorSelect>
          </label>
          <label>
            <span>{t("Reciter")}</span>
            <NoorSelect aria-label={t("Reciter")}
              value={reciter}
              onChange={(event) => {
                const nextReciter = event.target.value;
                const switchingCurrentSurah = current?.kind === "quran" && current.surahNumber === selected;
                // Stop the old voice immediately; resume the new voice once loaded
                // only when the listener was already playing this Surah.
                const resumePlayback = (switchingCurrentSurah && quranPlayback.isPlaying) ||
                  pendingReciterPlayback.current?.surah === selected;
                pendingReciterPlayback.current = resumePlayback ? { surah: selected, reciter: nextReciter } : null;
                if (switchingCurrentSurah) close();
                setLoading(true);
                setError("");
                setReciter(nextReciter);
              }}
            >
              {RECITERS.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </NoorSelect>
          </label>
        </div>
        <section id={settingsId} className="quran-settings-panel" aria-label={t("Reader settings")} hidden={!settingsOpen}>
          <div className="quran-reader-tools">
          <label>
            <span>{t("Translation")}</span>
            <NoorSelect aria-label={t("Translation")}
              value={translation}
              onChange={(event) => {
                setLoading(true);
                setError("");
                setTranslation(event.target.value);
              }}
            >
              {TRANSLATIONS.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </NoorSelect>
          </label>
          <label>
            <span>{t("Arabic size")}</span>
            <input
              type="range"
              min="27"
              max="54"
              value={arabicSize}
              onChange={(event) => setArabicSize(Number(event.target.value))}
            />
          </label>
          <div className="quran-tool-actions">
            <button
              className={
                autoFollow && detail?.audio.verseTimings.length ? "active" : ""
              }
              type="button"
              disabled={!detail?.audio.verseTimings.length}
              onClick={() => setAutoFollow((value) => !value)}
            >
              {!detail?.audio.verseTimings.length
                ? "Ayah timing unavailable"
                : autoFollow
                  ? "Auto-follow on"
                  : "Auto-follow off"}
            </button>
            <button
              className={showMeaning ? "active" : ""}
              type="button"
              onClick={() => setShowMeaning((value) => !value)}
            >
              {showMeaning ? "Translation on" : "Translation off"}
            </button>
          </div>
          </div>
          <div className="quran-reading-plans"><ReadingGoal /><CompletionPlan /></div>
          {!loading && !error && detail ? <DownloadButton surah={detail.number} translation={translation} reciter={reciter} /> : null}
        </section>

        {loading && (
          <div className="quran-loading">
            <span />
            <span />
            <span />
          </div>
        )}
        {error && (
          <div className="quran-error">
            <strong>Reader temporarily unavailable</strong>
            <p>{error}</p>
            <button type="button" onClick={() => chooseSurah(selected)}>
              Try again
            </button>
          </div>
        )}
        {!loading && !error && detail && (
          <>
            <header className="quran-surah-hero">
              <p>
                {t("Surah")} {detail.number} · {detail.ayahs.length} {t("Ayahs")}
              </p>
              <h1>{detail.englishName}</h1>
              <span>
                {detail.meaning}
              </span>
              <b lang="ar" dir="rtl">
                {detail.name}
              </b>
            </header>
            <section
              className="quran-surah-player"
              aria-label={`Full recitation of Surah ${detail.englishName}`}
            >
              <div>
                <strong>{t("Recitation")}</strong>
                <small>
                  {detail.audio.reciterName ??
                    RECITERS.find((item) => item.id === reciter)?.label}
                </small>
              </div>
              <button
                type="button"
                onClick={() => play(surahMediaItem(detail, reciter))}
              >
                <span aria-hidden="true">▶</span>
                {current?.id === `quran-${detail.number}-${reciter}`
                  ? detail.audio.verseTimings.length
                    ? `${quranPlayback.isPlaying ? "Playing" : "Paused"} · Ayah ${activeAyahNumber ?? 1}`
                    : "Player open"
                  : t("Play Surah")}
              </button>
            </section>
            {readerMode === "Listening" ? <PracticeControls key={`${detail.number}-${reciter}`} detail={detail} reciter={reciter} /> : null}
            <details className="quran-source-details"><summary>{t("Sources & details")}</summary><div className="quran-attribution">
              <span>Arabic Uthmani text</span>
              <span>
                Meaning:{" "}
                {TRANSLATIONS.find((item) => item.id === translation)?.label}
              </span>
              <span>
                Audio:{" "}
                {detail.audio.reciterName ??
                  RECITERS.find((item) => item.id === reciter)?.label}
              </span>

              <Link href={`/corrections?page=${encodeURIComponent(`/quran?surah=${detail.number}`)}&kind=translation`}>Report a text or translation issue</Link>
              <Link href="/content-review">Sources & review status</Link>
              {readingStreak ? <span>{readingStreak}-day reading streak</span> : null}
            </div></details>
            <div className="ayah-list">
              {detail.ayahs.map((ayah) => {
                const key = `${detail.number}:${ayah.number}`;
                const saved = bookmarks.includes(key);
                const active = ayah.number === activeAyahNumber;
                const progressStyle = active
                  ? ({
                      "--ayah-progress": `${Math.round(quranPlayback.verseProgress * 100)}%`,
                    } as CSSProperties)
                  : undefined;
                return (
                  <article
                    className={`ayah-card${active ? " is-playing" : ""}`}
                    id={`ayah-${ayah.number}`}
                    key={ayah.number}
                    aria-current={active ? "true" : undefined}
                    style={progressStyle}
                  >
                    <div className="ayah-toolbar">
                      <span>
                        {detail.number}:{ayah.number}
                      </span>
                      <div>
                        <small>
                          Juz {ayah.juz || "—"} · Page {ayah.page || "—"}
                        </small>
                        <button
                          type="button"
                          className="ayah-study-action"
                          onClick={() => openStudy("words", ayah)}
                        >
                          Words
                        </button>
                        <button
                          type="button"
                          className="ayah-study-action"
                          onClick={() => openStudy("tafsir", ayah)}
                        >
                          Tafsir
                        </button>
                        <button
                          className={`ayah-study-action${notes[key] ? " saved" : ""}`}
                          type="button"
                          onClick={() => openNote(ayah)}
                        >
                          {notes[key] ? "Noted" : "Note"}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyAyah(ayah)}
                          aria-label={`Copy verse ${key}`}
                        >
                          Copy
                        </button>
                        <button
                          className={saved ? "saved" : ""}
                          type="button"
                          onClick={() => toggleBookmark(ayah.number)}
                          aria-label={`${saved ? "Remove" : "Save"} verse ${key}`}
                        >
                          {saved ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                    <p
                      className="ayah-arabic"
                      lang="ar"
                      dir="rtl"
                      style={{ fontSize: `${arabicSize}px` }}
                    >
                      {ayah.arabic}
                    </p>
                    {showMeaning && (
                      <p className="ayah-meaning">
                        <span>{ayah.number}</span>
                        {ayah.english}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
      {notice && (
        <div className="quran-notice" role="status">
          {notice}
        </div>
      )}
      {studyPanel ? (
        <div
          ref={studyRef}
          className="quran-study-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quran-study-title"
        >
          <button
            className="quran-study-backdrop"
            type="button"
            onClick={closeStudy}
            aria-label="Close study panel"
          />
          <section className="quran-study-panel">
            <header>
              <div>
                <span>{studyPanel.reference}</span>
                <h2 id="quran-study-title">{studyPanel.title}</h2>
              </div>
              <button
                type="button"
                onClick={closeStudy}
                aria-label="Close study panel"
              >
                ×
              </button>
            </header>
            {studyPanel.loading ? (
              <div className="quran-study-loading">
                Loading trusted study material…
              </div>
            ) : null}
            {studyPanel.error ? (
              <div className="quran-error">
                <strong>Study resource unavailable</strong>
                <p>{studyPanel.error}</p>
              </div>
            ) : null}
            {!studyPanel.loading &&
            !studyPanel.error &&
            studyPanel.type === "words" ? (
              <div className="quran-word-grid">
                {studyPanel.words.map((word) => (
                  <article key={word.position}>
                    <b lang="ar" dir="rtl">
                      {word.arabic}
                    </b>
                    <strong>{word.meaning}</strong>
                    <small>{word.transliteration}</small>
                  </article>
                ))}
              </div>
            ) : null}
            {!studyPanel.loading &&
            !studyPanel.error &&
            studyPanel.type === "tafsir" ? (
              <div className="quran-tafsir-text">
                <a
                  href={
                    "https://quran.com/" +
                    studyPanel.reference.replace(":", "/") +
                    "/tafsirs/en-tafisr-ibn-kathir"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open original commentary ↗
                </a>
                {studyPanel.text
                  .split("\n")
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 18)}`}>
                      {paragraph}
                    </p>
                  ))}
                {studyPanel.truncated ? (
                  <small>
                    This abridged panel shows the opening portion of the source
                    commentary.
                  </small>
                ) : null}
              </div>
            ) : null}
            {studyPanel.type === "note" ? (
              <div className="quran-note-editor">
                <label htmlFor="quran-note">Your reflection</label>
                <textarea
                  id="quran-note"
                  value={studyPanel.text}
                  onChange={(event) =>
                    setStudyPanel({ ...studyPanel, text: event.target.value })
                  }
                  placeholder="Write a private note about this Ayah…"
                  maxLength={3000}
                  autoFocus
                />
                <small>
                  Saved only on this device · {studyPanel.text.length}/3000
                </small>
              </div>
            ) : null}
            <footer>
              <span>
                {studyPanel.type === "note"
                  ? "Private device note"
                  : "Source: Quran Foundation"}
              </span>
              <button
                type="button"
                onClick={
                  studyPanel.type === "note"
                    ? saveNote
                    : closeStudy
                }
              >
                {studyPanel.type === "note" ? "Save note" : "Done"}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
