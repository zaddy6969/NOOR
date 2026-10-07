"use client";
import { personalOwner, writePersonalBatch, ACCOUNT_CHANGE_EVENT, personalStorage } from "@/lib/personal-storage";


import { useNoorCopy } from "../site/SiteUtilities";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  readSavedCollections,
  SAVED_KEYS,
  SAVED_ITEMS_EVENT,
} from "../site/saved-items";

import { mergeSync, sanitizeSync, type SyncPayload } from "@/lib/account-sync";
import { PLAN_KEY } from "@/lib/quran-plan";

function readObject(key: string) {
  try {
    const value = JSON.parse(
      personalStorage.getItem(key) ?? "null",
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
      personalStorage.getItem(key) ?? "[]",
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
    savedChanges: readObject("noor-saved-changes-v1"),
    quran: {
      progress: readObject("noor-quran-progress-v1"),
      preferences: readObject("noor-quran-preferences-v1"),
      readingDays: readList("noor-quran-reading-days-v1"),
      ...(includeNotes ? { notes: readObject("noor-quran-notes-v1") } : {}),
      plan: readObject(PLAN_KEY),
      readingGoal: Number(personalStorage.getItem("noor-reading-goal-v1") ?? 0),
      readAyahs: readObject("noor-read-ayahs-v1"),
    },
  };
}
function applyRemote(data: SyncPayload, includeNotes: boolean, owner: string, time: string) {
  const entries: Array<[string, unknown]> = [
    ...Object.entries(SAVED_KEYS).map(([field, key]) => [key, data.saved[field as keyof typeof data.saved]] as [string, unknown]),
    ["noor-saved-changes-v1", data.savedChanges ?? {}],
    ["noor-quran-progress-v1", data.quran.progress],
    ["noor-quran-preferences-v1", data.quran.preferences],
    ["noor-quran-reading-days-v1", data.quran.readingDays],
    ["noor-reading-goal-v1", data.quran.readingGoal],
    ["noor-read-ayahs-v1", data.quran.readAyahs],
    [PLAN_KEY, data.quran.plan],
  ];
  if (includeNotes) entries.push(["noor-quran-notes-v1", data.quran.notes]);
  writePersonalBatch([...entries.filter(([, value]) => value !== undefined).map(([key, value]) => [key, JSON.stringify(value)] as [string, string]), ["noor-last-sync-v1", time]], owner);
  window.dispatchEvent(new Event(SAVED_ITEMS_EVENT));
  window.dispatchEvent(new Event("noor:quran-progress"));
  window.dispatchEvent(new Event("noor:plan-change"));
}

export default function SavedSync({ configured, setupStatus }: { configured: boolean; setupStatus: string }) {
  const { t, locale } = useNoorCopy();
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => {
    const cancel = () => requestRef.current?.abort();
    window.addEventListener(ACCOUNT_CHANGE_EVENT, cancel);
    return () => { cancel(); window.removeEventListener(ACCOUNT_CHANGE_EVENT, cancel); };
  }, []);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [consent, setConsent] = useState(false);
  const [lastSync, setLastSync] = useState("");
  useEffect(() => {
    const refresh = () => { try { const stored = personalStorage.getItem("noor-last-sync-v1") ?? ""; setLastSync(Number.isFinite(Date.parse(stored)) ? stored : ""); } catch { /* optional status */ } };
    const frame = requestAnimationFrame(refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(SAVED_ITEMS_EVENT, refresh);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("storage", refresh); window.removeEventListener(SAVED_ITEMS_EVENT, refresh); };
  }, []);
  const [state, setState] = useState<
    "idle" | "syncing" | "done" | "error" | "signin"
  >("idle");
  const [message, setMessage] = useState(
    configured
      ? "Nothing is uploaded unless you press Sync."
      : "Account sync is unavailable until secure production sign-in is connected.",
  );

  const sync = async () => {
    const owner = personalOwner();
    if (!owner || owner === "guest") { setState("signin"); setMessage("Sign in to sync this collection across devices."); return; }
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]);
    const ensureOwner = () => { if (personalOwner() !== owner || controller.signal.aborted) throw new Error("Your account changed. Please sync again."); };
    setState("syncing");
    setMessage("Securely checking your account collection…");
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        ensureOwner();
        const remoteResponse = await fetch("/api/account/sync", { cache: "no-store", headers: { "x-noor-account": owner }, signal });
        ensureOwner();
        if (remoteResponse.status === 401) { setState("signin"); setMessage("Sign in to sync this collection across devices."); return; }
        const remoteResult = await remoteResponse.json() as { data?: SyncPayload | null; error?: string };
        if (!remoteResponse.ok) throw new Error(remoteResult.error ?? "Account sync is not available yet.");
        ensureOwner();
        const local = collectPayload(includeNotes);
        const merged = mergeSync(local, remoteResult.data ?? {}, includeNotes);
        const remoteNotes = remoteResult.data?.quran?.notes ?? {};
        const localNotes = includeNotes ? readObject("noor-quran-notes-v1") : {};
        const conflicts = Object.keys(localNotes).filter(key => remoteNotes[key] !== undefined && localNotes[key] !== remoteNotes[key]).length;
        const saveResponse = await fetch("/api/account/sync", {
          method: "PUT", headers: { "content-type": "application/json", "x-noor-account": owner }, signal,
          body: JSON.stringify({ ...merged, expectedUpdatedAt: remoteResult.data?.updatedAt ?? null }),
        });
        ensureOwner();
        if (saveResponse.status === 409 && attempt < 2) continue;
        if (saveResponse.status === 401) { setState("signin"); setMessage("Sign in to sync this collection across devices."); return; }
        const saveResult = await saveResponse.json() as { error?: string; data?: SyncPayload };
        if (!saveResponse.ok) throw new Error(saveResult.error ?? "Unable to save your account collection.");
        if (!saveResult.data) throw new Error("Sync returned no account data.");
        ensureOwner();
        const time = new Date().toISOString();
        applyRemote(sanitizeSync(saveResult.data), includeNotes, owner, time);
        setLastSync(time);
        setState("done");
        setMessage(t("Synced securely at {time}.", { time: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date()) }) + (conflicts ? " " + t("{count} note conflicts kept this device’s text. Reload the reader to see synced notes.", { count: conflicts }) : ""));
        return;
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setState("error");
      setMessage(signal.aborted ? "Sync timed out. Your local collection is safe. Please try again." : error instanceof Error ? error.message : "Account sync is temporarily unavailable.");
    }
  };

  return (
    <aside
      className={`saved-sync saved-sync-${state}`}
      aria-label={t("Account sync")}
    >
      <div>
        <strong>{t("Account sync")}</strong>
        <span>{t(message)}</span>
        {!configured ? <small>{t(setupStatus)}</small> : null}
        {lastSync ? <small>{t("Last successful sync")}: {new Date(lastSync).toLocaleString(locale)}</small> : null}
        {configured ? <><label><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> {t("I agree to sync my saved items and progress to my account.")}</label><label><input type="checkbox" checked={includeNotes} onChange={(event) => setIncludeNotes(event.target.checked)} /> {t("Include my private Quran notes (optional).")}</label></> : <p>{t("Use Export backup below to transfer your private data until account services are connected.")}</p>}
      </div>
      {!configured ? (
        <span className="saved-sync-unavailable" aria-disabled="true">
          {t("Not configured")}
        </span>
      ) : state === "signin" ? (
        <Link href="/sign-in">{t("Sign in")}</Link>
      ) : (
        <button type="button" onClick={sync} disabled={state === "syncing" || !consent}>
          {t(state === "syncing" ? "Syncing…" : state === "done" ? "Sync again" : "Sync across devices")}
        </button>
      )}
    </aside>
  );
}
