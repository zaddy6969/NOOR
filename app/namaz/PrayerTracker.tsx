"use client";

import { useEffect, useState } from "react";

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function shiftDate(key: string, days: number) {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function prayerStreak(days: string[]) {
  const completed = new Set(days);
  let cursor = completed.has(todayKey()) ? todayKey() : shiftDate(todayKey(), -1);
  let total = 0;
  while (completed.has(cursor)) {
    total += 1;
    cursor = shiftDate(cursor, -1);
  }
  return total;
}

export default function PrayerTracker() {
  const [checked, setChecked] = useState<string[]>([]);
  const [completionDays, setCompletionDays] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrateTimer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(`noor-salah-${todayKey()}`) ?? "[]") as unknown;
        const days = JSON.parse(window.localStorage.getItem("noor-salah-days-v1") ?? "[]") as unknown;
        if (Array.isArray(stored)) setChecked(stored.filter((item): item is string => prayerNames.includes(String(item))));
        if (Array.isArray(days)) setCompletionDays(days.filter((item): item is string => typeof item === "string"));
      } catch {
        setChecked([]);
        setCompletionDays([]);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(hydrateTimer);
  }, []);

  const toggle = (name: string) => {
    const next = checked.includes(name)
      ? checked.filter((item) => item !== name)
      : [...checked, name];
    setChecked(next);
    window.localStorage.setItem(`noor-salah-${todayKey()}`, JSON.stringify(next));
    const days = new Set(completionDays);
    if (next.length === prayerNames.length) days.add(todayKey());
    else days.delete(todayKey());
    const nextDays = [...days].sort().slice(-370);
    setCompletionDays(nextDays);
    window.localStorage.setItem("noor-salah-days-v1", JSON.stringify(nextDays));
    window.dispatchEvent(new CustomEvent("noor:salah-progress", { detail: { completed: next.length, streak: prayerStreak(nextDays) } }));
  };

  const streak = prayerStreak(completionDays);

  return (
    <div className="namaz-tracker" aria-label="Private daily prayer tracker">
      <div className="tracker-copy">
        <span>PRIVATE ON THIS DEVICE</span>
        <h3>Today&apos;s five prayers</h3>
        <p>{ready ? `${checked.length} of 5 complete${streak ? ` · ${streak}-day streak` : ""}` : "Loading your private tracker…"}</p>
      </div>
      <div className="tracker-prayers">
        {prayerNames.map((name) => (
          <label className={checked.includes(name) ? "done" : ""} key={name}>
            <input
              type="checkbox"
              checked={checked.includes(name)}
              onChange={() => toggle(name)}
            />
            <span aria-hidden="true">✓</span>
            <strong>{name}</strong>
          </label>
        ))}
      </div>
      <div className="tracker-progress" aria-hidden="true">
        <i style={{ width: `${(checked.length / 5) * 100}%` }} />
      </div>
    </div>
  );
}
