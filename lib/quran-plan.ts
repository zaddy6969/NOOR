import { AYAH_COUNTS } from "./quran-structure.ts";

export const PLAN_KEY = "noor-quran-plan-v1";
export const TOTAL_AYAHS = AYAH_COUNTS.reduce((sum, count) => sum + count, 0);
export type QuranPlan = { days: 30 | 60 | 90; startDate: string; completed: number[]; updatedAt: string };
export function validPlan(value: unknown): value is QuranPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as QuranPlan;
  return [30, 60, 90].includes(plan.days) && /^\d{4}-\d{2}-\d{2}$/.test(plan.startDate) && Number.isFinite(Date.parse(plan.startDate + "T00:00:00Z")) && new Date(plan.startDate + "T00:00:00Z").toISOString().slice(0, 10) === plan.startDate && Array.isArray(plan.completed) && plan.completed.length <= plan.days && plan.completed.every((day) => Number.isInteger(day) && day >= 1 && day <= plan.days) && typeof plan.updatedAt === "string" && Number.isFinite(Date.parse(plan.updatedAt));
}
export function verseAt(index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= TOTAL_AYAHS) throw new Error("Invalid Quran position.");
  let remaining = index;
  for (let surah = 0; surah < AYAH_COUNTS.length; surah++) {
    if (remaining < AYAH_COUNTS[surah]) return { surah: surah + 1, ayah: remaining + 1 };
    remaining -= AYAH_COUNTS[surah];
  }
  throw new Error("Invalid Quran position.");
}
export function planAssignment(days: number, day: number) {
  if (![30, 60, 90].includes(days) || !Number.isInteger(day) || day < 1 || day > days) throw new Error("Invalid plan day.");
  const first = Math.floor((day - 1) * TOTAL_AYAHS / days);
  const end = Math.floor(day * TOTAL_AYAHS / days);
  return { first: verseAt(first), last: verseAt(end - 1), count: end - first };
}
export function planDay(startDate: string, today: string, days: number) {
  return Math.max(1, Math.min(days, Math.floor((Date.parse(today + "T00:00:00Z") - Date.parse(startDate + "T00:00:00Z")) / 86400000) + 1));
}
