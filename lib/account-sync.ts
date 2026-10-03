import { isValidQuranReference } from "./quran-structure.ts";
import { validPlan, type QuranPlan } from "./quran-plan.ts";

export type SyncPayload = {
  version: 1;
  saved: { duas: string[]; quranVerses: string[]; quranSurahs: string[]; darood: string[]; lughat: string[] };
  quran: { progress: Record<string, unknown> | null; preferences: Record<string, unknown>; readingDays: string[]; notes?: Record<string, string>; plan: QuranPlan | null; readingGoal: number; readAyahs: Record<string, string[]> };
  updatedAt: string;
};
const object = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const strings = (value: unknown, limit: number) => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0 && item.length <= 120))].slice(0, limit) : [];
export function sanitizeSync(input: unknown): SyncPayload {
  if (JSON.stringify(input).length > 150000) throw new Error("Sync data is too large.");
  const root = object(input), saved = object(root.saved), quran = object(root.quran), progress = object(quran.progress), preferences = object(quran.preferences);
  const notes = Object.fromEntries(Object.entries(object(quran.notes)).filter(([key, text]) => { const [surah, ayah] = key.split(":").map(Number); return isValidQuranReference(surah, ayah) && typeof text === "string" && text.length <= 3000; }).slice(0, 500));
  const reference = (value: string) => { const [surah, ayah] = value.split(":").map(Number); return isValidQuranReference(surah, ayah); };
  return {
    version: 1,
    saved: { duas: strings(saved.duas, 100), quranVerses: strings(saved.quranVerses, 1000).filter(reference), quranSurahs: strings(saved.quranSurahs, 114).filter((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 114), darood: strings(saved.darood, 500), lughat: strings(saved.lughat, 500) },
    quran: {
      progress: isValidQuranReference(Number(progress.surah), Number(progress.ayah)) ? { surah: Number(progress.surah), ayah: Number(progress.ayah), englishName: String(progress.englishName ?? "").slice(0, 100), updatedAt: Number.isFinite(Date.parse(String(progress.updatedAt))) ? String(progress.updatedAt) : "" } : null,
      preferences: { ...(["en.sahih", "en.pickthall", "ur.jalandhry", "hi.hindi"].includes(String(preferences.translation)) ? { translation: preferences.translation } : {}), ...(["alafasy", "sudais", "husary", "minshawi"].includes(String(preferences.reciter)) ? { reciter: preferences.reciter } : {}) },
      readingDays: strings(quran.readingDays, 730).filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)),
      ...(Object.hasOwn(quran, "notes") ? { notes: notes as Record<string, string> } : {}),
      plan: validPlan(quran.plan) ? quran.plan : null,
      readingGoal: [0, 3, 5, 10, 20].includes(Number(quran.readingGoal)) ? Number(quran.readingGoal) : 0,
      readAyahs: Object.fromEntries(Object.entries(object(quran.readAyahs)).filter(([day]) => /^\d{4}-\d{2}-\d{2}$/.test(day)).slice(-730).map(([day, refs]) => [day, strings(refs, 1000).filter(reference)])),
    }, updatedAt: new Date().toISOString(),
  };
}
const newer = (left: Record<string, unknown> | null, right: Record<string, unknown> | null) => (Date.parse(String(left?.updatedAt)) || 0) >= (Date.parse(String(right?.updatedAt)) || 0) ? left : right;
export function mergeSync(localInput: unknown, remoteInput: unknown, includeNotes: boolean): SyncPayload {
  const local = sanitizeSync(localInput), remote = sanitizeSync(remoteInput);
  const union = (left: string[], right: string[]) => [...new Set([...left, ...right])];
  const merged: SyncPayload = { version: 1, saved: { duas: union(local.saved.duas, remote.saved.duas), quranVerses: union(local.saved.quranVerses, remote.saved.quranVerses), quranSurahs: union(local.saved.quranSurahs, remote.saved.quranSurahs), darood: union(local.saved.darood, remote.saved.darood), lughat: union(local.saved.lughat, remote.saved.lughat) }, quran: { progress: newer(local.quran.progress, remote.quran.progress), preferences: { ...remote.quran.preferences, ...local.quran.preferences }, readingDays: union(local.quran.readingDays, remote.quran.readingDays).sort(), plan: (Date.parse(local.quran.plan?.updatedAt ?? "") || 0) >= (Date.parse(remote.quran.plan?.updatedAt ?? "") || 0) ? local.quran.plan : remote.quran.plan, readingGoal: local.quran.readingGoal || remote.quran.readingGoal, readAyahs: { ...remote.quran.readAyahs, ...local.quran.readAyahs } }, updatedAt: new Date().toISOString() };
  for (const [day, refs] of Object.entries(remote.quran.readAyahs)) merged.quran.readAyahs[day] = union(local.quran.readAyahs[day] ?? [], refs);
  // On conflicts keep this device's note and expose conflict counts in the UI.
  if (includeNotes) merged.quran.notes = { ...remote.quran.notes, ...local.quran.notes };
  return sanitizeSync(merged);
}
