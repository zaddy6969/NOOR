"use client";

import { useNoorCopy } from "../site/SiteUtilities";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { daroodEntries } from "../darood/DaroodLibrary";
import { lughatEntries } from "../firozul-lughat/lughat-data";
import {
  readSavedCollections,
  readSavedList,
  SAVED_ITEMS_EVENT,
  SAVED_KEYS,
  savedItemsTotal,
  type SavedCollections,
  writeSavedList,
} from "../site/saved-items";
import { DUAS } from "../duas/dua-data";
import PersonalDataControls from "./PersonalDataControls";
import SavedSync from "./SavedSync";

type Filter = "all" | "quran" | "duas" | "darood" | "lughat";
type SurahSummary = {
  number: number;
  englishName: string;
  englishNameTranslation: string;
};

const EMPTY_COLLECTIONS: SavedCollections = {
  quranVerses: [],
  duas: [],
  quranSurahs: [],
  darood: [],
  lughat: [],
};

function BookmarkMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V22l-6-3.8L6 22Z" />
    </svg>
  );
}

export default function SavedLibrary({
  syncConfigured,
}: {
  syncConfigured: boolean;
}) {
  const { t } = useNoorCopy();
  const [collections, setCollections] =
    useState<SavedCollections>(EMPTY_COLLECTIONS);
  const [filter, setFilter] = useState<Filter>("all");
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const sync = () => setCollections(readSavedCollections());
    sync();
    window.addEventListener(SAVED_ITEMS_EVENT, sync);
    window.addEventListener("storage", sync);
    fetch("/api/quran/surahs")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { surahs?: SurahSummary[] }) => {
        if (Array.isArray(payload.surahs)) setSurahs(payload.surahs);
      })
      .catch(() => undefined);
    return () => {
      window.removeEventListener(SAVED_ITEMS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const surahByNumber = useMemo(
    () => new Map(surahs.map((surah) => [surah.number, surah])),
    [surahs],
  );
  const quranCount =
    collections.quranVerses.length + collections.quranSurahs.length;
  const total = savedItemsTotal(collections);

  const remove = (key: string, id: string, label: string) => {
    if (!writeSavedList(
      key,
      readSavedList(key).filter((item) => item !== id),
    )) return;
    setCollections(readSavedCollections());
    setNotice(t("{label} removed from Saved", { label }));
    window.setTimeout(() => setNotice(""), 1700);
  };

  const sections = {
    quran: filter === "all" || filter === "quran",
    duas: filter === "all" || filter === "duas",
    darood: filter === "all" || filter === "darood",
    lughat: filter === "all" || filter === "lughat",
  };

  return (
    <section className="saved-library">
      <header className="saved-summary">
        <div>
          <h1>{t("Saved")}</h1>
          <p>{t("Saved on this device")}</p>
        </div>
        <strong>
          <b>{total}</b>
          <small>{t(total === 1 ? "item" : "items")}</small>
        </strong>
      </header>
      {total > 0 ? (
      <nav className="saved-filters" aria-label={t("Filter saved items")}>
        {(
          [
            ["all", "All", total],
            ["quran", "Quran", quranCount],
            ["duas", "Duas", collections.duas.length],
            ["darood", "Darood", collections.darood.length],
            ["lughat", "Glossary", collections.lughat.length],
          ] as Array<[Filter, string, number]>
        ).map(([id, label, count]) => (
          <button
            className={filter === id ? "active" : ""}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            key={id}
          >
            {t(label)}
            <span>{count}</span>
          </button>
        ))}
      </nav>
      ) : null}

      {total === 0 ? (
        <div className="saved-empty">
          <BookmarkMark />
          <h2>{t("Nothing saved yet")}</h2>
          <p>{t("Save an Ayah or dua to find it here.")}</p>
          <div>
            <Link href="/quran">{t("Read Quran")}</Link>
            <Link href="/duas">{t("Duas")}</Link>
          </div>
        </div>
      ) : (
        <div className="saved-sections">
          {sections.quran && quranCount > 0 ? (
            <section aria-labelledby="saved-quran-title">
              <header>
                <div>
                  <span>01</span>
                  <h2 id="saved-quran-title">{t("Quran")}</h2>
                </div>
                <small>{quranCount} {t("saved")}</small>
              </header>
              <div className="saved-card-grid">
                {collections.quranSurahs.map((id) => {
                  const number = Number(id);
                  const surah = surahByNumber.get(number);
                  return (
                    <article
                      className="saved-card saved-quran-card"
                      key={`surah-${id}`}
                    >
                      <span>{t("SAVED SURAH")}</span>
                      <h3>
                        {surah ? `${t("Surah")} ${surah.englishName}` : `${t("Surah")} ${id}`}
                      </h3>
                      <p>
                        {surah?.englishNameTranslation ??
                          ""}
                      </p>
                      <footer>
                        <Link href={`/quran?surah=${id}`}>
                          {t("Open Surah")} <b aria-hidden="true">↗</b>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            remove(SAVED_KEYS.quranSurahs, id, `${t("Surah")} ${id}`)
                          }
                        >
                          {t("Remove")}
                        </button>
                      </footer>
                    </article>
                  );
                })}
                {collections.quranVerses.map((reference) => {
                  const [surahNumber, ayahNumber] = reference.split(":");
                  const surah = surahByNumber.get(Number(surahNumber));
                  return (
                    <article
                      className="saved-card saved-quran-card"
                      key={`verse-${reference}`}
                    >
                      <span>{t("SAVED AYAH")}</span>
                      <h3>{t("Quran")} <bdi>{reference}</bdi></h3>
                      <p>
                        {surah
                          ? `${surah.englishName} · ${surah.englishNameTranslation}`
                          : ""}
                      </p>
                      <footer>
                        <Link
                          href={`/quran?surah=${surahNumber}&ayah=${ayahNumber}`}
                        >
                          {t("Open Ayah")} <b aria-hidden="true">↗</b>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            remove(
                              SAVED_KEYS.quranVerses,
                              reference,
                              `Quran ${reference}`,
                            )
                          }
                        >
                          {t("Remove")}
                        </button>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {sections.duas && collections.duas.length > 0 ? (
            <section aria-labelledby="saved-duas-title">
              <header>
                <h2 id="saved-duas-title">{t("Daily Duas")}</h2>
              </header>
              <div className="saved-card-grid">
                {collections.duas.map((id) => {
                  const dua = DUAS.find((item) => item.id === id);
                  return dua ? (
                    <article className="saved-card" key={id}>
                      <span>
                        {dua.source}
                        {dua.excerpt ? " · " + t("excerpt") : ""}
                      </span>
                      <h3>{dua.title}</h3>
                      <p className="saved-arabic" lang="ar" dir="rtl">
                        {dua.arabic}
                      </p>
                      <footer>
                        <Link href={"/duas?dua=" + id}>{t("Open dua")} →</Link>
                        <button
                          type="button"
                          onClick={() => remove(SAVED_KEYS.duas, id, dua.title)}
                        >
                          {t("Remove")}
                        </button>
                      </footer>
                    </article>
                  ) : null;
                })}
              </div>
            </section>
          ) : null}

          {sections.darood && collections.darood.length > 0 ? (
            <section aria-labelledby="saved-darood-title">
              <header>
                <div>
                  <span>02</span>
                  <h2 id="saved-darood-title">{t("Darood Sharif")}</h2>
                </div>
                <small>{collections.darood.length} {t("saved")}</small>
              </header>
              <div className="saved-card-grid">
                {collections.darood.map((id) => {
                  const entry = daroodEntries.find((item) => item.id === id);
                  if (!entry) return null;
                  return (
                    <article className="saved-card" key={id}>
                      <span>{entry.category.toUpperCase()}</span>
                      <h3>{entry.title}</h3>
                      <p>{entry.alternate}</p>
                      <p className="saved-arabic" lang="ar" dir="rtl">
                        {entry.arabic}
                      </p>
                      <footer>
                        <Link href={`/darood#${id}`}>
                          {t("Open Darood")} <b aria-hidden="true">↗</b>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            remove(SAVED_KEYS.darood, id, entry.title)
                          }
                        >
                          {t("Remove")}
                        </button>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {sections.lughat && collections.lughat.length > 0 ? (
            <section aria-labelledby="saved-lughat-title">
              <header>
                <div>
                  <span>03</span>
                  <h2 id="saved-lughat-title">{t("Islamic Glossary")}</h2>
                </div>
                <small>{collections.lughat.length} {t("saved")}</small>
              </header>
              <div className="saved-card-grid">
                {collections.lughat.map((id) => {
                  const entry = lughatEntries.find((item) => item.id === id);
                  if (!entry) return null;
                  return (
                    <article className="saved-card" key={id}>
                      <span>{entry.category.toUpperCase()}</span>
                      <div className="saved-term">
                        <h3>{entry.term}</h3>
                        <b lang="ur" dir="rtl">
                          {entry.urdu}
                        </b>
                      </div>
                      <p>{entry.meaning}</p>
                      <footer>
                        <Link href={`/glossary#${id}`}>
                          {t("Open word")} <b aria-hidden="true">↗</b>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            remove(SAVED_KEYS.lughat, id, entry.term)
                          }
                        >
                          {t("Remove")}
                        </button>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      )}
      {total > 0 && filter !== "all" && !({ quran: quranCount, duas: collections.duas.length, darood: collections.darood.length, lughat: collections.lughat.length }[filter]) ? <p className="saved-filter-empty" role="status">{t("No saved items in this category.")}</p> : null}
      <details className="saved-management">
        <summary>{t("Collection settings")}</summary>
        {syncConfigured ? <SavedSync configured={syncConfigured} setupStatus="" /> : <p>{t("Cross-device sync is currently unavailable.")}</p>}
        <PersonalDataControls />
      </details>
      {notice ? (
        <div className="quran-notice" role="status">
          {notice}
        </div>
      ) : null}
    </section>
  );
}
