"use client";
import Link from "next/link";
import { useState } from "react";
import { downloadSurah } from "./downloads";
export default function DownloadButton({
  surah,
  translation,
  reciter,
}: {
  surah: number;
  translation: string;
  reciter: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="download-button">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMessage("Preparing offline reading…");
          try {
            await downloadSurah(surah, translation, reciter, false);
            setMessage("Surah downloaded for offline reading.");
          } catch (reason) {
            setMessage(
              reason instanceof Error ? reason.message : "Download failed.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Downloading…" : "Download for offline reading"}
      </button>
      <Link href="/offline">Manage downloads & audio →</Link>
      <span role="status">{message}</span>
    </div>
  );
}
