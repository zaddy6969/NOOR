const SHELL = "noor-shell-v3";
const DOWNLOADS = "noor-downloads-v1";
const CORE = ["/", "/quran", "/duas", "/offline", "/favicon.svg"];
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const prayerPage = windows.find((client) => new URL(client.url).pathname === "/prayer-times");
    if (prayerPage) return prayerPage.focus();
    return self.clients.openWindow("/prayer-times");
  })());
});
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(CORE))
      .catch(() => undefined),
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("noor-") && key !== SHELL && key !== DOWNLOADS,
            )
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});
async function audioRange(request, response) {
  const range = request.headers.get("range");
  if (!range) return response;
  const bytes = await response.arrayBuffer();
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match)
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": "bytes */" + bytes.byteLength },
    });
  const start = match[1]
    ? Number(match[1])
    : Math.max(0, bytes.byteLength - Number(match[2]));
  const end =
    match[1] && match[2]
      ? Math.min(Number(match[2]), bytes.byteLength - 1)
      : bytes.byteLength - 1;
  if (start > end || start >= bytes.byteLength)
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": "bytes */" + bytes.byteLength },
    });
  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": "bytes " + start + "-" + end + "/" + bytes.byteLength,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) {
    if (
      [
        "cdn.islamic.network",
        "download.quranicaudio.com",
        "verses.quran.com",
        "audio.qurancdn.com",
      ].includes(url.hostname)
    )
      event.respondWith(
        caches.open(DOWNLOADS).then(async (cache) => {
          const saved = await cache.match(url.href);
          return saved ? audioRange(request, saved) : fetch(request);
        }),
      );
    return;
  }
  if (
    url.pathname.startsWith("/api/quran/surah/") ||
    url.pathname === "/api/quran/surahs"
  ) {
    event.respondWith(
      fetch(request).catch(async () =>
        (await caches.open(DOWNLOADS))
          .match(request)
          .then(
            (saved) =>
              saved ||
              Response.json(
                {
                  error:
                    "This Quran selection has not been downloaded. Connect to download it.",
                },
                { status: 503 },
              ),
          ),
      ),
    );
    return;
  }
  if (
    request.mode === "navigate" &&
    ["/", "/quran", "/duas", "/offline"].includes(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SHELL);
        try {
          const response = await fetch(request);
          if (response.ok) await cache.put(request, response.clone());
          return response;
        } catch {
          return (
            (await cache.match(request)) ||
            (await cache.match(url.pathname)) ||
            (await cache.match("/offline")) ||
            new Response("Connect to prepare offline pages.", { status: 503 })
          );
        }
      })(),
    );
    return;
  }
  if (["style", "script", "font", "image"].includes(request.destination))
    event.respondWith(
      (async () => {
        const cache = await caches.open(SHELL);
        const saved = await cache.match(request);
        if (saved) return saved;
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      })(),
    );
});
