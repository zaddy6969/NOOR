"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_NOOR_LOCATION,
  NOOR_LOCATION_EVENT,
  NOOR_LOCATION_KEY,
  readNoorLocation,
  type NoorLocation,
} from "../site/location-settings";
import {
  localDateISO,
  upcomingPrayer,
  validSchedule,
  type PrayerSchedule,
} from "../../lib/prayer-schedule";

export const PRAYER_METHODS = [
  { id: 1, label: "Karachi" },
  { id: 2, label: "ISNA" },
  { id: 3, label: "Muslim World League" },
  { id: 4, label: "Umm al-Qura" },
  { id: 5, label: "Egyptian Authority" },
  { id: 15, label: "Moonsighting Committee" },
];
export type PrayerSettings = {
  cityId: string;
  method: number;
  school: number;
  adjustment: number;
};
export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  cityId: "bengaluru",
  method: 1,
  school: 1,
  adjustment: 0,
};
export function readPrayerSettings(): PrayerSettings {
  try {
    const data = JSON.parse(
      localStorage.getItem("noor-prayer-settings-v1") ?? "{}",
    );
    return {
      cityId: typeof data.cityId === "string" ? data.cityId : "bengaluru",
      method: PRAYER_METHODS.some((method) => method.id === data.method)
        ? data.method
        : 1,
      school: data.school === 0 ? 0 : 1,
      adjustment:
        Number.isInteger(data.adjustment) && Math.abs(data.adjustment) <= 2
          ? data.adjustment
          : 0,
    };
  } catch {
    return DEFAULT_PRAYER_SETTINGS;
  }
}
export function scheduleQuery(
  location: NoorLocation,
  settings: PrayerSettings,
) {
  return new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    method: String(settings.method),
    school: String(settings.school),
    adjustment: String(settings.adjustment),
    ...(location.timezone ? { timezone: location.timezone } : {}),
  }).toString();
}
export function usePrayerSchedule() {
  const [location, setLocation] = useState(DEFAULT_NOOR_LOCATION);
  const [confirmed, setConfirmed] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_PRAYER_SETTINGS);
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const currentSchedule = useRef<PrayerSchedule | null>(null);
  const load = useCallback(async () => {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    const nextLocation = readNoorLocation();
    const nextSettings = readPrayerSettings();
    setLocation(nextLocation);
    setSettings(nextSettings);
    try {
      setConfirmed(Boolean(localStorage.getItem(NOOR_LOCATION_KEY)));
    } catch {
      setConfirmed(false);
    }
    setSchedule(null);
    currentSchedule.current = null;
    setLoading(true);
    setError("");
    setCached(false);
    const url =
      "/api/prayer-times?" + scheduleQuery(nextLocation, nextSettings);
    const cacheKey = "noor-prayer-cache-v2:" + url;
    try {
      const response = await fetch(url, {
        signal: active.signal,
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok || !validSchedule(payload, new Date()))
        throw new Error(
          payload.error ?? "No valid local schedule is available.",
        );
      if (active.signal.aborted) return;
      setSchedule(payload);
      currentSchedule.current = payload;
      try {
        localStorage.setItem(cacheKey, JSON.stringify(payload));
      } catch {
        /* caching is optional */
      }
    } catch (reason) {
      if (active.signal.aborted) return;
      let saved: unknown = null;
      try {
        saved = JSON.parse(localStorage.getItem(cacheKey) ?? "null");
      } catch {
        /* no cache */
      }
      if (validSchedule(saved, new Date())) {
        setSchedule(saved);
        currentSchedule.current = saved;
        setCached(true);
      } else
        setError(
          reason instanceof Error
            ? reason.message
            : "Prayer times are unavailable.",
        );
    } finally {
      if (!active.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setNow(new Date());
      void load();
    });
    const timer = window.setInterval(() => {
      const time = new Date();
      setNow(time);
      const data = currentSchedule.current;
      if (data && localDateISO(time, data.timezone) !== data.dateISO)
        void load();
    }, 1000);
    const refresh = () => void load();
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === NOOR_LOCATION_KEY ||
        event.key === "noor-prayer-settings-v1"
      )
        refresh();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener(NOOR_LOCATION_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      controller.current?.abort();
      window.removeEventListener(NOOR_LOCATION_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);
  return {
    location,
    confirmed,
    settings,
    schedule,
    now,
    loading,
    error,
    cached,
    upcoming: upcomingPrayer(schedule, now),
    retry: load,
  };
}
