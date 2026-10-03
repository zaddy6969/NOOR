"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DUAS } from "./dua-data";
import {
  readSavedList,
  SAVED_ITEMS_EVENT,
  SAVED_KEYS,
  writeSavedList,
} from "../site/saved-items";
export default function DuasLibrary() {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const sync = () => setSaved(readSavedList(SAVED_KEYS.duas));
    const frame = requestAnimationFrame(() => {
      sync();
      const selected = new URLSearchParams(location.search).get("dua");
      const position = DUAS.findIndex((entry) => entry.id === selected);
      if (position >= 0) setIndex(position);
      try {
        const values = JSON.parse(
          localStorage.getItem("noor-dua-counts-v1") ?? "{}",
        );
        setCounts(
          Object.fromEntries(
            DUAS.map((entry) => [
              entry.id,
              Number.isInteger(values[entry.id]) && values[entry.id] >= 0
                ? values[entry.id]
                : 0,
            ]),
          ),
        );
      } catch {
        /* no saved counter */
      }
    });
    window.addEventListener(SAVED_ITEMS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(SAVED_ITEMS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const dua = DUAS[index];
  const count = counts[dua.id] ?? 0;
  const updateCount = (value: number) => {
    const next = { ...counts, [dua.id]: value };
    try {
      localStorage.setItem("noor-dua-counts-v1", JSON.stringify(next));
      setCounts(next);
    } catch {
      setNotice("Storage unavailable. Counter could not be saved.");
    }
  };
  const toggle = () => {
    try {
      const values = readSavedList(SAVED_KEYS.duas);
      const next = values.includes(dua.id)
        ? values.filter((id) => id !== dua.id)
        : [...values, dua.id];
      writeSavedList(SAVED_KEYS.duas, next);
      setSaved(next);
      setNotice(
        next.includes(dua.id)
          ? "Dua saved on this device."
          : "Dua removed from Saved.",
      );
    } catch {
      setNotice("Storage unavailable. Dua could not be saved.");
    }
  };
  return (
    <div className="workspace-duas">
      <nav aria-label="Dua categories">
        {DUAS.map((entry, position) => (
          <button
            type="button"
            aria-pressed={index === position}
            className={index === position ? "active" : ""}
            key={entry.id}
            onClick={() => {
              setIndex(position);
              setNotice("");
              if (location.pathname === "/duas")
                history.replaceState(null, "", "/duas?dua=" + entry.id);
            }}
          >
            {entry.category}
          </button>
        ))}
      </nav>
      <article>
        <span>
          {dua.category.toUpperCase()} · {dua.source}
        </span>
        <h3>{dua.title}</h3>
        {dua.excerpt ? (
          <p className="content-status">
            Excerpt from a longer supplication. Open the source for the full
            wording and context.
          </p>
        ) : null}
        <p className="arabic" lang="ar" dir="rtl">
          {dua.arabic}
        </p>
        <p>{dua.roman}</p>
        <blockquote>{dua.meaning}</blockquote>
        <div>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  dua.arabic + "\n" + dua.meaning + "\n" + dua.source,
                );
                setNotice("Dua copied.");
              } catch {
                setNotice("Copy unavailable. Select the text to copy it.");
              }
            }}
          >
            Copy
          </button>
          <button type="button" onClick={() => updateCount(count + 1)}>
            Count <b>{count}</b>
          </button>
          <button type="button" onClick={() => updateCount(0)}>
            Reset counter
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={saved.includes(dua.id)}
          >
            {saved.includes(dua.id) ? "★ Saved" : "☆ Save"}
          </button>
        </div>
        <p>
          <Link href="/saved">Open Saved →</Link> ·{" "}
          <a
            href={dua.href}
            target={dua.href.startsWith("https:") ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            Open source ↗
          </a>
        </p>
        <small>
          Personal counter · no prescribed repetition count is implied.
          Interface and English meanings shown here; verify the full source.
          Scholarly review pending.
        </small>
        <p role="status">{notice}</p>
      </article>
    </div>
  );
}
