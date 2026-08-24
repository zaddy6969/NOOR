"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type QuranVerseTiming = { number: number; from: number; to: number; duration: number };
export type QuranVerseText = { number: number; arabic: string; english: string };

export type MediaItem =
  | { kind: "quran"; id: string; title: string; subtitle: string; src: string; surahNumber: number; verseTimings: QuranVerseTiming[]; verses: QuranVerseText[] }
  | { kind: "spotify"; id: string; title: string; subtitle: string; spotifyId: string }
  | { kind: "video"; id: string; title: string; subtitle: string; youtubeId: string };

type MediaContextValue = {
  current: MediaItem | null;
  play: (item: MediaItem) => void;
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

  const play = useCallback((item: MediaItem) => {
    audioRef.current?.pause();
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setPlayVersion((version) => version + 1);
    setCurrent(item);
    setCollapsed(false);
  }, []);

  const close = useCallback(() => {
    audioRef.current?.pause();
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
    if (!current || current.kind !== "quran" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: quranPlayback.activeVerseNumber ? `${current.title} · Ayah ${quranPlayback.activeVerseNumber}` : current.title,
      artist: quranPlayback.activeVerse?.english ?? current.subtitle,
      album: "NOOR Quran",
    });
    navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
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
        <aside className={`media-dock media-dock-${current.kind}${collapsed ? " is-collapsed" : ""}`} aria-label="Persistent media player">
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
              <span>NOW RECITING · {current.surahNumber}:{quranPlayback.activeVerse.number}</span>
              <b lang="ar" dir="rtl">{quranPlayback.activeVerse.arabic}</b>
              <p>{quranPlayback.activeVerse.english}</p>
            </div> : null}
            <audio
              className={collapsed ? "media-audio-hidden" : ""}
              ref={audioRef}
              key={`${current.id}-${playVersion}`}
              controls
              autoPlay
              preload="metadata"
              src={current.src}
              aria-label={`${current.title}, ${current.subtitle}`}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
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
