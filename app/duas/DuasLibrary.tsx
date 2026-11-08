"use client";
import { personalStorage } from "@/lib/personal-storage";

import { useNoorCopy } from "../site/SiteUtilities";
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
  const { t } = useNoorCopy();
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
          personalStorage.getItem("noor-dua-counts-v1") ?? "{}",
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
      personalStorage.setItem("noor-dua-counts-v1", JSON.stringify(next));
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
      if (!writeSavedList(SAVED_KEYS.duas, next)) return;
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
            {t(entry.category)}
          </button>
        ))}
      </nav>
      <article>
        <span>
          {t(dua.category)} · {dua.source}
        </span>
        <h3>{t(dua.title)}</h3>
        {dua.excerpt ? (
          <p className="content-status">
            Excerpt from a longer supplication. Open the source for the full
            wording and context.
          </p>
        ) : null}
        <p className="arabic" lang="ar" dir="rtl">
          {dua.arabic}
        </p>
        <p lang="en" dir="ltr">
          {dua.roman}
        </p>
        <small>{t("English meaning")}</small>
        <blockquote lang="en" dir="ltr">
          {dua.meaning}
        </blockquote>
        {dua.audio ? (
          <div>
            <small>{t("Full verse audio · Mishary Alafasy")}</small>
            <audio
              controls
              preload="none"
              key={dua.id}
              src={dua.audio}
              onError={() =>
                setNotice("Audio unavailable. Please try again later.")
              }
            />
          </div>
        ) : null}
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
            {t("Copy")}
          </button>
          <button type="button" onClick={() => updateCount(count + 1)}>
            {t("Count")} <b>{count}</b>
          </button>
          <button type="button" onClick={() => updateCount(0)}>
            {t("Reset counter")}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={saved.includes(dua.id)}
          >
            {saved.includes(dua.id) ? "★ " + t("Saved") : "☆ " + t("Save")}
          </button>
        </div>
        <p>
          <Link href="/saved">{t("Open Saved →")}</Link> ·{" "}
          <a
            href={dua.href}
            target={dua.href.startsWith("https:") ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            {t("Open source ↗")}
          </a>
        </p>
        <small>
          {t(
            "Personal counter · no prescribed count. Scholarly review pending.",
          )}
        </small>
        <p role="status">{t(notice)}</p>
      </article>
    </div>
  );
}
