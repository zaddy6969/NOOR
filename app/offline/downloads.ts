import { personalStorage } from "@/lib/personal-storage";
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
export type DownloadProgress = { stage: string; received?: number; total?: number };
export function readDownloadIndex(): DownloadEntry[] {
  try {
    const data = JSON.parse(personalStorage.getItem(DOWNLOAD_INDEX) ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
export async function prepareOfflineShell(surah: number, signal?: AbortSignal) {
  const shell = await caches.open(SHELL_CACHE);
  for (const route of ["/offline", "/duas", "/quran?surah=" + surah]) {
    const response = await fetch(route, { signal });
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
        const resource = await fetch(url.href, { signal });
        if (!resource.ok) throw new Error("An offline page resource could not be downloaded. Please retry while connected.");
        await shell.put(url.href, resource);
      }),
    );
  }
}
export async function downloadSurah(
  surah: number,
  translation: string,
  reciter: string,
  audio: boolean,
  onProgress?: (progress: DownloadProgress) => void,
  cancelSignal?: AbortSignal,
): Promise<DownloadEntry> {
  if (!("caches" in window) || !("serviceWorker" in navigator))
    throw new Error("Offline downloads are not supported in this browser.");
  onProgress?.({ stage: "Preparing offline support…" });
  let readyTimer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => { readyTimer = setTimeout(() => reject(new Error("Offline setup is unavailable. Reload and retry while connected.")), 15000); })]);
  } finally { clearTimeout(readyTimer); }
  const signal = cancelSignal ? AbortSignal.any([cancelSignal, AbortSignal.timeout(180000)]) : AbortSignal.timeout(180000);
  signal.throwIfAborted();
  const url =
    "/api/quran/surah/" +
    surah +
    "?translation=" +
    encodeURIComponent(translation) +
    "&reciter=" +
    encodeURIComponent(reciter);
  onProgress?.({ stage: "Downloading Arabic and translation…" });
  const response = await fetch(url, { signal });
  const data = await response.clone().json();
  if (!response.ok || !data.surah?.ayahs?.length)
    throw new Error(data.error ?? "Surah unavailable.");
  const cache = await caches.open(DOWNLOAD_CACHE);
  let bytes = new Blob([JSON.stringify(data)]).size;
  let audioUrl: string | undefined;
  let audioResponse: Response | undefined;
  if (audio) {
    audioUrl = data.surah.audio.src;
    onProgress?.({ stage: "Downloading recitation…", received: 0 });
    audioResponse = await fetch(audioUrl!, { signal });
    if (!audioResponse.ok || audioResponse.type === "opaque")
      throw new Error(
        "This reciter's audio cannot be downloaded. Try reading-only or another reciter.",
      );
    const total = Number(audioResponse.headers.get("content-length")) || undefined;
    const reader = audioResponse.body?.getReader();
    if (!reader) throw new Error("Audio data is unavailable.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const result = await reader.read();
      if (result.done) break;
      size += result.value.byteLength;
      if (size > 200 * 1048576) { await reader.cancel(); throw new Error("Audio exceeds the 200 MB download limit."); }
      chunks.push(result.value);
      onProgress?.({ stage: "Downloading recitation…", received: size, total });
    }
    audioResponse = new Response(new Blob(chunks as BlobPart[], { type: "audio/mpeg" }), { headers: { "Content-Type": "audio/mpeg", "Content-Length": String(size) } });
    if (!size) throw new Error("The audio download was empty.");
    bytes += size;
  }
  onProgress?.({ stage: "Preparing pages for offline reading…" });
  await prepareOfflineShell(surah, signal);
  const surahs = await fetch("/api/quran/surahs", { signal });
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
  signal.throwIfAborted();
  onProgress?.({ stage: "Saving download…" });
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
  personalStorage.setItem(
    DOWNLOAD_INDEX,
    JSON.stringify([...index.filter((item) => item.id !== entry.id), entry]),
  );
  window.dispatchEvent(new Event("noor:downloads"));
  onProgress?.({ stage: "Download complete", received: bytes, total: bytes });
  return entry;
}
