"use client";

import { practiceBoundary, practiceRange, type PracticeRange } from "@/lib/quran-playback";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type QuranVerseTiming = { number: number; from: number; to: number; duration: number };
export type QuranVerseText = { number: number; arabic: string; english: string };

export type MediaItem =
  | { kind: "quran"; id: string; title: string; subtitle: string; src: string; surahNumber: number; verseTimings: QuranVerseTiming[]; verses: QuranVerseText[] }
  | { kind: "spotify"; id: string; title: string; subtitle: string; spotifyId: string }
  | { kind: "video"; id: string; title: string; subtitle: string; youtubeId: string };

type MediaContextValue = {
  current: MediaItem | null;
  play: (item: MediaItem, options?: { range: PracticeRange }) => void;
  close: () => void;
  quranPlayback: {
    activeVerseNumber: number | null;
    activeVerse: QuranVerseText | null;
    currentTime: number;
    duration: number;
    verseProgress: number;
    isPlaying: boolean;
  };
};

const MediaContext = createContext<MediaContextValue | null>(null);

export function useMediaPlayer() {
  const value = useContext(MediaContext);
  if (!value) throw new Error("useMediaPlayer must be used inside MediaProvider");
  return value;
}

export default function MediaProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<MediaItem | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playVersion, setPlayVersion] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const rangeRef = useRef<PracticeRange | null>(null);
  const roundRef = useRef(1);
  const [practice, setPractice] = useState<{ range: PracticeRange; round: number; complete: boolean } | null>(null);
  const [audioError, setAudioError] = useState("");
  const currentKind = current?.kind;

  useEffect(() => {
    if (currentKind !== "quran") return;
    const dock = dockRef.current;
    if (!dock) return;
    const scrollPage = (event: WheelEvent) => {
      // A fixed player has no scrolling ancestor for the browser to chain to.
      // Preserve trackpad pinch zoom and horizontal gestures.
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      const page = document.scrollingElement;
      if (!page || page.scrollHeight <= page.clientHeight) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      window.scrollBy({ top: event.deltaY * unit, behavior: "instant" });
    };
    dock.addEventListener("wheel", scrollPage, { passive: false });
    return () => dock.removeEventListener("wheel", scrollPage);
  }, [currentKind]);

  const advancePractice = (audio: HTMLAudioElement, ended = false) => {
    const range = rangeRef.current;
    if (!range) { setCurrentTime(audio.currentTime); return; }
    const boundary = practiceBoundary(ended ? range.to / 1000 : audio.currentTime, range, roundRef.current);
    if (boundary.action === "continue") { setCurrentTime(audio.currentTime); return; }
    if (boundary.action === "complete") {
      // Clear before seeking: seeking itself can trigger another timeupdate event.
      rangeRef.current = null;
      audio.pause(); audio.currentTime = Math.min(boundary.seek, audio.duration || boundary.seek);
      setIsPlaying(false);
      setPractice({ range, round: boundary.round, complete: true });
    } else {
      roundRef.current = boundary.round;
      audio.currentTime = boundary.seek;
      setPractice({ range, round: boundary.round, complete: false });
      if (audio.paused) void audio.play().catch(() => setAudioError("Press Play in the audio controls to continue."));
    }
    setCurrentTime(audio.currentTime);
  };

  const play = useCallback((item: MediaItem, options?: { range: PracticeRange }) => {
    audioRef.current?.pause();
    const range = item.kind === "quran" && options?.range
      ? practiceRange(item.verseTimings, options.range.first, options.range.last, options.range.repeats) : null;
    rangeRef.current = range; roundRef.current = 1;
    setPractice(range ? { range, round: 1, complete: false } : null);
    setAudioError("");
    setCurrentTime(range ? range.from / 1000 : 0);
    setDuration(0);
    setIsPlaying(false);
    setPlayVersion((version) => version + 1);
    setCurrent(item);
    setCollapsed(false);
  }, []);

  const close = useCallback(() => {
    audioRef.current?.pause();
    rangeRef.current = null; setPractice(null); setAudioError("");
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setCurrent(null);
  }, []);

  const quranPlayback = useMemo(() => {
    if (!current || current.kind !== "quran") return { activeVerseNumber: null, activeVerse: null, currentTime, duration, verseProgress: 0, isPlaying: false };
    const milliseconds = currentTime * 1000;
    const timing = current.verseTimings.find((item) => milliseconds >= item.from && milliseconds < item.to)
      ?? (milliseconds >= (current.verseTimings.at(-1)?.to ?? Number.POSITIVE_INFINITY) ? current.verseTimings.at(-1) : current.verseTimings[0]);
    const activeVerseNumber = timing?.number ?? null;
    const activeVerse = current.verses.find((verse) => verse.number === activeVerseNumber) ?? null;
    const verseProgress = timing ? Math.min(1, Math.max(0, (milliseconds - timing.from) / Math.max(1, timing.to - timing.from))) : 0;
    return { activeVerseNumber, activeVerse, currentTime, duration, verseProgress, isPlaying };
  }, [current, currentTime, duration, isPlaying]);

  useEffect(() => {
    if (!current || current.kind !== "quran" || !("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: quranPlayback.activeVerseNumber ? `${current.title} · Ayah ${quranPlayback.activeVerseNumber}` : current.title,
      artist: quranPlayback.activeVerse?.english ?? current.subtitle,
      album: "NOOR Quran",
    });
    navigator.mediaSession.setActionHandler("play", () => { void audioRef.current?.play().catch(() => setAudioError("Press Play in the audio controls to continue.")); });
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [current, quranPlayback.activeVerse, quranPlayback.activeVerseNumber]);

  return (
    <MediaContext.Provider value={{ current, play, close, quranPlayback }}>
      {children}
      {current ? (
        <aside ref={dockRef} className={`media-dock media-dock-${current.kind}${collapsed ? " is-collapsed" : ""}`} aria-label="Persistent media player">
          <header>
            <button className="media-dock-info" type="button" onClick={() => setCollapsed((value) => !value)} aria-expanded={!collapsed}>
              <span>{current.kind === "video" ? "VIDEO" : current.kind === "spotify" ? "AUDIO" : "QURAN AUDIO"}</span>
              <strong>{current.title}</strong>
              <small>{current.kind === "quran" && quranPlayback.activeVerseNumber ? `Ayah ${current.surahNumber}:${quranPlayback.activeVerseNumber} · ${quranPlayback.activeVerse?.english ?? current.subtitle}` : current.subtitle}</small>
            </button>
            <button className="media-collapse" type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand player" : "Minimize player"}>{collapsed ? "⌃" : "⌄"}</button>
            <button className="media-close" type="button" onClick={close} aria-label="Close player">×</button>
          </header>
          {current.kind === "quran" ? (<>
            {!collapsed && quranPlayback.activeVerse ? <div className="media-quran-caption">
              <span>{isPlaying ? "NOW RECITING" : "PAUSED"} · {current.surahNumber}:{quranPlayback.activeVerse.number}</span>
              <b lang="ar" dir="rtl">{quranPlayback.activeVerse.arabic}</b>
              <p>{quranPlayback.activeVerse.english}</p>
            </div> : null}
            {practice ? <p className="media-practice-status" role="status">Ayahs {current.surahNumber}:{practice.range.first}–{practice.range.last} · {practice.complete ? "Practice complete" : `Repetition ${practice.round} of ${practice.range.repeats}`}</p> : null}
            {audioError ? <p className="media-practice-status" role="alert">{audioError}</p> : null}
            <audio
              className={collapsed ? "media-audio-hidden" : ""}
              ref={audioRef}
              key={`${current.id}-${playVersion}`}
              controls
              autoPlay
              preload="metadata"
              src={current.src}
              aria-label={`${current.title}, ${current.subtitle}`}
              onLoadedMetadata={(event) => { const audio = event.currentTarget; setDuration(audio.duration || 0); if (rangeRef.current) audio.currentTime = rangeRef.current.from / 1000; }}
              onTimeUpdate={(event) => advancePractice(event.currentTarget)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={(event) => { setIsPlaying(false); if (rangeRef.current) advancePractice(event.currentTarget, true); }}
              onError={() => { setIsPlaying(false); setAudioError("Audio could not be loaded. Check your connection or try another reciter."); }}
            />
          </>) : null}
          {!collapsed && current.kind === "spotify" ? (
            <iframe
              key={current.id}
              src={`https://open.spotify.com/embed/track/${current.spotifyId}?utm_source=generator&theme=0`}
              title={`${current.title} audio player`}
              loading="eager"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          ) : null}
          {!collapsed && current.kind === "video" ? (
            <iframe
              key={current.id}
              src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={`${current.title} video player`}
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : null}
        </aside>
      ) : null}
    </MediaContext.Provider>
  );
}
