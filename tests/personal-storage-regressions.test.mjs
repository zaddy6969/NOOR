import assert from "node:assert/strict";
import test from "node:test";
import { personalStorage, setPersonalOwner, writePersonalBatch } from "../lib/personal-storage.ts";
import { readSavedCollections, SAVED_KEYS, writeSavedList } from "../app/site/saved-items.ts";
import { mergeSync } from "../lib/account-sync.ts";

function browser(values, fail = () => false) {
  globalThis.window = { localStorage: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { if (fail(key, value)) throw new Error("QuotaExceededError"); values.set(key, value); },
    removeItem: key => values.delete(key),
  }, dispatchEvent: () => {} };
}
test("guest and two account collections, notes and exports are isolated across switching", () => {
  const values = new Map(); browser(values);
  try {
    setPersonalOwner("guest"); writeSavedList(SAVED_KEYS.duas, ["morning"]);
    for (const [owner, id] of [["user_a", "sleeping"], ["user_b", "travel"]]) {
      setPersonalOwner(owner);
      assert.deepEqual(readSavedCollections().duas, []);
      writeSavedList(SAVED_KEYS.duas, [id]);
      personalStorage.setItem("noor-quran-notes-v1", JSON.stringify({ "2:255": owner }));
    }
    setPersonalOwner("user_a"); assert.deepEqual(readSavedCollections().duas, ["sleeping"]);
    assert.equal(JSON.parse(personalStorage.getItem("noor-quran-notes-v1"))["2:255"], "user_a");
    personalStorage.removeItem(SAVED_KEYS.duas);
    setPersonalOwner("user_b"); assert.deepEqual(readSavedCollections().duas, ["travel"]);
    setPersonalOwner("guest"); assert.deepEqual(readSavedCollections().duas, ["morning"]);
    assert.equal(personalStorage.getItem("noor-quran-notes-v1"), null);
  } finally { setPersonalOwner("guest"); delete globalThis.window; }
});
test("storage failures keep the last successful collection and batch restores earlier writes", () => {
  const values = new Map(); browser(values); setPersonalOwner("guest");
  try {
    writeSavedList(SAVED_KEYS.duas, ["morning"]);
    browser(values, (key, value) => key === SAVED_KEYS.duas && value.includes("sleeping"));
    assert.equal(writeSavedList(SAVED_KEYS.duas, ["sleeping"]), null);
    assert.deepEqual(readSavedCollections().duas, ["morning"]);
    values.set("first", "old"); browser(values, key => key === "second");
    assert.throws(() => writePersonalBatch([["first", "new"], ["second", "new"]]));
    assert.equal(values.get("first"), "old");
    setPersonalOwner("user_b");
    assert.throws(() => writePersonalBatch([[SAVED_KEYS.duas, "[]"]], "user_a"), /account changed/);
    setPersonalOwner(null); assert.equal(personalStorage.getItem(SAVED_KEYS.duas), null);
    assert.throws(() => personalStorage.setItem(SAVED_KEYS.duas, "[]"));
  } finally { setPersonalOwner("guest"); delete globalThis.window; }
});
test("sync remembers removal and a later re-save instead of resurrecting stale bookmarks", () => {
  const remote = { saved: { duas: ["sleeping"] } };
  const removed = { saved: { duas: [] }, savedChanges: { duas: { sleeping: { saved: false, at: "2026-10-04T10:00:00Z" } } } };
  const merged = mergeSync(removed, remote, false);
  assert.deepEqual(merged.saved.duas, []);
  const reSaved = { saved: { duas: ["sleeping"] }, savedChanges: { duas: { sleeping: { saved: true, at: "2026-10-04T11:00:00Z" } } } };
  assert.deepEqual(mergeSync(reSaved, merged, false).saved.duas, ["sleeping"]);
});
