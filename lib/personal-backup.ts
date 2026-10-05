import { validPlan } from "./quran-plan.ts";
import { validReminders } from "./prayer-reminders.ts";

export const PERSONAL_KEYS = [
  "noor-quran-bookmarks-v1",
  "noor-quran-surahs-v1",
  "noor-duas-saved-v1",
  "noor-darood-saved-v1",
  "noor-lughat-saved-v1",
  "noor-quran-notes-v1",
  "noor-quran-progress-v1",
  "noor-quran-preferences-v1",
  "noor-quran-reading-days-v1",
  "noor-dua-counts-v1",
  "noor-qaza-plan-v1",
  "noor-reading-goal-v1",
  "noor-read-ayahs-v1",
  "noor-quran-plan-v1",
  "noor-prayer-reminders-v1",
  "noor-saved-changes-v1",
];
const object = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));
const list = (value: unknown) =>
  Array.isArray(value) &&
  value.length <= 6236 &&
  value.every((item) => typeof item === "string" && item.length <= 120);
export function backupEntries(input: unknown): Array<[string, string]> {
  if (!object(input) || input.version !== 1 || !object(input.entries))
    throw new Error("Invalid NOOR backup.");
  const entries: Array<[string, string]> = [];
  for (const [key, raw] of Object.entries(input.entries)) {
    if (!PERSONAL_KEYS.includes(key)) continue;
    if (typeof raw !== "string" || raw.length > 1000000)
      throw new Error("Invalid backup entry.");
    const value: unknown = JSON.parse(raw);
    let valid = false;
    if (key === "noor-saved-changes-v1") valid = object(value) && Object.entries(value).every(([field, changes]) => ["duas", "quranVerses", "quranSurahs", "darood", "lughat"].includes(field) && object(changes) && Object.entries(changes).length <= 7000 && Object.entries(changes).every(([id, change]) => id.length <= 120 && object(change) && typeof change.saved === "boolean" && typeof change.at === "string" && Number.isFinite(Date.parse(change.at))));
    else if (key === "noor-quran-plan-v1") valid = validPlan(value);
    else if (key === "noor-prayer-reminders-v1") valid = validReminders(value);
    else if (key === "noor-reading-goal-v1")
      valid = [0, 3, 5, 10, 20].includes(value as number);
    else if (key === "noor-quran-notes-v1")
      valid =
        object(value) &&
        Object.entries(value).length <= 500 &&
        Object.entries(value).every(
          ([reference, text]) =>
            /^\d{1,3}:\d{1,3}$/.test(reference) &&
            typeof text === "string" &&
            text.length <= 3000,
        );
    else if (key === "noor-dua-counts-v1")
      valid =
        object(value) &&
        Object.values(value).every(
          (count) =>
            Number.isInteger(count) &&
            Number(count) >= 0 &&
            Number(count) < 1000000,
        );
    else if (key === "noor-read-ayahs-v1")
      valid =
        object(value) &&
        Object.entries(value).every(
          ([date, refs]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && list(refs),
        );
    else if (key === "noor-quran-progress-v1")
      valid =
        object(value) &&
        Number.isInteger(value.surah) &&
        Number(value.surah) >= 1 &&
        Number(value.surah) <= 114 &&
        Number.isInteger(value.ayah) &&
        Number(value.ayah) >= 1 &&
        Number(value.ayah) <= 286 &&
        (value.englishName === undefined ||
          typeof value.englishName === "string");
    else if (key === "noor-quran-preferences-v1")
      valid =
        object(value) &&
        (value.translation === undefined ||
          ["en.sahih", "en.pickthall", "ur.jalandhry", "hi.hindi"].includes(
            String(value.translation),
          )) &&
        (value.reciter === undefined ||
          ["alafasy", "sudais", "husary", "minshawi"].includes(
            String(value.reciter),
          ));
    else if (key === "noor-qaza-plan-v1")
      valid =
        object(value) &&
        Object.entries(value).every(([field, item]) =>
          field === "prayers"
            ? object(item) &&
              Object.values(item).every(
                (selected) => typeof selected === "boolean",
              )
            : typeof item === "string" && item.length <= 30,
        );
    else valid = list(value);
    if (!valid)
      throw new Error("Invalid data in " + key + ". Nothing was restored.");
    entries.push([key, raw]);
  }
  return entries;
}
