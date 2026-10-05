import assert from "node:assert/strict";
import test from "node:test";
import { TOTAL_AYAHS, planAssignment, planDay, validPlan, verseAt } from "../lib/quran-plan.ts";
import { prayerCalendar, duePrayer } from "../lib/prayer-reminders.ts";
import { sanitizeSync, mergeSync } from "../lib/account-sync.ts";
import { publishedReview } from "../lib/content-review.ts";
import { dropdownLayout } from "../lib/dropdown-layout.ts";
import { translateUI, UI_COPY } from "../lib/ui-copy.ts";

test("dropdowns fit above or below the trigger on narrow and short screens", () => {
  for (const [width, height] of [[320, 568], [390, 844], [412, 915], [844, 390], [1363, 936]]) {
    for (const top of [18, Math.floor(height / 2), height - 70]) {
      const bounds = dropdownLayout({ top, bottom: top + 44, left: width - 175, width: 163 }, width, height);
      assert.ok(bounds.left >= 12 && bounds.left + bounds.width <= width - 12);
      assert.ok(bounds.top >= 12 && bounds.top + bounds.height <= height - 12);
      assert.ok(bounds.height <= 320);
    }
  }
  const shortBelow = dropdownLayout({ top: 642, bottom: 686, left: 400, width: 180 }, 1363, 936);
  assert.ok(shortBelow.top + shortBelow.height <= 924);
});

test("daily UI translations keep interpolated values and do not replace unknown educational text", () => {
  for (const locale of ["hi", "ur"]) {
    assert.ok(translateUI("{minutes} minutes before", locale, { minutes: 15 }).includes("15"));
    assert.notEqual(translateUI("Optional account sync", locale), "Optional account sync");
    assert.equal(translateUI("Unknown sourced content", locale), "Unknown sourced content");
    for (const [source, translated] of Object.entries(UI_COPY)) {
      const placeholders = source.match(/\{\w+\}/g)?.sort() ?? [];
      assert.deepEqual(translated[locale === "hi" ? 0 : 1].match(/\{\w+\}/g)?.sort() ?? [], placeholders, source);
    }
  }
  assert.equal(translateUI("Starts {date}", "en", { date: "2026-10-05" }), "Starts 2026-10-05");
});

test("every completion pace covers the entire Quran once without gaps", () => {
  assert.equal(TOTAL_AYAHS, 6236);
  for (const days of [30, 60, 90]) {
    let position = 0;
    for (let day = 1; day <= days; day++) {
      const task = planAssignment(days, day);
      assert.deepEqual(task.first, verseAt(position));
      position += task.count;
      assert.deepEqual(task.last, verseAt(position - 1));
    }
    assert.equal(position, TOTAL_AYAHS);
    assert.deepEqual(planAssignment(days, days).last, { surah: 114, ayah: 6 });
  }
});
test("plan dates stay stable across daylight-saving changes and validate real dates", () => {
  assert.equal(planDay("2026-03-07", "2026-03-09", 30), 3);
  assert.equal(planDay("2026-10-03", "2026-10-02", 30), 1);
  assert.equal(planDay("2026-01-01", "2026-12-01", 30), 30);
  assert.equal(validPlan({ days: 30, startDate: "2026-02-30", completed: [], updatedAt: "2026-10-03T00:00:00Z" }), false);
  assert.equal(validPlan({ days: 30, startDate: "2026-10-03", completed: [31], updatedAt: "2026-10-03T00:00:00Z" }), false);
});
test("prayer alerts respect prayer selection, lead time and a one-minute delivery window", () => {
  const schedule = { targets: { Fajr: 600000, Dhuhr: 1200000, Asr: 1800000, Maghrib: 2400000, Isha: 3000000 } };
  const settings = { enabled: true, prayers: ["Fajr", "Asr"], minutes: 5 };
  assert.deepEqual(duePrayer(schedule, settings, 300001), ["Fajr"]);
  assert.deepEqual(duePrayer(schedule, settings, 900001), []);
  assert.deepEqual(duePrayer(schedule, settings, 360001), []);
  assert.deepEqual(duePrayer(schedule, { ...settings, enabled: false }, 300001), []);
});
test("calendar reminders use absolute instants and do not repeat changing prayer times", () => {
  const calendar = prayerCalendar({ dateISO: "2026-10-03", timezone: "Asia/Kolkata", method: "Karachi", targets: { Fajr: Date.parse("2026-10-02T23:28:00Z") } }, { enabled: false, prayers: ["Fajr"], minutes: 10 }, "City, Test");
  assert.match(calendar, /DTSTART:20261002T232800Z/);
  assert.match(calendar, /TRIGGER:-PT10M/);
  assert.match(calendar, /City\\, Test/);
  assert.doesNotMatch(calendar, /RRULE/);
});
test("sync rejects invalid references and excludes private notes unless explicitly included", () => {
  const input = { saved: { quranVerses: ["114:6", "114:7", "1:8"], quranSurahs: ["1", "115"] }, quran: { progress: { surah: 114, ayah: 7 }, notes: { "2:255": "Private" }, preferences: { reciter: "fake", translation: "en.sahih" } } };
  const safe = sanitizeSync(input);
  assert.deepEqual(safe.saved.quranVerses, ["114:6"]);
  assert.deepEqual(safe.saved.quranSurahs, ["1"]);
  assert.equal(safe.quran.progress, null);
  assert.equal(safe.quran.preferences.reciter, undefined);
  assert.equal(mergeSync(input, {}, false).quran.notes, undefined);
});
test("sync merges reading activity and keeps newer progress and this device's conflicting notes", () => {
  const local = { saved: { quranVerses: ["1:1"] }, quran: { progress: { surah: 2, ayah: 5, updatedAt: "2026-10-03T10:00:00Z" }, notes: { "2:255": "Local edit" }, readAyahs: { "2026-10-03": ["1:1"] } } };
  const remote = { saved: { quranVerses: ["1:2"] }, quran: { progress: { surah: 2, ayah: 6, updatedAt: "2026-10-03T11:00:00Z" }, notes: { "2:255": "Remote edit", "1:1": "Other note" }, readAyahs: { "2026-10-03": ["1:2"] } } };
  const merged = mergeSync(local, remote, true);
  assert.deepEqual(merged.saved.quranVerses, ["1:1", "1:2"]);
  assert.equal(merged.quran.progress.ayah, 6);
  assert.equal(merged.quran.notes["2:255"], "Local edit");
  assert.equal(merged.quran.notes["1:1"], "Other note");
  assert.deepEqual(merged.quran.readAyahs["2026-10-03"], ["1:1", "1:2"]);
});
test("a source label cannot become an approval without a reviewer and date", () => {
  assert.equal(publishedReview({ status: "reviewed", reviewer: null, reviewedAt: null, scope: "Text and meaning" }), false);
  assert.equal(publishedReview({ status: "pending", reviewer: "Example", reviewedAt: "2026-10-03", scope: "Text and meaning" }), false);
});
