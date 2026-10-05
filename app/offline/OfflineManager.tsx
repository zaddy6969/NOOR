"use client";
import { personalStorage } from "@/lib/personal-storage";

import NoorSelect from "../site/NoorSelect";
import InstallGuide from "./InstallGuide";
import { useNoorCopy } from "../site/SiteUtilities";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  DOWNLOAD_CACHE,
  DOWNLOAD_INDEX,
  downloadSurah,
  readDownloadIndex,
  type DownloadEntry,
  type DownloadProgress,
} from "./downloads";
export default function OfflineManager() {
  const { t } = useNoorCopy();
  const cancel = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [storage, setStorage] = useState<{ usage?: number; quota?: number; persisted?: boolean }>({});
  const estimate = async () => {
    if (navigator.storage?.estimate) {
      try { setStorage({ ...await navigator.storage.estimate(), persisted: await navigator.storage.persisted() }); } catch { /* storage estimates are optional */ }
    }
  };
  useEffect(() => { const frame = requestAnimationFrame(() => void estimate()); return () => { cancelAnimationFrame(frame); cancel.current?.abort(); }; }, []);
  const [entries, setEntries] = useState<DownloadEntry[]>([]);
  const [surahs, setSurahs] = useState<
    Array<{ number: number; englishName: string }>
  >([]);
  const [surah, setSurah] = useState(1);
  const [translation, setTranslation] = useState("en.sahih");
  const [reciter, setReciter] = useState("alafasy");
  const [audio, setAudio] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const sync = () => { setEntries(readDownloadIndex()); void estimate(); };
    sync();
    window.addEventListener("noor:downloads", sync);
    fetch("/api/quran/surahs")
      .then((response) => response.json())
      .then((payload) => setSurahs(payload.surahs ?? []))
      .catch(() => undefined);
    return () => window.removeEventListener("noor:downloads", sync);
  }, []);
  const remove = async (entry: DownloadEntry) => {
    try {
      const remaining = readDownloadIndex().filter(
        (item) => item.id !== entry.id,
      );
      const cache = await caches.open(DOWNLOAD_CACHE);
      await cache.delete(entry.url);
      if (
        entry.audioUrl &&
        !remaining.some((item) => item.audioUrl === entry.audioUrl)
      )
        await cache.delete(entry.audioUrl);
      personalStorage.setItem(DOWNLOAD_INDEX, JSON.stringify(remaining));
      setEntries(remaining);
      setMessage("Download removed.");
    } catch {
      setMessage("Unable to remove download.");
    }
  };
  return (
    <section className="offline-manager">
      <InstallGuide />
      <h2>{t("Download a Surah")}</h2>
      <p>
        {t("Download while connected. Arabic and the selected translation are included. Audio is optional and may use substantial storage. Study tools such as tafsir and word meanings still require a connection.")}
      </p>
      <div className="offline-controls">
        <label>
          {t("Surah")}
          <NoorSelect aria-label={t("Surah")}
            value={surah}
            onChange={(event) => setSurah(Number(event.target.value))}
          >
            {(surahs.length
              ? surahs
              : [{ number: 1, englishName: "Al-Fatihah" }]
            ).map((item) => (
              <option key={item.number} value={item.number}>
                {item.number}. {item.englishName}
              </option>
            ))}
          </NoorSelect>
        </label>
        <label>
          {t("Translation")}
          <NoorSelect aria-label={t("Translation")}
            value={translation}
            onChange={(event) => setTranslation(event.target.value)}
          >
            <option value="en.sahih">Saheeh International</option>
            <option value="en.pickthall">Pickthall</option>
            <option value="ur.jalandhry">Urdu · Jalandhry</option>
            <option value="hi.hindi">Hindi · Farooq Khan & Nadwi</option>
          </NoorSelect>
        </label>
        <label>
          {t("Reciter")}
          <NoorSelect aria-label={t("Reciter")}
            value={reciter}
            onChange={(event) => setReciter(event.target.value)}
          >
            <option value="alafasy">Alafasy</option>
            <option value="sudais">Sudais</option>
            <option value="husary">Husary</option>
            <option value="minshawi">Minshawi</option>
          </NoorSelect>
        </label>
        <label>
          <input
            type="checkbox"
            checked={audio}
            onChange={(event) => setAudio(event.target.checked)}
          />{" "}
          {t("Include full Surah audio")}
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            cancel.current = new AbortController();
            setProgress(null);
            setMessage("Downloading… Keep this page open.");
            try {
              await downloadSurah(surah, translation, reciter, audio, setProgress, cancel.current.signal);
              void estimate();
              setEntries(readDownloadIndex());
              setMessage(
                "Download complete. You can now read this selection offline.",
              );
            } catch (reason) {
              setMessage(
                reason instanceof Error && reason.name === "AbortError" ? "Download cancelled." : reason instanceof Error ? reason.message : "Download failed.",
              );
            } finally {
              setBusy(false);
              cancel.current = null;
            }
          }}
        >
          {" "}
          {t(busy ? "Downloading…" : "Download selected Surah")}
        </button>
      </div>
      {busy ? <div className="download-progress"><progress aria-label={t("Download progress")} {...(progress?.total ? { value: progress.received ?? 0, max: progress.total } : {})} /><span>{t(progress?.stage ?? "")}{progress?.received !== undefined ? ` · ${(progress.received / 1048576).toFixed(1)} MB${progress.total ? ` / ${(progress.total / 1048576).toFixed(1)} MB` : ""}` : ""}</span><button type="button" onClick={() => cancel.current?.abort()}>{t("Cancel download")}</button></div> : null}
      <p role="status">{t(message)}</p>
      <section className="noor-feature-card"><h2>{t("Device storage")}</h2><p>{storage.quota ? t("{used} MB used of {quota} MB available to this website.", { used: ((storage.usage ?? 0) / 1048576).toFixed(1), quota: (storage.quota / 1048576).toFixed(0) }) : t("Your browser does not expose a storage estimate.")} {t(storage.persisted ? "Persistent storage granted." : "Downloads may be cleared by your browser.")}</p><button type="button" onClick={async () => { try { const granted = await navigator.storage?.persist?.(); setMessage(granted ? "Persistent storage granted. Your device settings can still clear downloads." : "Persistent storage was not granted. Keep a backup of private notes."); await estimate(); } catch { setMessage("Persistent storage is unavailable in this browser."); } }}>{t("Keep downloads on this device")}</button><button type="button" onClick={async () => { try { const cache = await caches.open(DOWNLOAD_CACHE); const missing: string[] = []; for (const entry of readDownloadIndex()) { if (!(await cache.match(entry.url)) || (entry.audioUrl && !(await cache.match(entry.audioUrl)))) missing.push(entry.title); } setMessage(missing.length ? t("Missing downloads: {titles}. Remove and download them again while connected.", { titles: missing.join(", ") }) : t("{count} selections checked. All indexed reading and audio files are present.", { count: readDownloadIndex().length })); } catch { setMessage("Download verification is unavailable."); } }}>{t("Verify downloads")}</button></section>
      <h2>{t("Your downloads")}</h2>
      <p>
        {t("{count} selections · {size} MB. Browser storage may be cleared by your device.", { count: entries.length, size: (entries.reduce((sum, entry) => sum + entry.bytes, 0) / 1048576).toFixed(1) })}
      </p>
      {entries.length ? (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.title}</strong>
              <small>
                {t(entry.audioUrl ? "Reading + audio" : "Reading")} ·{" "}
                {(entry.bytes / 1048576).toFixed(1)} MB ·{" "}
                {entry.savedAt.slice(0, 10)}
              </small>
              <Link
                href={
                  "/quran?" +
                  new URLSearchParams({
                    surah: entry.id.split(":")[0],
                    translation: entry.id.split(":").slice(1, -1).join(":"),
                    reciter: entry.id.split(":").at(-1)!,
                  })
                }
              >
                {t("Open downloaded Surah")} →
              </Link>
              <button type="button" onClick={() => void remove(entry)}>
                {t("Remove download")}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t("No Quran selections downloaded yet.")}</p>
      )}
      <p>
        {t("Daily duas are included in the prepared offline pages.")}{" "}
        <Link href="/duas">{t("Open daily duas")} →</Link>
      </p>
    </section>
  );
}
