import assert from "node:assert/strict";
import test from "node:test";
import { AYAH_COUNTS, JUZ_STARTS, isValidQuranReference } from "../lib/quran-structure.ts";
import { practiceRange, practiceBoundary } from "../lib/quran-playback.ts";

test("Quran references use each Surah's actual verse count", () => {
  assert.equal(AYAH_COUNTS.length, 114);
  assert.equal(AYAH_COUNTS.reduce((total, count) => total + count, 0), 6236);
  for (let surah = 1; surah <= 114; surah++) {
    assert.ok(isValidQuranReference(surah, AYAH_COUNTS[surah - 1]));
    assert.equal(isValidQuranReference(surah, AYAH_COUNTS[surah - 1] + 1), false);
  }
  for (const [surah, ayah] of [[0, 1], [115, 1], [1, 0], [1, 1.5], [NaN, 1]]) assert.equal(isValidQuranReference(surah, ayah), false);
});

test("all 30 Juz links resolve to real, ordered Quran references", () => {
  assert.equal(JUZ_STARTS.length, 30);
  let previous = -1;
  JUZ_STARTS.forEach(({ juz, surah, ayah }, index) => {
    assert.equal(juz, index + 1);
    assert.ok(isValidQuranReference(surah, ayah));
    const absolute = AYAH_COUNTS.slice(0, surah - 1).reduce((sum, count) => sum + count, 0) + ayah;
    assert.ok(absolute > previous);
    previous = absolute;
  });
  assert.deepEqual(JUZ_STARTS[1], { juz: 2, surah: 2, ayah: 142 });
  assert.deepEqual(JUZ_STARTS[29], { juz: 30, surah: 78, ayah: 1 });
});

const timings = [{ number: 1, from: 0, to: 2500 }, { number: 2, from: 2500, to: 6000 }, { number: 3, from: 6100, to: 9000 }];
test("practice requires complete, ordered timings and a bounded repeat count", () => {
  assert.deepEqual(practiceRange(timings, 2, 3, 3), { first: 2, last: 3, from: 2500, to: 9000, repeats: 3 });
  for (const [first, last, repeats] of [[3, 2, 3], [1, 4, 3], [1, 1, 0], [1, 1, 11]]) assert.equal(practiceRange(timings, first, last, repeats), null);
  assert.equal(practiceRange([timings[0], timings[2]], 1, 3, 3), null);
  assert.equal(practiceRange([{ number: 1, from: NaN, to: 1000 }], 1, 1, 3), null);
  assert.equal(practiceRange([{ number: 1, from: 1000, to: 0 }], 1, 1, 3), null);
});

test("range practice repeats at the selected boundary and stops after the requested count", () => {
  const range = practiceRange(timings, 2, 3, 3);
  assert.deepEqual(practiceBoundary(1, range, 2), { action: "seek", round: 2, seek: 2.5 });
  assert.equal(practiceBoundary(8.99, range, 1).action, "continue");
  assert.deepEqual(practiceBoundary(9.1, range, 1), { action: "repeat", round: 2, seek: 2.5 });
  assert.deepEqual(practiceBoundary(9, range, 2), { action: "repeat", round: 3, seek: 2.5 });
  assert.deepEqual(practiceBoundary(9, range, 3), { action: "complete", round: 3, seek: 9 });
  const once = practiceRange(timings, 1, 1, 1);
  assert.equal(practiceBoundary(2.5, once, 1).action, "complete");
});
