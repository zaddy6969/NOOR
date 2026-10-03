"use client";
import { useState } from "react";
import { PERSONAL_KEYS, backupEntries } from "../../lib/personal-backup";
import { SAVED_ITEMS_EVENT } from "../site/saved-items";
const KEYS = PERSONAL_KEYS;
export default function PersonalDataControls() {
  const [notice, setNotice] = useState("");
  const [confirm, setConfirm] = useState(false);
  const download = () => {
    try {
      const entries = Object.fromEntries(
        KEYS.map((key) => [key, localStorage.getItem(key)]).filter(
          ([, value]) => value !== null,
        ),
      );
      const url = URL.createObjectURL(
        new Blob(
          [
            JSON.stringify(
              { version: 1, exportedAt: new Date().toISOString(), entries },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "NOOR-private-backup.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(
        "Backup downloaded. It contains private notes and progress; keep it safe.",
      );
    } catch {
      setNotice("Unable to export browser data.");
    }
  };
  const restore = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 1000000)
        throw new Error("Backup exceeds the 1 MB limit.");
      const entries = backupEntries(JSON.parse(await file.text()));
      for (const [key, value] of entries)
        localStorage.setItem(key, value as string);
      window.dispatchEvent(new Event(SAVED_ITEMS_EVENT));
      window.dispatchEvent(new Event("noor:quran-progress"));
      setNotice(
        "Backup restored. Reload an open reader to refresh its notes. Matching local entries were replaced.",
      );
    } catch (reason) {
      setNotice(
        reason instanceof Error
          ? reason.message
          : "Backup could not be restored.",
      );
    }
  };
  return (
    <section className="personal-data-controls">
      <div>
        <strong>Your private data</strong>
        <p>
          Export or restore bookmarks, notes and reading/Qaza progress. Accounts
          and location are excluded.
        </p>
      </div>
      <div>
        <button type="button" onClick={download}>
          Export backup
        </button>
        <label className="file-action">
          Restore backup
          <input
            type="file"
            accept=".json,application/json"
            onChange={(event) => void restore(event.target.files?.[0])}
          />
        </label>
        <button type="button" onClick={() => setConfirm(true)}>
          Delete local personal data
        </button>
      </div>
      {confirm ? (
        <div>
          <p>
            Delete local bookmarks, notes, counters and plans? Export first if
            you want to keep them. This does not delete cloud data or offline
            downloads.
          </p>
          <button
            type="button"
            onClick={() => {
              KEYS.forEach((key) => localStorage.removeItem(key));
              window.dispatchEvent(new Event(SAVED_ITEMS_EVENT));
              setConfirm(false);
              setNotice("Local personal data deleted.");
            }}
          >
            Confirm deletion
          </button>
          <button type="button" onClick={() => setConfirm(false)}>
            Cancel
          </button>
        </div>
      ) : null}
      <p role="status">{notice}</p>
    </section>
  );
}
