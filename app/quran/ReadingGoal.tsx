"use client";
import { useNoorCopy } from "../site/SiteUtilities";
import NoorSelect from "../site/NoorSelect";
import { useEffect, useState } from "react";
export default function ReadingGoal() {
  const { t } = useNoorCopy();
  const [goal, setGoal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const sync = () => {
      try {
        const value = Number(localStorage.getItem("noor-reading-goal-v1") ?? 0);
        setGoal([0, 3, 5, 10, 20].includes(value) ? value : 0);
        const today = new Date().toLocaleDateString("en-CA");
        const records = JSON.parse(
          localStorage.getItem("noor-read-ayahs-v1") ?? "{}",
        );
        setTodayCount(
          Array.isArray(records[today]) ? records[today].length : 0,
        );
      } catch {
        /* personal tracking is optional */
      }
    };
    sync();
    window.addEventListener("noor:quran-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("noor:quran-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const calendar = () => {
    const date = new Date();
    const [hour, minute] = reminderTime.split(":");
    const stamp =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      "T" +
      hour +
      minute +
      "00";
    const utc = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//NOOR//Quran Reminder//EN",
      "BEGIN:VEVENT",
      "UID:noor-reading-" + Date.now() + "@noor-daily-muslim.vercel.app",
      "DTSTAMP:" + utc,
      "DTSTART:" + stamp,
      "DURATION:PT10M",
      "RRULE:FREQ=DAILY",
      "SUMMARY:Read Quran with NOOR",
      "DESCRIPTION:Open https://noor-daily-muslim.vercel.app/quran",
      "BEGIN:VALARM",
      "TRIGGER:PT0M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Your Quran reading reminder",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([event], { type: "text/calendar" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "NOOR-reading-reminder.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      "Reminder downloaded. Import it into your calendar and check its alert settings. Your calendar manages reminders; NOOR does not send background alerts.",
    );
  };
  return (
    <details className="reading-goal">
      <summary>
        {t("Optional daily reading goal")}
        {goal ? " · " + todayCount + "/" + goal + " ayahs" : ""}
      </summary>
      <p>
        {t("Choose a gentle personal goal. Visible ayahs are counted on this device; this measures reading activity, not recitation quality.")}
      </p>
      <label>
        Daily goal
        <NoorSelect aria-label="Daily reading goal"
          value={goal}
          onChange={(event) => {
            const value = Number(event.target.value);
            try {
              localStorage.setItem("noor-reading-goal-v1", String(value));
              setGoal(value);
            } catch {
              setMessage("Goal could not be saved.");
            }
          }}
        >
          <option value={0}>{t("No goal")}</option>
          {[3, 5, 10, 20].map((value) => (
            <option key={value} value={value}>
              {value} ayahs
            </option>
          ))}
        </NoorSelect>
      </label>
      {goal ? <progress value={Math.min(todayCount, goal)} max={goal} /> : null}
      <label>
        Calendar reminder time
        <input
          type="time"
          value={reminderTime}
          onChange={(event) => setReminderTime(event.target.value)}
        />
      </label>
      <button type="button" onClick={calendar}>
        Add reminder to my calendar
      </button>
      <p role="status">{message}</p>
    </details>
  );
}
