"use client";
import { useEffect, useState } from "react";
import { personalStorage } from "@/lib/personal-storage";
import {
  REMINDER_KEY,
  validReminders,
  type ReminderSettings,
} from "@/lib/prayer-reminders";
import { PRAYERS, type PrayerName } from "@/lib/prayer-schedule";
import { useNoorCopy } from "../site/SiteUtilities";
function preferences(): ReminderSettings {
  try {
    const v = JSON.parse(personalStorage.getItem(REMINDER_KEY) ?? "null");
    if (validReminders(v)) return v;
  } catch {}
  return { enabled: false, prayers: [...PRAYERS], minutes: 0 };
}
export default function PrayerReminderToggle({
  prayer,
}: {
  prayer: PrayerName;
}) {
  const { t } = useNoorCopy();
  const [selected, setSelected] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setSelected(preferences().prayers.includes(prayer));
    sync();
    window.addEventListener("noor:reminders-change", sync);
    return () => window.removeEventListener("noor:reminders-change", sync);
  }, [prayer]);
  return (
    <>
      <button
        type="button"
        className="prayer-bell"
        aria-label={t("Reminder for {prayer}", { prayer: t(prayer) })}
        aria-pressed={selected}
        onClick={() => {
          try {
            const v = preferences();
            personalStorage.setItem(
              REMINDER_KEY,
              JSON.stringify({
                ...v,
                prayers: selected
                  ? v.prayers.filter((p) => p !== prayer)
                  : [...v.prayers, prayer],
              }),
            );
            window.dispatchEvent(new Event("noor:reminders-change"));
            document
              .getElementById("reminders")
              ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } catch {
            setError("Settings could not be saved.");
          }
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M6 9a6 6 0 0 1 12 0v6l2 3H4l2-3V9m4 12h4" />
          {!selected ? <path d="M3 3l18 18" /> : null}
        </svg>
      </button>
      {error ? <small role="alert">{t(error)}</small> : null}
    </>
  );
}
