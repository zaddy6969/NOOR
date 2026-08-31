"use client";

import Link from "next/link";
import { useState } from "react";
import { readSavedCollections, SAVED_KEYS, writeSavedList } from "../site/saved-items";

type RemotePayload = {
  saved?: { quranVerses?: string[]; quranSurahs?: string[]; darood?: string[]; lughat?: string[] };
  quran?: { progress?: Record<string, unknown> | null; preferences?: Record<string, unknown>; readingDays?: string[]; notes?: Record<string, string> };
};

function readObject(key: string) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "null") as unknown;
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function readList(key: string) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mergeList(local: string[], remote: string[] | undefined) {
  return [...new Set([...local, ...(Array.isArray(remote) ? remote : [])])];
}

function collectPayload() {
  return {
    version: 1,
    saved: readSavedCollections(),
    quran: {
      progress: readObject("noor-quran-progress-v1"),
      preferences: readObject("noor-quran-preferences-v1"),
      readingDays: readList("noor-quran-reading-days-v1"),
      notes: readObject("noor-quran-notes-v1"),
    },
    updatedAt: new Date().toISOString(),
  };
}

function applyRemote(remote: RemotePayload) {
  const local = readSavedCollections();
  writeSavedList(SAVED_KEYS.quranVerses, mergeList(local.quranVerses, remote.saved?.quranVerses));
  writeSavedList(SAVED_KEYS.quranSurahs, mergeList(local.quranSurahs, remote.saved?.quranSurahs));
  writeSavedList(SAVED_KEYS.darood, mergeList(local.darood, remote.saved?.darood));
  writeSavedList(SAVED_KEYS.lughat, mergeList(local.lughat, remote.saved?.lughat));
  if (remote.quran?.progress && Object.keys(remote.quran.progress).length) {
    const localProgress = readObject("noor-quran-progress-v1");
    const localTime = Date.parse(String(localProgress.updatedAt ?? "")) || 0;
    const remoteTime = Date.parse(String(remote.quran.progress.updatedAt ?? "")) || 0;
    if (remoteTime > localTime) window.localStorage.setItem("noor-quran-progress-v1", JSON.stringify(remote.quran.progress));
  }
  if (remote.quran?.preferences) window.localStorage.setItem("noor-quran-preferences-v1", JSON.stringify({ ...readObject("noor-quran-preferences-v1"), ...remote.quran.preferences }));
  window.localStorage.setItem("noor-quran-reading-days-v1", JSON.stringify(mergeList(readList("noor-quran-reading-days-v1"), remote.quran?.readingDays)));
  if (remote.quran?.notes) window.localStorage.setItem("noor-quran-notes-v1", JSON.stringify({ ...readObject("noor-quran-notes-v1"), ...remote.quran.notes }));
}

export default function SavedSync({ configured }: { configured: boolean }) {
  const [state, setState] = useState<"idle" | "syncing" | "done" | "error" | "signin">("idle");
  const [message, setMessage] = useState(configured ? "Nothing is uploaded unless you press Sync." : "Account sync is unavailable until secure production sign-in is connected.");

  const sync = async () => {
    setState("syncing");
    setMessage("Securely checking your account collection…");
    try {
      const remoteResponse = await fetch("/api/account/sync", { cache: "no-store" });
      if (remoteResponse.status === 401) {
        setState("signin");
        setMessage("Sign in to sync this collection across devices.");
        return;
      }
      const remoteResult = await remoteResponse.json() as { data?: RemotePayload | null; error?: string };
      if (!remoteResponse.ok) throw new Error(remoteResult.error ?? "Account sync is not available yet.");
      if (remoteResult.data) applyRemote(remoteResult.data);

      const saveResponse = await fetch("/api/account/sync", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(collectPayload()),
      });
      const saveResult = await saveResponse.json() as { error?: string };
      if (!saveResponse.ok) throw new Error(saveResult.error ?? "Unable to save your account collection.");
      setState("done");
      setMessage(`Synced securely at ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date())}.`);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Account sync is temporarily unavailable.");
    }
  };

  return (
    <aside className={`saved-sync saved-sync-${state}`} aria-label="Account sync">
      <div><strong>Optional account sync</strong><span>{message}</span></div>
      {!configured ? <span className="saved-sync-unavailable" aria-disabled="true">Not configured</span> : state === "signin" ? <Link href="/sign-in">Sign in</Link> : <button type="button" onClick={sync} disabled={state === "syncing"}>{state === "syncing" ? "Syncing…" : state === "done" ? "Sync again" : "Sync across devices"}</button>}
    </aside>
  );
}
