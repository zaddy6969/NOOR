"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readSavedCollections,
  SAVED_KEYS,
  writeSavedList,
} from "../site/saved-items";

import { mergeSync, sanitizeSync, type SyncPayload } from "@/lib/account-sync";
import { PLAN_KEY } from "@/lib/quran-plan";

function readObject(key: string) {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(key) ?? "null",
    ) as unknown;
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function readList(key: string) {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(key) ?? "[]",
    ) as unknown;
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function collectPayload(includeNotes: boolean) {
  return {
    version: 1,
    saved: readSavedCollections(),
    quran: {
      progress: readObject("noor-quran-progress-v1"),
      preferences: readObject("noor-quran-preferences-v1"),
      readingDays: readList("noor-quran-reading-days-v1"),
      ...(includeNotes ? { notes: readObject("noor-quran-notes-v1") } : {}),
      plan: readObject(PLAN_KEY),
      readingGoal: Number(localStorage.getItem("noor-reading-goal-v1") ?? 0),
      readAyahs: readObject("noor-read-ayahs-v1"),
    },
  };
}
function applyRemote(data: SyncPayload, includeNotes: boolean) {
  for (const field of ["duas", "quranVerses", "quranSurahs", "darood", "lughat"] as const)
    writeSavedList(SAVED_KEYS[field], data.saved[field]);
  const entries: Array<[string, unknown]> = [
    ["noor-quran-progress-v1", data.quran.progress],
    ["noor-quran-preferences-v1", data.quran.preferences],
    ["noor-quran-reading-days-v1", data.quran.readingDays],
    ["noor-reading-goal-v1", data.quran.readingGoal],
    ["noor-read-ayahs-v1", data.quran.readAyahs],
    [PLAN_KEY, data.quran.plan],
  ];
  if (includeNotes) entries.push(["noor-quran-notes-v1", data.quran.notes]);
  for (const [key, value] of entries) if (value !== undefined && value !== null) localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("noor:quran-progress"));
  window.dispatchEvent(new Event("noor:plan-change"));
}

export default function SavedSync({ configured }: { configured: boolean }) {
  const [includeNotes, setIncludeNotes] = useState(false);
  const [consent, setConsent] = useState(false);
  const [lastSync, setLastSync] = useState("");
  useEffect(() => { try { setLastSync(localStorage.getItem("noor-last-sync-v1") ?? ""); } catch { /* optional status */ } }, []);
  const [state, setState] = useState<
    "idle" | "syncing" | "done" | "error" | "signin"
  >("idle");
  const [message, setMessage] = useState(
    configured
      ? "Nothing is uploaded unless you press Sync."
      : "Account sync is unavailable until secure production sign-in is connected.",
  );

  const sync = async () => {
    setState("syncing");
    setMessage("Securely checking your account collection…");
    try {
      const remoteResponse = await fetch("/api/account/sync", {
        cache: "no-store",
      });
      if (remoteResponse.status === 401) {
        setState("signin");
        setMessage("Sign in to sync this collection across devices.");
        return;
      }
      const remoteResult = (await remoteResponse.json()) as {
        data?: SyncPayload | null;
        error?: string;
      };
      if (!remoteResponse.ok)
        throw new Error(
          remoteResult.error ?? "Account sync is not available yet.",
        );
      const local = collectPayload(includeNotes);
      const merged = mergeSync(local, remoteResult.data ?? {}, includeNotes);
      const remoteNotes = remoteResult.data?.quran?.notes ?? {};
      const localNotes = includeNotes ? readObject("noor-quran-notes-v1") : {};
      const conflicts = Object.keys(localNotes).filter((key) => remoteNotes[key] !== undefined && localNotes[key] !== remoteNotes[key]).length;

      const saveResponse = await fetch("/api/account/sync", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...merged, expectedUpdatedAt: remoteResult.data?.updatedAt ?? null }),
      });
      const saveResult = (await saveResponse.json()) as { error?: string; data?: SyncPayload };
      if (!saveResponse.ok)
        throw new Error(
          saveResult.error ?? "Unable to save your account collection.",
        );
      if (!saveResult.data) throw new Error("Sync returned no account data.");
      applyRemote(sanitizeSync(saveResult.data), includeNotes);
      const time = new Date().toISOString();
      localStorage.setItem("noor-last-sync-v1", time);
      setLastSync(time);
      setState("done");
      setMessage(
        `Synced securely at ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date())}.${conflicts ? ` ${conflicts} note conflicts kept this device’s text. Reload the reader to see synced notes.` : ""}`,
      );
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Account sync is temporarily unavailable.",
      );
    }
  };

  return (
    <aside
      className={`saved-sync saved-sync-${state}`}
      aria-label="Account sync"
    >
      <div>
        <strong>Optional account sync</strong>
        <span>{message}</span>
        {lastSync ? <small>Last successful sync: {new Date(lastSync).toLocaleString()}</small> : null}
        <p>Merge saved items, Quran progress, preferences and completion plans. Nothing is uploaded automatically. Downloads and precise location stay on your device.</p>
        {configured ? <><label><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> I agree to sync my saved items and progress to my account.</label><label><input type="checkbox" checked={includeNotes} onChange={(event) => setIncludeNotes(event.target.checked)} /> Include my private Quran notes (optional).</label></> : <p>Use Export backup below to transfer your private data until account services are connected.</p>}
        <a href="/content-review">Content review and sources →</a>
      </div>
      {!configured ? (
        <span className="saved-sync-unavailable" aria-disabled="true">
          Not configured
        </span>
      ) : state === "signin" ? (
        <Link href="/sign-in">Sign in</Link>
      ) : (
        <button type="button" onClick={sync} disabled={state === "syncing" || !consent}>
          {state === "syncing"
            ? "Syncing…"
            : state === "done"
              ? "Sync again"
              : "Sync across devices"}
        </button>
      )}
    </aside>
  );
}
