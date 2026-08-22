"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMediaPlayer } from "../media/MediaProvider";
import type { NaatEntry } from "./naat-data";

export default function NaatLibrary({ entries }: { entries: NaatEntry[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const { play } = useMediaPlayer();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesFilter = filter === "All" || entry.genre.includes(filter) || entry.languages.some((language) => language.includes(filter));
      const matchesTerm = !term || `${entry.title} ${entry.writer} ${entry.reciter} ${entry.genre}`.toLowerCase().includes(term);
      return matchesFilter && matchesTerm;
    });
  }, [entries, filter, query]);

  return (
    <section className="naat-library-compact">
      <div className="naat-library-tools">
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search title, writer or reciter" aria-label="Search Naat library" />
        <div role="group" aria-label="Filter Naat library">
          {["All", "Naat", "Salam", "Urdu", "Hindi"].map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}
        </div>
      </div>

      <div className="naat-library-list">
        {filtered.map((entry) => (
          <article key={entry.slug}>
            <div className="naat-library-title">
              <span>{entry.genre}</span>
              <Link href={`/naat/${entry.slug}`}>{entry.title}</Link>
              <small>{entry.media.performer} · {entry.writer}</small>
            </div>
            <div className="naat-library-buttons">
              <button type="button" onClick={() => play({ kind: "spotify", id: `spotify-${entry.slug}`, title: entry.title, subtitle: `${entry.media.performer} · Spotify`, spotifyId: entry.media.spotifyId })}><span aria-hidden="true">▶</span> Listen</button>
              <button type="button" onClick={() => play({ kind: "video", id: `video-${entry.slug}`, title: entry.title, subtitle: `${entry.media.performer} · ${entry.media.channel}`, youtubeId: entry.media.youtubeId })}><span aria-hidden="true">▣</span> Video</button>
              <Link href={`/naat/${entry.slug}`}>Read</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
