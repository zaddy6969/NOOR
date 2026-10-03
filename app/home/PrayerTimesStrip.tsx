"use client";
import Link from "next/link";
import { formatCountdown, PRAYERS } from "../../lib/prayer-schedule";
import { usePrayerSchedule } from "../prayer-times/usePrayerSchedule";
export { PRAYERS, type PrayerName } from "../../lib/prayer-schedule";
export {
  DEFAULT_PRAYER_SETTINGS,
  PRAYER_METHODS,
  type PrayerSettings,
} from "../prayer-times/usePrayerSchedule";
export default function PrayerTimesStrip({
  locale = "en",
}: {
  locale?: "en" | "hi" | "ur";
}) {
  const {
    location,
    confirmed,
    schedule,
    now,
    upcoming,
    loading,
    error,
    cached,
    retry,
  } = usePrayerSchedule();
  const label =
    locale === "ur"
      ? "نماز کے اوقات"
      : locale === "hi"
        ? "नमाज़ के समय"
        : "Prayer times";
  return (
    <section className="home-prayer-strip" aria-label={label}>
      <div className="home-prayer-label">
        <span>
          <strong>
            {location.label}
            {!confirmed ? " · default city" : ""}
          </strong>
          <small>{schedule?.timezone ?? "Checking local schedule"}</small>
        </span>
      </div>
      <div className="home-prayer-times">
        {PRAYERS.map((prayer) => (
          <div
            key={prayer}
            className={upcoming?.prayer === prayer ? "is-next" : ""}
          >
            <span>{prayer}</span>
            <strong>
              {loading ? "…" : (schedule?.timings[prayer] ?? "—")}
            </strong>
          </div>
        ))}
      </div>
      <div className="home-prayer-next">
        <span>NEXT PRAYER</span>
        <strong>{upcoming?.prayer ?? "Unavailable"}</strong>
        <small aria-hidden="true">
          {upcoming && now ? formatCountdown(upcoming.target, now) : "—"}
        </small>
        <small>
          {upcoming?.tomorrow ? "Tomorrow · " + upcoming.time : upcoming?.time}
        </small>
      </div>
      <div className="home-prayer-actions">
        <Link href="/prayer-times">Change city & settings →</Link>
      </div>
      <div className="prayer-trust-line">
        {schedule
          ? schedule.method +
            " · " +
            (cached ? "Saved schedule for today" : "AlAdhan calculation")
          : ""}
      </div>
      {error ? (
        <p role="alert" className="home-prayer-error">
          {error}{" "}
          <button type="button" onClick={() => void retry()}>
            Retry
          </button>
        </p>
      ) : null}
    </section>
  );
}
