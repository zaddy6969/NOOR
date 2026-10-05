"use client";
import { personalStorage } from "@/lib/personal-storage";


import { useEffect, useMemo, useState } from "react";
import { readSavedList, SAVED_KEYS, writeSavedList } from "../site/saved-items";

import { daroodEntries, type DaroodEntry } from "./darood-data";
export { daroodEntries } from "./darood-data";
type Filter = "All" | "Prophetic" | "Traditional" | "Short" | "Saved";

export default function DaroodLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = readSavedList(SAVED_KEYS.darood);
        const storedCounts = personalStorage.getItem("noor-darood-counts-v1");
        setSavedIds(saved);
        if (storedCounts) setCounts(JSON.parse(storedCounts) as Record<string, number>);
      } catch {
        setSavedIds([]);
        setCounts({});
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target instanceof HTMLDetailsElement) {
      target.open = true;
      window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return daroodEntries.filter((entry) => {
      const matchesFilter = filter === "All" || (filter === "Saved" ? savedIds.includes(entry.id) : entry.category === filter);
      const matchesQuery = !term || [entry.title, entry.alternate, entry.roman ?? "", entry.meaning, entry.source].join(" ").toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, savedIds]);

  const toggleSaved = (id: string) => {
    const current = readSavedList(SAVED_KEYS.darood);
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    const saved = writeSavedList(SAVED_KEYS.darood, next);
    if (saved) setSavedIds(saved);
  };

  const changeCount = (id: string, nextValue: number) => {
    const next = { ...counts, [id]: Math.max(0, nextValue) };
    try { personalStorage.setItem("noor-darood-counts-v1", JSON.stringify(next)); setCounts(next); }
    catch { setNotice("Your counter could not be saved. Please try again."); }
  };

  const copyEntry = async (entry: DaroodEntry) => {
    const text = [entry.title, entry.arabic, entry.roman ?? "", entry.meaning, entry.source].filter(Boolean).join("\n\n");
    await navigator.clipboard.writeText(text);
    setNotice(entry.title + " copied");
    window.setTimeout(() => setNotice(""), 1800);
  };

  const totalCount = Object.values(counts).reduce((total, count) => total + count, 0);

  return (
    <section className="darood-library">
      <div className="darood-tools">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Darood or wording" aria-label="Search Darood library" />
        <div role="group" aria-label="Darood filters">{(["All", "Prophetic", "Traditional", "Short", "Saved"] as Filter[]).map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <span><strong>{totalCount.toLocaleString("en-IN")}</strong> total recitations saved on this device</span>
      </div>

      <div className="darood-list">
        {visible.map((entry, index) => {
          const saved = savedIds.includes(entry.id);
          const count = counts[entry.id] ?? 0;
          return (
            <details className="darood-entry" id={entry.id} key={entry.id}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><small>{entry.category === "Prophetic" ? "HADITH-REPORTED WORDING" : entry.category === "Short" ? "SHORT SALAWAT" : "TRADITIONAL COLLECTION"}</small><strong>{entry.title}</strong><p>{entry.alternate}</p></div>
                <b lang="ar" dir="rtl">{entry.arabic}</b>
                <i aria-hidden="true">+</i>
              </summary>
              <div className="darood-entry-body">
                <p className="darood-arabic" lang="ar" dir="rtl">{entry.arabic}</p>
                {entry.roman ? <div className="darood-reading"><span>ROMAN READING AID</span><p>{entry.roman}</p></div> : null}
                <div className="darood-meaning"><span>ENGLISH MEANING</span><p>{entry.meaning}</p></div>
                <div className="darood-source"><div><span>SOURCE STATUS</span><strong>{entry.source}</strong><p>{entry.note}</p></div><div className="darood-actions"><button type="button" onClick={() => copyEntry(entry)}>Copy</button><button className={saved ? "saved" : ""} type="button" onClick={() => toggleSaved(entry.id)}>{saved ? "Saved" : "Save"}</button></div></div>
                <div className="darood-counter"><div><span>PRIVATE TASBIH COUNT</span><strong>{count.toLocaleString("en-IN")}</strong></div><button type="button" onClick={() => changeCount(entry.id, count + 1)}>+1 recitation</button><button type="button" onClick={() => changeCount(entry.id, 0)}>Reset</button></div>
              </div>
            </details>
          );
        })}
        {visible.length === 0 ? <p className="compact-empty">No Darood matched this search or filter.</p> : null}
      </div>
      {notice ? <div className="quran-notice" role="status">{notice}</div> : null}
    </section>
  );
}
