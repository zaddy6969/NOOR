export const DOWNLOAD_CACHE = "noor-downloads-v1";
export const SHELL_CACHE = "noor-shell-v3";
export type DownloadEntry = {
  id: string;
  title: string;
  url: string;
  audioUrl?: string;
  bytes: number;
  savedAt: string;
};
export const DOWNLOAD_INDEX = "noor-download-index-v1";
export function readDownloadIndex(): DownloadEntry[] {
  try {
    const data = JSON.parse(localStorage.getItem(DOWNLOAD_INDEX) ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
export async function prepareOfflineShell(surah: number) {
  const shell = await caches.open(SHELL_CACHE);
  for (const route of ["/offline", "/duas", "/quran?surah=" + surah]) {
    const response = await fetch(route);
    if (!response.ok) throw new Error("Offline pages could not be prepared.");
    const html = await response.clone().text();
    await shell.put(route, response);
    const document = new DOMParser().parseFromString(html, "text/html");
    const assets = [
      ...document.querySelectorAll(
        "script[src], link[rel=stylesheet], link[rel=preload]",
      ),
    ]
      .map((node) => node.getAttribute("src") ?? node.getAttribute("href"))
      .filter((value): value is string => Boolean(value));
    await Promise.all(
      assets.map(async (asset) => {
        const url = new URL(asset, location.origin);
        if (url.origin !== location.origin || (await shell.match(url.href)))
          return;
        const resource = await fetch(url.href);
        if (resource.ok) await shell.put(url.href, resource);
      }),
    );
  }
}
export async function downloadSurah(
  surah: number,
  translation: string,
  reciter: string,
  audio: boolean,
): Promise<DownloadEntry> {
  if (!("caches" in window) || !("serviceWorker" in navigator))
    throw new Error("Offline downloads are not supported in this browser.");
  await Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Offline setup is unavailable. Reload and retry while connected.",
            ),
          ),
        15000,
      ),
    ),
  ]);
  const url =
    "/api/quran/surah/" +
    surah +
    "?translation=" +
    encodeURIComponent(translation) +
    "&reciter=" +
    encodeURIComponent(reciter);
  const response = await fetch(url);
  const data = await response.clone().json();
  if (!response.ok || !data.surah?.ayahs?.length)
    throw new Error(data.error ?? "Surah unavailable.");
  const cache = await caches.open(DOWNLOAD_CACHE);
  let bytes = new Blob([JSON.stringify(data)]).size;
  let audioUrl: string | undefined;
  let audioResponse: Response | undefined;
  if (audio) {
    audioUrl = data.surah.audio.src;
    audioResponse = await fetch(audioUrl!);
    if (!audioResponse.ok || audioResponse.type === "opaque")
      throw new Error(
        "This reciter's audio cannot be downloaded. Try reading-only or another reciter.",
      );
    const size = (await audioResponse.clone().blob()).size;
    if (!size) throw new Error("The audio download was empty.");
    bytes += size;
  }
  await prepareOfflineShell(surah);
  const surahs = await fetch("/api/quran/surahs");
  if (surahs.ok) await cache.put("/api/quran/surahs", surahs);
  const entry: DownloadEntry = {
    id: surah + ":" + translation + ":" + reciter,
    title: data.surah.englishName + " · " + translation + " · " + reciter,
    url,
    ...(audioUrl ? { audioUrl } : {}),
    bytes,
    savedAt: new Date().toISOString(),
  };
  const index = readDownloadIndex();
  const previous = index.find((item) => item.id === entry.id);
  await cache.put(url, response);
  if (audioUrl && audioResponse) await cache.put(audioUrl, audioResponse);
  if (
    previous?.audioUrl &&
    !audioUrl &&
    !index.some(
      (item) => item.id !== entry.id && item.audioUrl === previous.audioUrl,
    )
  )
    await cache.delete(previous.audioUrl);
  localStorage.setItem(
    DOWNLOAD_INDEX,
    JSON.stringify([...index.filter((item) => item.id !== entry.id), entry]),
  );
  window.dispatchEvent(new Event("noor:downloads"));
  return entry;
}
