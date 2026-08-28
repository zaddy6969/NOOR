"use client";

import { useEffect, useState } from "react";

type PrayerResponse = {
  timings?: Record<"Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha", string>;
  hijri?: string | null;
  error?: string;
};

const BENGALURU = { latitude: 12.9716, longitude: 77.5946, label: "Bengaluru" };

export default function PrayerTimesStrip() {
  const [data, setData] = useState<PrayerResponse | null>(null);
  const [label, setLabel] = useState(BENGALURU.label);
  const [loading, setLoading] = useState(true);

  const load = (latitude: number, longitude: number, nextLabel: string) => {
    setLoading(true);
    fetch(`/api/prayer-times?latitude=${latitude}&longitude=${longitude}`)
      .then((response) => response.json())
      .then((payload: PrayerResponse) => { setData(payload); setLabel(nextLabel); })
      .catch(() => setData({ error: "Prayer timings are temporarily unavailable." }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      load(BENGALURU.latitude, BENGALURU.longitude, BENGALURU.label);
      if (!("geolocation" in navigator)) return;
      navigator.geolocation.getCurrentPosition(
        (position) => load(position.coords.latitude, position.coords.longitude, "Your location"),
        () => undefined,
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="home-prayer-strip" aria-label="Today's five prayer timings">
      <div className="home-prayer-label"><span>TODAY’S PRAYERS</span><strong>{label}</strong><small>{data?.hijri ?? "Local prayer schedule"}</small></div>
      <div className="home-prayer-times">
        {(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map((prayer) => <div key={prayer}><span>{prayer}</span><strong>{loading ? "…" : data?.timings?.[prayer] ?? "—"}</strong></div>)}
      </div>
      <button type="button" onClick={() => {
        if (!("geolocation" in navigator)) return;
        navigator.geolocation.getCurrentPosition(
          (position) => load(position.coords.latitude, position.coords.longitude, "Your location"),
          () => undefined,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
      }}>Use my location</button>
    </section>
  );
}
