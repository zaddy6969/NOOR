"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DOWNLOAD_CACHE,
  DOWNLOAD_INDEX,
  downloadSurah,
  readDownloadIndex,
  type DownloadEntry,
} from "./downloads";
export default function OfflineManager() {
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
    const sync = () => setEntries(readDownloadIndex());
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
      localStorage.setItem(DOWNLOAD_INDEX, JSON.stringify(remaining));
      setEntries(remaining);
      setMessage("Download removed.");
    } catch {
      setMessage("Unable to remove download.");
    }
  };
  return (
    <section className="offline-manager">
      <h2>Download a Surah</h2>
      <p>
        Download while connected. Arabic and the selected translation are
        included. Audio is optional and may use substantial storage. Study tools
        such as tafsir and word meanings still require a connection.
      </p>
      <div className="offline-controls">
        <label>
          Surah
          <select
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
          </select>
        </label>
        <label>
          Translation
          <select
            value={translation}
            onChange={(event) => setTranslation(event.target.value)}
          >
            <option value="en.sahih">Saheeh International</option>
            <option value="en.pickthall">Pickthall</option>
            <option value="ur.jalandhry">Urdu · Jalandhry</option>
            <option value="hi.hindi">Hindi · provider edition</option>
          </select>
        </label>
        <label>
          Reciter
          <select
            value={reciter}
            onChange={(event) => setReciter(event.target.value)}
          >
            <option value="alafasy">Alafasy</option>
            <option value="sudais">Sudais</option>
            <option value="husary">Husary</option>
            <option value="minshawi">Minshawi</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={audio}
            onChange={(event) => setAudio(event.target.checked)}
          />{" "}
          Include full Surah audio
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setMessage("Downloading… Keep this page open.");
            try {
              await downloadSurah(surah, translation, reciter, audio);
              setEntries(readDownloadIndex());
              setMessage(
                "Download complete. You can now read this selection offline.",
              );
            } catch (reason) {
              setMessage(
                reason instanceof Error ? reason.message : "Download failed.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {" "}
          {busy ? "Downloading…" : "Download selected Surah"}
        </button>
      </div>
      <p role="status">{message}</p>
      <h2>Your downloads</h2>
      <p>
        {entries.length} selections ·{" "}
        {(
          entries.reduce((sum, entry) => sum + entry.bytes, 0) / 1048576
        ).toFixed(1)}{" "}
        MB. Browser storage may be cleared by your device.
      </p>
      {entries.length ? (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.title}</strong>
              <small>
                {entry.audioUrl ? "Reading + audio" : "Reading"} ·{" "}
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
                Open downloaded Surah →
              </Link>
              <button type="button" onClick={() => void remove(entry)}>
                Remove download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Quran selections downloaded yet.</p>
      )}
      <p>
        Daily duas are included in the prepared offline pages.{" "}
        <Link href="/duas">Open daily duas →</Link>
      </p>
    </section>
  );
}
