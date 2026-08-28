"use client";

import { useEffect, useMemo, useState } from "react";
import { shopItems, type ShopCategory } from "./shop-data";

type Filter = "All" | ShopCategory;

export default function ShopCatalog() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try { setList(JSON.parse(window.localStorage.getItem("noor-shop-list-v1") ?? "[]") as string[]); } catch { setList([]); }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(shopItems.map((item) => item.category)))] as Filter[], []);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return shopItems.filter((item) => (filter === "All" || item.category === filter) && (!term || `${item.name} ${item.category} ${item.description} ${item.options}`.toLowerCase().includes(term)));
  }, [filter, query]);

  const toggle = (id: string) => {
    setList((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("noor-shop-list-v1", JSON.stringify(next));
      return next;
    });
  };

  const selected = shopItems.filter((item) => list.includes(item.id));

  return (
    <section className="shop-working-area">
      <div className="shop-catalogue">
        <div className="directory-toolbar shop-toolbar"><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Quran, prayer mat, Ihram…" aria-label="Search product request catalogue"/><div role="group" aria-label="Product categories">{categories.map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><span>{visible.length} ideas</span></div>
        <div className="shop-item-grid">{visible.map((item) => <article id={item.id} key={item.id}><span aria-hidden="true">{item.icon}</span><small>{item.category}</small><h2>{item.name}</h2><p>{item.description}</p><div><b>OPTIONS</b>{item.options}</div><button className={list.includes(item.id) ? "selected" : ""} type="button" onClick={() => toggle(item.id)}>{list.includes(item.id) ? "✓ Added to request list" : "+ Add to request list"}</button></article>)}</div>
      </div>
      <aside className="shop-request-card"><span>PRIVATE SAVED LIST</span><strong>{selected.length} {selected.length === 1 ? "idea" : "ideas"}</strong>{selected.length ? <div>{selected.map((item) => <button type="button" onClick={() => toggle(item.id)} key={item.id}><span><b>{item.name}</b><small>{item.category}</small></span><i aria-label={`Remove ${item.name}`}>×</i></button>)}</div> : <p>Add useful ideas from any category. Your list stays privately on this device.</p>}<footer><b>No ordering or payment</b><p>This catalogue does not sell products. Verified sellers, inventory, delivery and a secure payment provider are required before commerce can open.</p></footer></aside>
    </section>
  );
}
