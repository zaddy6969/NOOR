"use client";

import { useEffect, useState } from "react";

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function PrayerTracker() {
  const [checked, setChecked] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(`noor-salah-${todayKey()}`);
    if (stored) setChecked(JSON.parse(stored));
    setReady(true);
  }, []);

  const toggle = (name: string) => {
    const next = checked.includes(name)
      ? checked.filter((item) => item !== name)
      : [...checked, name];
    setChecked(next);
    window.localStorage.setItem(`noor-salah-${todayKey()}`, JSON.stringify(next));
  };

  return (
    <div className="namaz-tracker" aria-label="Private daily prayer tracker">
      <div className="tracker-copy">
        <span>PRIVATE ON THIS DEVICE</span>
        <h3>Today&apos;s five prayers</h3>
        <p>{ready ? `${checked.length} of 5 marked complete` : "Loading your private tracker…"}</p>
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
