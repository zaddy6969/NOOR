"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type MediaItem =
  | { kind: "quran"; id: string; title: string; subtitle: string; src: string }
  | { kind: "spotify"; id: string; title: string; subtitle: string; spotifyId: string }
  | { kind: "video"; id: string; title: string; subtitle: string; youtubeId: string };

type MediaContextValue = {
  current: MediaItem | null;
  play: (item: MediaItem) => void;
  close: () => void;
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback((item: MediaItem) => {
    setCurrent(item);
    setCollapsed(false);
  }, []);

  const close = useCallback(() => {
    audioRef.current?.pause();
    setCurrent(null);
  }, []);

  useEffect(() => {
    if (!current || current.kind !== "quran" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.subtitle,
      album: "NOOR Quran",
    });
    navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [current]);

  return (
    <MediaContext.Provider value={{ current, play, close }}>
      {children}
      {current ? (
        <aside className={`media-dock media-dock-${current.kind}${collapsed ? " is-collapsed" : ""}`} aria-label="Persistent media player">
          <header>
            <button className="media-dock-info" type="button" onClick={() => setCollapsed((value) => !value)} aria-expanded={!collapsed}>
              <span>{current.kind === "video" ? "VIDEO" : current.kind === "spotify" ? "AUDIO" : "QURAN AUDIO"}</span>
              <strong>{current.title}</strong>
              <small>{current.subtitle}</small>
            </button>
            <button className="media-collapse" type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand player" : "Minimize player"}>{collapsed ? "⌃" : "⌄"}</button>
            <button className="media-close" type="button" onClick={close} aria-label="Close player">×</button>
          </header>
          {!collapsed && current.kind === "quran" ? (
            <audio ref={audioRef} key={current.id} controls autoPlay preload="metadata" src={current.src} aria-label={`${current.title}, ${current.subtitle}`} />
          ) : null}
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
