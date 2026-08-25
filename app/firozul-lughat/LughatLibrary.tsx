"use client";

import { useEffect, useMemo, useState } from "react";
import { lughatEntries } from "./lughat-data";

type Filter = "All" | "Faith" | "Worship" | "Character" | "Learning" | "Community" | "Saved";

export default function LughatLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try { setSaved(JSON.parse(window.localStorage.getItem("noor-lughat-saved-v1") ?? "[]") as string[]); } catch { setSaved([]); }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return lughatEntries.filter((entry) => {
      const matchesFilter = filter === "All" || (filter === "Saved" ? saved.includes(entry.id) : entry.category === filter);
      const matchesQuery = !term || `${entry.term} ${entry.urdu} ${entry.roman} ${entry.meaning} ${entry.use}`.toLocaleLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, saved]);

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("noor-lughat-saved-v1", JSON.stringify(next));
      return next;
    });
  };

  const copy = async (id: string) => {
    const entry = lughatEntries.find((item) => item.id === id);
    if (!entry) return;
    await navigator.clipboard.writeText(`${entry.term} · ${entry.urdu}\n${entry.meaning}\n${entry.use}`);
    setNotice(`${entry.term} copied`);
    window.setTimeout(() => setNotice(""), 1600);
  };

  return (
    <section className="compact-directory-library">
      <div className="directory-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search Allah, wuzu, نماز…" aria-label="Search the Urdu and Islamic dictionary" />
        <div role="group" aria-label="Dictionary categories">{(["All", "Faith", "Worship", "Character", "Learning", "Community", "Saved"] as Filter[]).map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <span>{visible.length} words</span>
      </div>
      <div className="lughat-grid">
        {visible.map((entry) => <article id={entry.id} key={entry.id}>
          <header><span>{entry.category}</span><b lang="ur" dir="rtl">{entry.urdu}</b></header>
          <h2>{entry.term}</h2><small>{entry.roman}</small><p>{entry.meaning}</p>
          <div><strong>IN USE</strong><p>{entry.use}</p></div>
          <footer><button type="button" onClick={() => copy(entry.id)}>Copy</button><button className={saved.includes(entry.id) ? "saved" : ""} type="button" onClick={() => toggleSaved(entry.id)}>{saved.includes(entry.id) ? "Saved" : "Save"}</button></footer>
        </article>)}
      </div>
      {visible.length === 0 ? <p className="compact-empty">No word matched. Try a simpler spelling such as wudu, namaz or dua.</p> : null}
      {notice ? <div className="quran-notice" role="status">{notice}</div> : null}
    </section>
  );
}
