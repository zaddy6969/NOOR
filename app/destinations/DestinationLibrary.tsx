"use client";

import { useEffect, useMemo, useState } from "react";
import { destinations, type Destination } from "./destination-data";

type Filter = "All" | Destination["category"];

export default function DestinationLibrary() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        target.scrollIntoView({ block: "start" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const visible = useMemo(() => { const term = query.trim().toLowerCase(); return destinations.filter((item) => (filter === "All" || item.category === filter) && (!term || `${item.name} ${item.country} ${item.region} ${item.category} ${item.summary} ${item.places.join(" ")}`.toLowerCase().includes(term))); }, [filter, query]);
  return <section className="compact-directory-library destination-library"><div className="directory-toolbar"><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Makkah, Ajmer, Cairo…" aria-label="Search Muslim destinations"/><div>{(["All", "Sacred", "Sufi heritage", "Islamic history", "Learning"] as Filter[]).map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><span>{visible.length} places</span></div><div className="destination-list">{visible.map((item, index) => <details id={item.slug} key={item.slug}><summary><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.category} · {item.region}</small><strong>{item.name}</strong><p>{item.country} · {item.summary}</p></div>{item.arabic ? <b lang="ar" dir="rtl">{item.arabic}</b> : null}<i aria-hidden="true">+</i></summary><div className="destination-details"><section><span>WHY IT MATTERS</span><p>{item.significance}</p></section><section><span>KEY PLACES</span><ul>{item.places.map((place) => <li key={place}>{place}</li>)}</ul></section><section><span>VISIT WITH ADAB</span><p>{item.etiquette}</p></section><section><span>PLAN CAREFULLY</span><p>{item.planning}</p></section><footer>Source checked: {item.source}</footer></div></details>)}</div>{visible.length === 0 ? <p className="compact-empty">No destination matched this search.</p> : null}</section>;
}
