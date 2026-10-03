import assert from "node:assert/strict";
import test from "node:test";
import {
  followingDate,
  localDateISO,
  prayerInstant,
  upcomingPrayer,
  validSchedule,
  PRAYERS,
} from "../lib/prayer-schedule.ts";

function fixture(dateISO = "2026-10-03", timezone = "Asia/Kolkata") {
  const timings = {
    Fajr: "05:00",
    Dhuhr: "12:10",
    Asr: "16:15",
    Maghrib: "18:05",
    Isha: "19:15",
  };
  const tomorrowDate = followingDate(dateISO);
  return {
    timings,
    targets: Object.fromEntries(
      PRAYERS.map((prayer) => [
        prayer,
        prayerInstant(dateISO, timings[prayer], timezone),
      ]),
    ),
    dateISO,
    timezone,
    hijri: null,
    method: "Test fixture",
    calculatedAt: dateISO + "T00:00:00Z",
    tomorrow: {
      dateISO: tomorrowDate,
      fajr: "05:07",
      target: prayerInstant(tomorrowDate, "05:07", timezone),
    },
  };
}
test("prayer instants use the selected timezone rather than the process timezone", () => {
  assert.equal(
    new Date(
      prayerInstant("2026-10-03", "05:00", "Asia/Kolkata"),
    ).toISOString(),
    "2026-10-02T23:30:00.000Z",
  );
  assert.equal(
    localDateISO(new Date("2026-10-03T20:00:00Z"), "Asia/Kolkata"),
    "2026-10-04",
  );
});
test("next Fajr uses tomorrow's actual schedule", () => {
  const next = upcomingPrayer(fixture(), new Date("2026-10-03T16:00:00Z"));
  assert.equal(next.time, "05:07");
  assert.equal(next.tomorrow, true);
  assert.equal(new Date(next.target).toISOString(), "2026-10-03T23:37:00.000Z");
});
test("unavailable tomorrow data never fabricates a Fajr countdown", () => {
  assert.equal(
    upcomingPrayer(
      { ...fixture(), tomorrow: null },
      new Date("2026-10-03T16:00:00Z"),
    ),
    null,
  );
  assert.equal(upcomingPrayer(null, new Date()), null);
});
test("a schedule expires at midnight in its location", () => {
  assert.equal(
    validSchedule(fixture(), new Date("2026-10-03T18:29:59Z")),
    true,
  );
  assert.equal(
    validSchedule(fixture(), new Date("2026-10-03T18:30:00Z")),
    false,
  );
  assert.equal(
    upcomingPrayer(fixture(), new Date("2026-10-03T18:30:00Z")),
    null,
  );
});
test("DST changes preserve the intended local prayer time", () => {
  assert.equal(
    new Date(
      prayerInstant("2026-03-08", "05:30", "America/New_York"),
    ).toISOString(),
    "2026-03-08T09:30:00.000Z",
  );
  assert.equal(
    new Date(
      prayerInstant("2026-11-01", "05:30", "America/New_York"),
    ).toISOString(),
    "2026-11-01T10:30:00.000Z",
  );
});
test("malformed upstream data or corrupted cache is rejected", () => {
  const data = fixture();
  data.timings.Asr = "99:99";
  assert.equal(validSchedule(data, new Date("2026-10-03T00:00Z")), false);
  const shifted = fixture();
  shifted.targets.Asr += 3600000;
  assert.equal(validSchedule(shifted, new Date("2026-10-03T00:00Z")), false);
  assert.equal(validSchedule({ timings: {} }, new Date()), false);
});
test("tomorrow's date advances correctly across month and year boundaries", () => {
  assert.equal(followingDate("2026-12-31"), "2027-01-01");
  assert.equal(followingDate("2028-02-29"), "2028-03-01");
});
