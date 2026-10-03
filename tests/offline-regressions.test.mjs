import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

function worker(entries = new Map()) {
  const handlers = {};
  const cache = {
    match: async (request) => {
      const response = entries.get(
        typeof request === "string" ? request : request.url,
      );
      return response?.clone();
    },
    put: async () => {},
    addAll: async () => {},
  };
  const context = {
    self: {
      location: { origin: "https://noor.test" },
      addEventListener: (name, fn) => {
        handlers[name] = fn;
      },
      skipWaiting() {},
      clients: { claim() {} },
    },
    caches: {
      open: async () => cache,
      keys: async () => ["noor-downloads-v1", "noor-shell-v3"],
      delete: async () => true,
    },
    URL,
    Response,
    fetch: async () => {
      throw new Error("Offline");
    },
  };
  return { handlers, context };
}
const source = await readFile(
  new URL("../public/sw.js", import.meta.url),
  "utf8",
);
test("downloaded Quran content can be returned when the network is offline", async () => {
  const request = new Request(
    "https://noor.test/api/quran/surah/2?translation=en.sahih&reciter=alafasy",
  );
  const { handlers, context } = worker(
    new Map([[request.url, Response.json({ surah: { number: 2 } })]]),
  );
  vm.runInNewContext(source, context);
  let response;
  handlers.fetch({
    request,
    respondWith(value) {
      response = value;
    },
  });
  assert.equal((await (await response).json()).surah.number, 2);
});
test("an undownloaded selection gives an honest offline error", async () => {
  const { handlers, context } = worker();
  vm.runInNewContext(source, context);
  let response;
  handlers.fetch({
    request: new Request("https://noor.test/api/quran/surah/3"),
    respondWith(value) {
      response = value;
    },
  });
  assert.equal((await response).status, 503);
});
test("downloaded audio supports byte-range playback and seeking", async () => {
  const url = "https://cdn.islamic.network/quran/test.mp3";
  const { handlers, context } = worker(
    new Map([
      [
        url,
        new Response(new Uint8Array([0, 1, 2, 3, 4, 5]), {
          headers: { "Content-Type": "audio/mpeg" },
        }),
      ],
    ]),
  );
  vm.runInNewContext(source, context);
  let response;
  handlers.fetch({
    request: new Request(url, { headers: { Range: "bytes=2-4" } }),
    respondWith(value) {
      response = value;
    },
  });
  const result = await response;
  assert.equal(result.status, 206);
  assert.equal(result.headers.get("Content-Range"), "bytes 2-4/6");
  assert.deepEqual([...new Uint8Array(await result.arrayBuffer())], [2, 3, 4]);
});
test("prayer and account APIs are never served from an unrelated offline cache", () => {
  const { handlers, context } = worker();
  vm.runInNewContext(source, context);
  for (const path of [
    "/api/prayer-times?latitude=1&longitude=2",
    "/api/account/sync",
  ]) {
    let intercepted = false;
    handlers.fetch({
      request: new Request("https://noor.test" + path),
      respondWith() {
        intercepted = true;
      },
    });
    assert.equal(intercepted, false);
  }
});
