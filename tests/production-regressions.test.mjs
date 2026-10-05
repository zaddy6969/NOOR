import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { validSchedule } from "../lib/prayer-schedule.ts";

test(
  "production pages, exact verse search and prayer API states",
  { timeout: 60000 },
  async () => {
    const server = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "-H",
        "127.0.0.1",
        "-p",
        "3117",
      ],
      {
        cwd: new URL("..", import.meta.url),
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let logs = "";
    server.stdout.on("data", (chunk) => {
      logs += chunk;
    });
    server.stderr.on("data", (chunk) => {
      logs += chunk;
    });
    const base = "http://127.0.0.1:3117";
    try {
      let ready = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        try {
          const response = await fetch(base);
          if (response.ok) {
            ready = true;
            break;
          }
        } catch {
          /* start-up */
        }
        await delay(100);
      }
      assert.ok(ready, "Next server did not start: " + logs);
      for (const path of [
        "/",
        "/duas",
        "/offline",
        "/saved",
        "/content-review",
        "/corrections?page=%2Ftopics%2Fpillars",
        "/prayer-times",
        "/quran?surah=2&ayah=255",
        "/topics/pillars",
      ]) {
        const response = await fetch(base + path);
        assert.equal(response.status, 200, path);
        assert.match(response.headers.get("content-type"), /text\/html/);
      }
      for (const [query, expected] of [["सोने की दुआ", "/duas?dua=sleeping"], ["نماز کے اوقات", "/prayer-times"], ["how do I make wudhu", "/namaz"], ["maryam", "/quran?surah=19"], ["surah 36", "/quran?surah=36"], ["offline", "/offline"]]) {
        const response = await fetch(base + "/api/search?q=" + encodeURIComponent(query));
        assert.equal(response.status, 200, query);
        assert.ok((await response.json()).results.some(result => result.href.startsWith(expected)), query);
      }
      const exact = await (await fetch(base + "/api/search?q=2%3A255")).json();
      assert.equal(exact.results.length, 1);
      assert.equal(exact.results[0].href, "/quran?surah=2&ayah=255");
      for (const path of ["/api/search?q=114%3A7", "/api/quran/search?q=1%3A8", "/api/quran/words/114/7", "/api/quran/tafsir/1/8", "/api/qibla", "/api/qibla?latitude=&longitude=77", "/api/mosques?lat=&lng=77"]) {
        const invalidReference = await fetch(base + path);
        assert.equal(invalidReference.status, 400, path);
      }
      const matrimony = await (await fetch(base + "/matrimony")).text();
      assert.match(matrimony, /Public matching and introductions are closed/);
      assert.doesNotMatch(matrimony, /Private accounts are available on the connected Vercel/);
      const day = new Date().toISOString().slice(0, 10);
      const calendarParams = new URLSearchParams({ date: day, timezone: "UTC", city: "Test city", method: "Karachi", minutes: "10", prayers: "Fajr,Asr", Fajr: "05:00", Dhuhr: "12:00", Asr: "16:00", Maghrib: "18:00", Isha: "20:00" });
      const calendar = await fetch(base + "/api/prayer-times/calendar?" + calendarParams);
      assert.equal(calendar.status, 200);
      assert.match(calendar.headers.get("content-type"), /text\/calendar/);
      assert.match(calendar.headers.get("content-disposition"), /attachment/);
      const calendarText = await calendar.text();
      assert.equal((calendarText.match(/BEGIN:VEVENT/g) ?? []).length, 2);
      assert.match(calendarText, /TRIGGER:-PT10M/);
      assert.equal((await fetch(base + "/api/prayer-times/calendar?date=2020-01-01&timezone=UTC")).status, 400);
      const wrongOrigin = await fetch(base + "/api/account/sync", { method: "PUT", headers: { origin: "https://untrusted.example", "content-type": "application/json" }, body: "{}" });
      assert.equal(wrongOrigin.status, 403);
      const sync = await fetch(base + "/api/account/sync");
      assert.equal(sync.headers.get("cache-control"), "private, no-store");
      assert.equal(wrongOrigin.headers.get("cache-control"), "private, no-store");
      assert.equal(sync.status, 503);
      assert.match((await sync.json()).error, /not configured/);
      const review = await (await fetch(base + "/content-review")).text();
      assert.match(review, /Suhel Farooq Khan and Saifur Rahman Nadwi/);
      assert.match(review, /Not appointed/);
      const missing = await fetch(base + "/api/prayer-times");
      assert.equal(missing.status, 400);
      const invalid = await fetch(
        base + "/api/prayer-times?latitude=99&longitude=77",
      );
      assert.equal(invalid.status, 400);
      const response = await fetch(
        base +
          "/api/prayer-times?latitude=12.9716&longitude=77.5946&timezone=Asia%2FKolkata",
      );
      const data = await response.json();
      assert.equal(response.headers.get("cache-control"), "no-store");
      if (response.ok)
        assert.ok(
          validSchedule(data, new Date()),
          "Prayer response must contain valid timezone-specific instants",
        );
      else {
        assert.equal(response.status, 502);
        assert.ok(data.error);
        assert.equal(data.timings, undefined);
      }
      const guide = await (await fetch(base + "/topics/pillars")).text();
      assert.match(guide, /https:\/\/sunnah.com\/bukhari:8/);
      assert.doesNotMatch(guide, /Last reviewed 31 August 2026/);
    } finally {
      server.kill("SIGTERM");
    }
  },
);
