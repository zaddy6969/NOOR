"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { daroodEntries } from "../darood/DaroodLibrary";
import { lughatEntries } from "../firozul-lughat/lughat-data";
import { readSavedCollections, readSavedList, SAVED_ITEMS_EVENT, SAVED_KEYS, savedItemsTotal, type SavedCollections, writeSavedList } from "../site/saved-items";
import SavedSync from "./SavedSync";

type Filter = "all" | "quran" | "darood" | "lughat";
type SurahSummary = { number: number; englishName: string; englishNameTranslation: string };

const EMPTY_COLLECTIONS: SavedCollections = { quranVerses: [], quranSurahs: [], darood: [], lughat: [] };

function BookmarkMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V22l-6-3.8L6 22Z"/></svg>;
}

export default function SavedLibrary() {
  const [collections, setCollections] = useState<SavedCollections>(EMPTY_COLLECTIONS);
  const [filter, setFilter] = useState<Filter>("all");
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const sync = () => setCollections(readSavedCollections());
    sync();
    window.addEventListener(SAVED_ITEMS_EVENT, sync);
    window.addEventListener("storage", sync);
    fetch("/api/quran/surahs")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { surahs?: SurahSummary[] }) => { if (Array.isArray(payload.surahs)) setSurahs(payload.surahs); })
      .catch(() => undefined);
    return () => {
      window.removeEventListener(SAVED_ITEMS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const surahByNumber = useMemo(() => new Map(surahs.map((surah) => [surah.number, surah])), [surahs]);
  const quranCount = collections.quranVerses.length + collections.quranSurahs.length;
  const total = savedItemsTotal(collections);

  const remove = (key: string, id: string, label: string) => {
    writeSavedList(key, readSavedList(key).filter((item) => item !== id));
    setCollections(readSavedCollections());
    setNotice(`${label} removed from Saved`);
    window.setTimeout(() => setNotice(""), 1700);
  };

  const sections = {
    quran: filter === "all" || filter === "quran",
    darood: filter === "all" || filter === "darood",
    lughat: filter === "all" || filter === "lughat",
  };

  return (
    <section className="saved-library">
      <header className="saved-summary">
        <div><span>PRIVATE ON THIS DEVICE</span><h1>Your saved collection</h1><p>Keep verses, Surahs, Darood and glossary words together. They remain available after refresh on this browser.</p></div>
        <strong><BookmarkMark/><b>{total}</b><small>saved {total === 1 ? "item" : "items"}</small></strong>
      </header>
      <SavedSync />

      <nav className="saved-filters" aria-label="Filter saved items">
        {([
          ["all", "All", total],
          ["quran", "Quran", quranCount],
          ["darood", "Darood", collections.darood.length],
          ["lughat", "Glossary", collections.lughat.length],
        ] as Array<[Filter, string, number]>).map(([id, label, count]) => (
          <button className={filter === id ? "active" : ""} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id} key={id}>{label}<span>{count}</span></button>
        ))}
      </nav>

      {total === 0 ? (
        <div className="saved-empty">
          <BookmarkMark/><h2>Nothing saved yet</h2><p>Tap Save or Bookmark anywhere in NOOR and it will appear here.</p>
          <div><Link href="/quran">Read Quran</Link><Link href="/darood">Browse Darood</Link><Link href="/glossary">Open Glossary</Link></div>
        </div>
      ) : (
        <div className="saved-sections">
          {sections.quran && quranCount > 0 ? <section aria-labelledby="saved-quran-title">
            <header><div><span>01</span><h2 id="saved-quran-title">Quran</h2></div><small>{quranCount} saved</small></header>
            <div className="saved-card-grid">
              {collections.quranSurahs.map((id) => {
                const number = Number(id);
                const surah = surahByNumber.get(number);
                return <article className="saved-card saved-quran-card" key={`surah-${id}`}>
                  <span>SAVED SURAH</span><h3>{surah ? `Surah ${surah.englishName}` : `Surah ${id}`}</h3><p>{surah?.englishNameTranslation ?? "Continue reading from the full Quran reader."}</p>
                  <footer><Link href={`/quran?surah=${id}`}>Open Surah <b aria-hidden="true">↗</b></Link><button type="button" onClick={() => remove(SAVED_KEYS.quranSurahs, id, `Surah ${id}`)}>Remove</button></footer>
                </article>;
              })}
              {collections.quranVerses.map((reference) => {
                const [surahNumber, ayahNumber] = reference.split(":");
                const surah = surahByNumber.get(Number(surahNumber));
                return <article className="saved-card saved-quran-card" key={`verse-${reference}`}>
                  <span>SAVED AYAH</span><h3>Quran {reference}</h3><p>{surah ? `${surah.englishName} · ${surah.englishNameTranslation}` : "Open the exact saved verse in the reader."}</p>
                  <footer><Link href={`/quran?surah=${surahNumber}&ayah=${ayahNumber}`}>Open Ayah <b aria-hidden="true">↗</b></Link><button type="button" onClick={() => remove(SAVED_KEYS.quranVerses, reference, `Quran ${reference}`)}>Remove</button></footer>
                </article>;
              })}
            </div>
          </section> : null}

          {sections.darood && collections.darood.length > 0 ? <section aria-labelledby="saved-darood-title">
            <header><div><span>02</span><h2 id="saved-darood-title">Darood Sharif</h2></div><small>{collections.darood.length} saved</small></header>
            <div className="saved-card-grid">
              {collections.darood.map((id) => {
                const entry = daroodEntries.find((item) => item.id === id);
                if (!entry) return null;
                return <article className="saved-card" key={id}>
                  <span>{entry.category.toUpperCase()}</span><h3>{entry.title}</h3><p>{entry.alternate}</p><p className="saved-arabic" lang="ar" dir="rtl">{entry.arabic}</p>
                  <footer><Link href={`/darood#${id}`}>Open Darood <b aria-hidden="true">↗</b></Link><button type="button" onClick={() => remove(SAVED_KEYS.darood, id, entry.title)}>Remove</button></footer>
                </article>;
              })}
            </div>
          </section> : null}

          {sections.lughat && collections.lughat.length > 0 ? <section aria-labelledby="saved-lughat-title">
            <header><div><span>03</span><h2 id="saved-lughat-title">Islamic Glossary</h2></div><small>{collections.lughat.length} saved</small></header>
            <div className="saved-card-grid">
              {collections.lughat.map((id) => {
                const entry = lughatEntries.find((item) => item.id === id);
                if (!entry) return null;
                return <article className="saved-card" key={id}>
                  <span>{entry.category.toUpperCase()}</span><div className="saved-term"><h3>{entry.term}</h3><b lang="ur" dir="rtl">{entry.urdu}</b></div><p>{entry.meaning}</p>
                  <footer><Link href={`/glossary#${id}`}>Open word <b aria-hidden="true">↗</b></Link><button type="button" onClick={() => remove(SAVED_KEYS.lughat, id, entry.term)}>Remove</button></footer>
                </article>;
              })}
            </div>
          </section> : null}
        </div>
      )}
      <p className="saved-device-note">Saved items stay in this browser by default. Account sync happens only when you choose it.</p>
      {notice ? <div className="quran-notice" role="status">{notice}</div> : null}
    </section>
  );
}
