import assert from "node:assert/strict";
import test from "node:test";
import { backupEntries } from "../lib/personal-backup.ts";
import {
  readSavedCollections,
  savedItemsTotal,
  writeSavedList,
  SAVED_KEYS,
} from "../app/site/saved-items.ts";
test("saved duas persist, count toward Saved and can be removed", () => {
  const values = new Map();
  const events = [];
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    dispatchEvent: (event) => events.push(event.type),
  };
  writeSavedList(SAVED_KEYS.duas, ["morning", "morning", "travel"]);
  assert.deepEqual(readSavedCollections().duas, ["morning", "travel"]);
  assert.equal(savedItemsTotal(), 2);
  writeSavedList(SAVED_KEYS.duas, ["travel"]);
  assert.equal(savedItemsTotal(), 1);
  assert.ok(events.includes("noor:saved-items-changed"));
  delete globalThis.window;
});
test("backup restoration validates every entry before allowing any writes", () => {
  const data = {
    version: 1,
    entries: {
      "noor-duas-saved-v1": JSON.stringify(["morning"]),
      "noor-quran-notes-v1": JSON.stringify({ "2:255": { malicious: true } }),
    },
  };
  assert.throws(() => backupEntries(data), /Nothing was restored/);
});
test("private backups exclude location and account data", () => {
  const result = backupEntries({
    version: 1,
    entries: {
      "noor-location-v1": JSON.stringify({ latitude: 1 }),
      "noor-duas-saved-v1": JSON.stringify(["morning"]),
      "noor-reading-goal-v1": "5",
    },
  });
  assert.deepEqual(
    result.map(([key]) => key),
    ["noor-duas-saved-v1", "noor-reading-goal-v1"],
  );
});
test("reader progress rejects an invalid Surah rather than restoring corrupt state", () => {
  assert.throws(() =>
    backupEntries({
      version: 1,
      entries: {
        "noor-quran-progress-v1": JSON.stringify({ surah: 999, ayah: 1 }),
      },
    }),
  );
});
