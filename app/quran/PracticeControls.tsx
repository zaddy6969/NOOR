"use client";

import { useState } from "react";
import { useMediaPlayer, type QuranVerseTiming, type QuranVerseText } from "../media/MediaProvider";
import { practiceRange } from "@/lib/quran-playback";

type Detail = { number: number; englishName: string; ayahs: QuranVerseText[]; audio: { src: string; reciterName?: string; verseTimings: QuranVerseTiming[] } };

export default function PracticeControls({ detail, reciter }: { detail: Detail; reciter: string }) {
  const { play } = useMediaPlayer();
  const [first, setFirst] = useState(1);
  const [last, setLast] = useState(1);
  const [repeats, setRepeats] = useState(3);
  const range = practiceRange(detail.audio.verseTimings, first, last, repeats);
  return <section className="quran-practice" aria-label="Recitation practice">
    <div><strong>Recitation practice</strong><p>Choose an Ayah or a short range to repeat. Repetition uses the recording’s published timings.</p></div>
    <div className="quran-practice-controls">
      <label>From Ayah<select value={first} onChange={(event) => { const next = Number(event.target.value); setFirst(next); if (last < next) setLast(next); }}>{detail.ayahs.map((ayah) => <option key={ayah.number} value={ayah.number}>{ayah.number}</option>)}</select></label>
      <label>To Ayah<select value={last} onChange={(event) => setLast(Number(event.target.value))}>{detail.ayahs.filter((ayah) => ayah.number >= first).map((ayah) => <option key={ayah.number} value={ayah.number}>{ayah.number}</option>)}</select></label>
      <label>Repetitions<select value={repeats} onChange={(event) => setRepeats(Number(event.target.value))}>{[1, 3, 5, 10].map((count) => <option key={count} value={count}>{count}</option>)}</select></label>
      <button type="button" disabled={!range} onClick={() => {
        if (!range) return;
        play({ kind: "quran", id: `quran-${detail.number}-${reciter}`, title: `Surah ${detail.englishName}`, subtitle: `${detail.audio.reciterName ?? "Quran recitation"} · practice`, src: detail.audio.src, surahNumber: detail.number, verseTimings: detail.audio.verseTimings, verses: detail.ayahs }, { range });
      }}>Play selected range</button>
    </div>
    {!range ? <p role="status">Timing is unavailable for this selection. Full Surah listening is still available; try another reciter for timed practice.</p> : null}
  </section>;
}
