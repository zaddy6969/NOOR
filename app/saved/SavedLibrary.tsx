"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNoorCopy } from "../site/SiteUtilities";
import NoorSelect from "../site/NoorSelect";
import { daroodEntries } from "../darood/DaroodLibrary";
import { lughatEntries } from "../firozul-lughat/lughat-data";
import { DUAS } from "../duas/dua-data";
import { readSavedCollections, readSavedList, SAVED_ITEMS_EVENT, SAVED_KEYS, type SavedCollections, writeSavedList } from "../site/saved-items";
import { ACCOUNT_CHANGE_EVENT, personalOwner } from "@/lib/personal-storage";
import { normalizeSearchText } from "@/lib/search-match";
import PersonalDataControls from "./PersonalDataControls";
import SavedSync from "./SavedSync";
import styles from "./saved.module.css";

type Category = "quran" | "duas" | "darood" | "lughat";
type Filter = "all" | Category;
type SurahSummary = { number: number; englishName: string; englishNameTranslation: string };
type Item = { id: string; key: string; category: Category; kind: string; title: string; detail: string; arabic?: string; keywords?: string; href: string };
type Removed = { item: Item; owner: string | null; index: number };
const EMPTY: SavedCollections = { quranVerses: [], quranSurahs: [], duas: [], darood: [], lughat: [] };
const FILTERS: Array<[Filter, string]> = [["all", "All"], ["quran", "Quran"], ["duas", "Duas"], ["darood", "Darood"], ["lughat", "Glossary"]];

function BookmarkMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4Z" /></svg>;
}

export default function SavedLibrary({ syncConfigured }: { syncConfigured: boolean }) {
  const { t, locale } = useNoorCopy();
  const [collections, setCollections] = useState<SavedCollections>(EMPTY);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("category");
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [notice, setNotice] = useState("");
  const [removed, setRemoved] = useState<Removed | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const sync = () => { setCollections(readSavedCollections()); setReady(true); };
    const accountChanged = () => { sync(); setRemoved(null); setNotice(""); setQuery(""); setFilter("all"); };
    sync();
    window.addEventListener(SAVED_ITEMS_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener(ACCOUNT_CHANGE_EVENT, accountChanged);
    const controller = new AbortController();
    fetch("/api/quran/surahs", { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then((payload: { surahs?: SurahSummary[] }) => { if (Array.isArray(payload.surahs)) setSurahs(payload.surahs); })
      .catch(() => undefined);
    return () => {
      controller.abort();
      window.removeEventListener(SAVED_ITEMS_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(ACCOUNT_CHANGE_EVENT, accountChanged);
    };
  }, []);

  const items = useMemo(() => {
    const names = new Map(surahs.map(s => [s.number, s]));
    const result: Item[] = [];
    for (const id of collections.quranSurahs) {
      const surah = names.get(Number(id));
      result.push({ id, key: SAVED_KEYS.quranSurahs, category: "quran", kind: "Surah", title: surah?.englishName ?? `${t("Surah")} ${id}`, detail: surah?.englishNameTranslation ?? `${t("Surah")} ${id}`, keywords: `${t("Quran")} ${id}`, href: `/quran?surah=${encodeURIComponent(id)}` });
    }
    for (const id of collections.quranVerses) {
      const [surahNumber, ayahNumber] = id.split(":");
      const surah = names.get(Number(surahNumber));
      result.push({ id, key: SAVED_KEYS.quranVerses, category: "quran", kind: "Ayah", title: `${surah?.englishName ?? t("Quran")} ${id}`, detail: surah?.englishNameTranslation ?? `${t("Quran")} ${id}`, keywords: `${t("Quran")} ${t("Ayah")} ${id}`, href: `/quran?surah=${encodeURIComponent(surahNumber)}&ayah=${encodeURIComponent(ayahNumber ?? "1")}` });
    }
    for (const id of collections.duas) {
      const dua = DUAS.find(entry => entry.id === id);
      result.push({ id, key: SAVED_KEYS.duas, category: "duas", kind: "Dua", title: dua ? t(dua.title) : `${t("Dua")} · ${id}`, detail: dua?.source ?? "", arabic: dua?.arabic, keywords: dua ? `${dua.title} ${dua.meaning} ${dua.roman} ${dua.category}` : id, href: `/duas?dua=${encodeURIComponent(id)}` });
    }
    for (const id of collections.darood) {
      const entry = daroodEntries.find(item => item.id === id);
      result.push({ id, key: SAVED_KEYS.darood, category: "darood", kind: "Darood", title: entry?.title ?? `${t("Darood")} · ${id}`, detail: entry?.alternate ?? "", arabic: entry?.arabic, href: `/darood#${encodeURIComponent(id)}` });
    }
    for (const id of collections.lughat) {
      const entry = lughatEntries.find(item => item.id === id);
      result.push({ id, key: SAVED_KEYS.lughat, category: "lughat", kind: "Glossary", title: entry?.term ?? id, detail: entry?.meaning ?? "", keywords: entry?.urdu, href: `/glossary#${encodeURIComponent(id)}` });
    }
    return result;
  }, [collections, surahs, t]);
  const counts = { all: items.length, quran: collections.quranVerses.length + collections.quranSurahs.length, duas: collections.duas.length, darood: collections.darood.length, lughat: collections.lughat.length };
  const words = normalizeSearchText(query).split(" ").filter(Boolean);
  const visible = items.filter(item => (filter === "all" || item.category === filter) && words.every(word => normalizeSearchText(`${item.title} ${item.detail} ${item.arabic ?? ""} ${item.keywords ?? ""} ${t(item.kind)}`).includes(word)));
  if (sort === "az") visible.sort((a, b) => a.title.localeCompare(b.title, locale, { numeric: true }));

  const remove = (item: Item) => {
    const owner = personalOwner();
    const previous = readSavedList(item.key);
    if (!writeSavedList(item.key, previous.filter(id => id !== item.id))) { setNotice(t("Unable to update Saved. Please try again.")); return; }
    setRemoved({ item, owner, index: previous.indexOf(item.id) });
    setNotice(t("{label} removed from Saved", { label: item.title }));
    resultRef.current?.focus();
  };
  const undo = () => {
    if (!removed || removed.owner !== personalOwner()) { setRemoved(null); return; }
    const current = readSavedList(removed.item.key);
    if (!current.includes(removed.item.id)) current.splice(Math.max(0, removed.index), 0, removed.item.id);
    if (!writeSavedList(removed.item.key, current)) { setNotice(t("Unable to update Saved. Please try again.")); return; }
    setNotice(t("Restored to Saved")); setRemoved(null);
    resultRef.current?.focus();
  };

  return <section className={styles.library} aria-busy={!ready}>
    <header className={styles.heading}>
      <div><span className={styles.eyebrow}>{t("YOUR COLLECTION")}</span><h1>{t("Saved")} {ready && items.length > 0 ? <span>{items.length}</span> : null}</h1><p>{t("Saved on this device")}</p></div>
      <Link className={styles.browse} href="/features">{t("Explore NOOR")} <span aria-hidden="true">↗</span></Link>
    </header>
    <details className={styles.options}>
      <summary>{t("Collection options")} <span aria-hidden="true">⌄</span></summary>
      <div className={styles.optionContent}>
        {syncConfigured ? <SavedSync configured setupStatus="" /> : <p className={styles.syncNote}>{t("Cross-device sync is currently unavailable.")}</p>}
        <PersonalDataControls />
      </div>
    </details>
    {!ready ? <div className={styles.empty} role="status">{t("Loading saved items…")}</div> : items.length === 0 ? <div className={styles.empty}>
      <span className={styles.emptyIcon}><BookmarkMark /></span>
      <h2>{t("Keep what matters close")}</h2><p>{t("Tap the bookmark on an Ayah, dua or Darood to save it here.")}</p>
      <div className={styles.emptyActions}><Link href="/quran">{t("Read Quran")} <span aria-hidden="true">→</span></Link><Link href="/duas">{t("Browse duas")}</Link></div>
    </div> : <>
      <div className={styles.toolbar}>
        <div className={styles.search}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input ref={searchRef} type="search" aria-label={t("Search saved items")} placeholder={t("Search your collection…")} value={query} onChange={event => setQuery(event.target.value)} />{query ? <button type="button" aria-label={t("Clear search")} onClick={() => { setQuery(""); searchRef.current?.focus(); }}>×</button> : null}</div>
        <NoorSelect aria-label={t("Sort saved items")} value={sort} onChange={event => setSort(event.target.value)}><option value="category">{t("By category")}</option><option value="az">{t("Title A–Z")}</option></NoorSelect>
      </div>
      <nav className={styles.filters} aria-label={t("Filter saved items")}>
        {FILTERS.map(([id, label]) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{t(label)} <span>{counts[id]}</span></button>)}
      </nav>
      <h2 ref={resultRef} tabIndex={-1} className={styles.resultCount} aria-live="polite">{t("{count} saved items", { count: visible.length })}</h2>
      {visible.length ? <div className={styles.grid}>{visible.map(item => <article className={styles.card} key={`${item.key}:${item.id}`}>
        <div className={styles.cardTop}><span className={styles.kind}><BookmarkMark />{t(item.kind)}</span><button type="button" className={styles.remove} aria-label={t("Remove {label} from Saved", { label: item.title })} onClick={() => remove(item)}>{t("Remove")}</button></div>
        <Link href={item.href} className={styles.cardLink}><h3 dir="auto">{item.title}</h3>{item.detail ? <p dir="auto">{item.detail}</p> : null}{item.arabic ? <p className={styles.arabic} lang="ar" dir="rtl">{item.arabic}</p> : null}<span className={styles.open}>{t("Open")} <span aria-hidden="true">→</span></span></Link>
      </article>)}</div> : <div className={styles.noResults}><h3>{t("No saved items found")}</h3><p>{query ? t("Try another word or category.") : t("No saved items in this category.")}</p><button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>{t("Show all saved items")}</button></div>}
    </>}
    {notice ? <div className={styles.toast}><span role="status">{notice}</span>{removed ? <button type="button" onClick={undo}>{t("Undo")}</button> : null}<button type="button" aria-label={t("Dismiss notification")} onClick={() => { setNotice(""); setRemoved(null); }}>×</button></div> : null}
  </section>;
}
