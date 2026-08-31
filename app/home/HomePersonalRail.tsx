"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readSavedCollections, SAVED_ITEMS_EVENT, savedItemsTotal } from "../site/saved-items";
import type { FeatureId } from "./HomeFeatureWorkspace";

type Locale = "en" | "hi" | "ur";
type Snapshot = { recent: FeatureId[]; prayers: number; saved: number; readingDays: number };

const EMPTY: Snapshot = { recent: [], prayers: 0, saved: 0, readingDays: 0 };
const LABELS: Record<FeatureId, string> = {
  quran: "Quran", "prayer-times": "Prayer times", qibla: "Qibla", "islamic-calendar": "Calendar",
  "mosque-finder": "Mosque finder", "daily-duas": "Daily duas", darood: "Darood", zakat: "Zakat",
  kaza: "Qaza prayer", lughat: "Glossary", names: "99 Names", destinations: "Destinations",
};
const COPY = {
  en: { title: "Your NOOR today", private: "PERSONAL · ON THIS DEVICE", prayer: "Prayers marked", saved: "Saved items", reading: "Reading days", recent: "Recently used", none: "Choose a tool to make it easy to return here." },
  hi: { title: "आज आपका नूर", private: "निजी · इस डिवाइस पर", prayer: "नमाज़ पूरी", saved: "सहेजी चीज़ें", reading: "पढ़ने के दिन", recent: "हाल में इस्तेमाल", none: "किसी सुविधा को खोलें; वह यहाँ आसानी से मिल जाएगी।" },
  ur: { title: "آج آپ کا نور", private: "ذاتی · اسی ڈیوائس پر", prayer: "نماز مکمل", saved: "محفوظ چیزیں", reading: "مطالعے کے دن", recent: "حالیہ استعمال", none: "کوئی سہولت کھولیں، وہ یہاں آسانی سے مل جائے گی۔" },
} satisfies Record<Locale, Record<string, string>>;

function localDateKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function readStringArray(key: string) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function HomePersonalRail({ locale, activeFeature, onSelect }: { locale: Locale; activeFeature: FeatureId; onSelect: (feature: FeatureId) => void }) {
  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY);
  const copy = COPY[locale];

  useEffect(() => {
    const sync = () => {
      const valid = new Set(Object.keys(LABELS));
      const recent = readStringArray("noor-recent-features-v1").filter((item): item is FeatureId => valid.has(item));
      setSnapshot({
        recent,
        prayers: readStringArray(`noor-salah-${localDateKey()}`).length,
        saved: savedItemsTotal(readSavedCollections()),
        readingDays: readStringArray("noor-quran-reading-days-v1").length,
      });
    };
    sync();
    window.addEventListener("noor:recent-features", sync);
    window.addEventListener("noor:salah-progress", sync);
    window.addEventListener(SAVED_ITEMS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("noor:recent-features", sync);
      window.removeEventListener("noor:salah-progress", sync);
      window.removeEventListener(SAVED_ITEMS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const recent = snapshot.recent.filter((item) => item !== activeFeature).slice(0, 3);

  return (
    <section className="noor-personal-rail" aria-labelledby="personal-rail-title">
      <header><span>{copy.private}</span><h2 id="personal-rail-title">{copy.title}</h2></header>
      <div className="noor-personal-metrics">
        <Link href="/namaz#tracker"><strong>{snapshot.prayers}<small>/5</small></strong><span>{copy.prayer}</span></Link>
        <Link href="/saved"><strong>{snapshot.saved}</strong><span>{copy.saved}</span></Link>
        <button type="button" onClick={() => onSelect("quran")}><strong>{snapshot.readingDays}</strong><span>{copy.reading}</span></button>
      </div>
      <div className="noor-recent-tools"><span>{copy.recent}</span>{recent.length ? recent.map((feature) => <button type="button" onClick={() => onSelect(feature)} key={feature}>{LABELS[feature]}<i aria-hidden="true">→</i></button>) : <small>{copy.none}</small>}</div>
    </section>
  );
}
