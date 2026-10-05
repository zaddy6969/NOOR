// Local collections are separate for guests and each authenticated Clerk user.
// This identifier selects local storage only; server authorization always uses Clerk.
let owner: string | null = "guest";
export const STORAGE_ERROR_EVENT = "noor:storage-error";
export const ACCOUNT_CHANGE_EVENT = "noor:account-change";
const deviceKeys = new Set([
  "noor-language", "noor-theme-v2", "noor-location-v1",
  "noor-prayer-settings-v1", "noor-offline-index-v1", "noor-download-index-v1",
]);
export function personalOwner() { return owner; }
export function setPersonalOwner(next: string | null) {
  if (owner === next) return;
  owner = next;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(ACCOUNT_CHANGE_EVENT));
}
function storageKey(key: string) {
  if (!key.startsWith("noor-") || deviceKeys.has(key) || key.startsWith("noor-offline-")) return key;
  if (owner === null) throw new Error("Your account is still loading. Please try again.");
  // Retain existing guest data without silently copying it into any account.
  return owner === "guest" ? key : `noor-account:${encodeURIComponent(owner)}:${key}`;
}
export const personalStorage = {
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    try { return window.localStorage.getItem(storageKey(key)); } catch { return null; }
  },
  setItem(key: string, value: string) {
    try { window.localStorage.setItem(storageKey(key), value); }
    catch {
      window.dispatchEvent(new Event(STORAGE_ERROR_EVENT));
      throw new Error("Your browser could not save this change. Free some storage or allow site storage, then try again.");
    }
  },
  removeItem(key: string) {
    try { window.localStorage.removeItem(storageKey(key)); }
    catch { window.dispatchEvent(new Event(STORAGE_ERROR_EVENT)); throw new Error("Your browser could not remove this item."); }
  },
};
// Validate first, then restore all previous values if any local write fails.
export function writePersonalBatch(entries: Array<[string, string]>, expectedOwner = personalOwner()) {
  if (expectedOwner !== personalOwner() || expectedOwner === null) throw new Error("Your account changed. Please try again.");
  let previous: Array<readonly [string, string | null]>;
  try { previous = entries.map(([key]) => [storageKey(key), window.localStorage.getItem(storageKey(key))] as const); }
  catch {
    window.dispatchEvent(new Event(STORAGE_ERROR_EVENT));
    throw new Error("Your browser could not save this change. Free some storage or allow site storage, then try again.");
  }
  try { for (const [key, value] of entries) personalStorage.setItem(key, value); }
  catch (error) {
    for (const [key, value] of previous) {
      try { if (value === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, value); } catch { /* storage may remain unavailable */ }
    }
    throw error;
  }
}
