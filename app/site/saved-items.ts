export const SAVED_KEYS = {
  quranVerses: "noor-quran-bookmarks-v1",
  quranSurahs: "noor-quran-surahs-v1",
  darood: "noor-darood-saved-v1",
  lughat: "noor-lughat-saved-v1",
} as const;

export const SAVED_ITEMS_EVENT = "noor:saved-items-changed";

export type SavedCollections = {
  quranVerses: string[];
  quranSurahs: string[];
  darood: string[];
  lughat: string[];
};

export function readSavedList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0))];
  } catch {
    return [];
  }
}

export function writeSavedList(key: string, items: string[]) {
  const next = [...new Set(items)];
  window.localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(SAVED_ITEMS_EVENT, { detail: { key, count: next.length } }));
  return next;
}

export function readSavedCollections(): SavedCollections {
  return {
    quranVerses: readSavedList(SAVED_KEYS.quranVerses),
    quranSurahs: readSavedList(SAVED_KEYS.quranSurahs),
    darood: readSavedList(SAVED_KEYS.darood),
    lughat: readSavedList(SAVED_KEYS.lughat),
  };
}

export function savedItemsTotal(collections = readSavedCollections()) {
  return collections.quranVerses.length + collections.quranSurahs.length + collections.darood.length + collections.lughat.length;
}
