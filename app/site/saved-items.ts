import { personalStorage, writePersonalBatch } from "../../lib/personal-storage.ts";
export const SAVED_KEYS = {
  quranVerses: "noor-quran-bookmarks-v1",
  duas: "noor-duas-saved-v1",
  quranSurahs: "noor-quran-surahs-v1",
  darood: "noor-darood-saved-v1",
  lughat: "noor-lughat-saved-v1",
} as const;

export const SAVED_ITEMS_EVENT = "noor:saved-items-changed";

export type SavedCollections = {
  quranVerses: string[];
  duas: string[];
  quranSurahs: string[];
  darood: string[];
  lughat: string[];
};

export function readSavedList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(
      personalStorage.getItem(key) ?? "[]",
    ) as unknown;
    if (!Array.isArray(value)) return [];
    return [
      ...new Set(
        value.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export function writeSavedList(key: string, items: string[]) {
  const next = [...new Set(items)];
  try {
    const field = Object.entries(SAVED_KEYS).find(([, value]) => value === key)?.[0];
    let changes: Record<string, Record<string, { saved: boolean; at: string }>> = {};
    try { const value = JSON.parse(personalStorage.getItem("noor-saved-changes-v1") ?? "{}"); if (value && typeof value === "object" && !Array.isArray(value)) changes = value; } catch { /* repair corrupt metadata */ }
    if (field) {
      const before = readSavedList(key), after = new Set(next), at = new Date().toISOString();
      const updates = { ...changes[field] };
      for (const id of new Set([...before, ...next])) if (before.includes(id) !== after.has(id)) updates[id] = { saved: after.has(id), at };
      changes = { ...changes, [field]: updates };
    }
    writePersonalBatch([[key, JSON.stringify(next)], ["noor-saved-changes-v1", JSON.stringify(changes)]]);
  } catch { return null; }
  window.dispatchEvent(
    new CustomEvent(SAVED_ITEMS_EVENT, { detail: { key, count: next.length } }),
  );
  return next;
}

export function readSavedCollections(): SavedCollections {
  return {
    quranVerses: readSavedList(SAVED_KEYS.quranVerses),
    duas: readSavedList(SAVED_KEYS.duas),
    quranSurahs: readSavedList(SAVED_KEYS.quranSurahs),
    darood: readSavedList(SAVED_KEYS.darood),
    lughat: readSavedList(SAVED_KEYS.lughat),
  };
}

export function savedItemsTotal(collections = readSavedCollections()) {
  return (
    (collections.duas?.length ?? 0) +
    collections.quranVerses.length +
    collections.quranSurahs.length +
    collections.darood.length +
    collections.lughat.length
  );
}
