"use client";
import NoorSelect from "../site/NoorSelect";
import { useEffect, useState } from "react";
import { NOOR_LOCATION_EVENT } from "../site/location-settings";
import {
  formatCountdown,
  PRAYERS,
  type PrayerTimings,
} from "../../lib/prayer-schedule";
import {
  usePrayerSchedule,
  scheduleQuery,
  PRAYER_METHODS,
} from "./usePrayerSchedule";
import PrayerReminders from "./PrayerReminders";
import { useNoorCopy } from "../site/SiteUtilities";
import LocationPicker from "./LocationPicker";

type MonthDay = {
  gregorianDate: string;
  gregorianDay: number;
  weekday: string;
  hijriLabel: string;
  timings: PrayerTimings;
};
export default function PrayerTimesCenter() {
  const { t } = useNoorCopy();
  const {
    location,
    confirmed,
    settings,
    schedule,
    now,
    upcoming,
    cached,
    loading,
    error,
    retry,
  } = usePrayerSchedule();
  const [view, setView] = useState<{ year: number; month: number } | null>(
    null,
  );
  const [monthData, setMonthData] = useState<MonthDay[]>([]);
  const [monthError, setMonthError] = useState("");
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthRetry, setMonthRetry] = useState(0);
  useEffect(() => {
    if (!schedule || view) return;
    const frame = requestAnimationFrame(() => {
      const [year, month] = schedule.dateISO.split("-").map(Number);
      setView({ year, month });
    });
    return () => cancelAnimationFrame(frame);
  }, [schedule, view]);
  const query = scheduleQuery(location, settings);
  useEffect(() => {
    if (!view) return;
    const active = new AbortController();
    const frame = requestAnimationFrame(() => {
      setMonthLoading(true);
      setMonthError("");
      setMonthData([]);
      void fetch(
        "/api/prayer-times/month?" +
          query +
          "&year=" +
          view.year +
          "&month=" +
          view.month,
        { signal: active.signal },
      )
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok)
            throw new Error(payload.error ?? "Monthly schedule unavailable.");
          if (!active.signal.aborted) setMonthData(payload.days ?? []);
        })
        .catch((reason) => {
          if (!active.signal.aborted) setMonthError(reason.message);
        })
        .finally(() => {
          if (!active.signal.aborted) setMonthLoading(false);
        });
    });
    return () => {
      cancelAnimationFrame(frame);
      active.abort();
    };
  }, [query, view, monthRetry]);
  const update = (key: "method" | "school" | "adjustment", value: number) => {
    localStorage.setItem(
      "noor-prayer-settings-v1",
      JSON.stringify({ ...settings, [key]: value }),
    );
    window.dispatchEvent(new Event(NOOR_LOCATION_EVENT));
  };
  const changeMonth = (delta: number) =>
    setView((current) => {
      const date = new Date(
        current?.year ?? new Date().getFullYear(),
        (current?.month ?? new Date().getMonth() + 1) - 1 + delta,
        1,
      );
      return { year: date.getFullYear(), month: date.getMonth() + 1 };
    });
  return (
    <section className="prayer-center" aria-busy={loading}>
      <div className="prayer-center-status">
        <div>
          <span>NEXT PRAYER · {location.label.toUpperCase()}</span>
          <h2>{loading ? "Loading…" : (upcoming?.prayer ?? "Unavailable")}</h2>
          <strong aria-hidden="true">
            {upcoming && now ? formatCountdown(upcoming.target, now) : "—"}
          </strong>
          <p>
            {upcoming
              ? upcoming.time + (upcoming.tomorrow ? " tomorrow" : " today")
              : "No verified next-prayer time available."}
          </p>
          <p>
            {schedule
              ? schedule.dateISO +
                " · " +
                schedule.timezone +
                (cached ? " · saved schedule for today" : " · live schedule")
              : "Select your location below."}
          </p>
        </div>
        <div className="prayer-center-today">
          {PRAYERS.map((prayer) => (
            <article
              className={
                upcoming?.prayer === prayer && !upcoming.tomorrow
                  ? "is-next"
                  : ""
              }
              key={prayer}
            >
              <span>{prayer}</span>
              <strong>
                {loading ? "…" : (schedule?.timings[prayer] ?? "—")}
              </strong>
            </article>
          ))}
        </div>
      </div>
      {error ? (
        <div className="prayer-center-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void retry()}>
            Retry prayer times
          </button>
        </div>
      ) : null}
      <LocationPicker location={location} confirmed={confirmed} />
      <section
        className="prayer-center-controls"
        aria-label="Prayer calculation settings"
      >
        <label>
          <span>{t("Calculation")}</span>
          <NoorSelect aria-label={t("Calculation")}
            value={settings.method}
            onChange={(event) => update("method", Number(event.target.value))}
          >
            {PRAYER_METHODS.map((method) => (
              <option value={method.id} key={method.id}>
                {method.label}
              </option>
            ))}
          </NoorSelect>
        </label>
        <label>
          <span>{t("Asr method")}</span>
          <NoorSelect aria-label={t("Asr method")}
            value={settings.school}
            onChange={(event) => update("school", Number(event.target.value))}
          >
            <option value={1}>Hanafi</option>
            <option value={0}>Standard</option>
          </NoorSelect>
        </label>
        <label>
          <span>{t("Hijri adjustment")}</span>
          <NoorSelect aria-label={t("Hijri adjustment")}
            value={settings.adjustment}
            onChange={(event) =>
              update("adjustment", Number(event.target.value))
            }
          >
            {[-2, -1, 0, 1, 2].map((value) => (
              <option key={value} value={value}>
                {value
                  ? (value > 0 ? "+" : "") + value + " days"
                  : "No adjustment"}
              </option>
            ))}
          </NoorSelect>
        </label>
        <p>
          {schedule?.method ??
            PRAYER_METHODS.find((item) => item.id === settings.method)
              ?.label}{" "}
          · {settings.school === 1 ? "Hanafi" : "Standard"} Asr ·{" "}
          {schedule?.hijri ?? "Hijri date unavailable"}
        </p>
      </section>
      <PrayerReminders schedule={schedule} location={location.label} confirmed={confirmed} />
      <section className="prayer-month">
        <header>
          <div>
            <span>MONTHLY SCHEDULE</span>
            <h2>
              {view
                ? new Intl.DateTimeFormat("en-IN", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(view.year, view.month - 1, 1))
                : "Choose a location to load"}
            </h2>
          </div>
          <div>
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => {
                if (schedule) {
                  const [year, month] = schedule.dateISO.split("-").map(Number);
                  setView({ year, month });
                }
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              →
            </button>
          </div>
        </header>
        <div className="prayer-month-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                {PRAYERS.map((prayer) => (
                  <th scope="col" key={prayer}>
                    {prayer}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthData.map((day) => (
                <tr
                  className={
                    day.gregorianDate ===
                    schedule?.dateISO.split("-").reverse().join("-")
                      ? "is-today"
                      : ""
                  }
                  key={day.gregorianDate}
                >
                  <th scope="row">
                    <strong>
                      {day.weekday}, {day.gregorianDay}
                    </strong>
                    <span>{day.hijriLabel}</span>
                  </th>
                  {PRAYERS.map((prayer) => (
                    <td key={prayer}>{day.timings[prayer]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {monthLoading ? <p role="status">Loading monthly schedule…</p> : null}
          {monthError ? (
            <p role="alert">
              {monthError}{" "}
              <button
                type="button"
                onClick={() => setMonthRetry((value) => value + 1)}
              >
                Retry monthly schedule
              </button>
            </p>
          ) : null}
        </div>
      </section>
      <p className="prayer-center-source">
        Calculated by AlAdhan / Islamic Network. Times use the selected
        location’s timezone. Calculated times are not mosque iqamah times;
        confirm congregation times locally.
        {schedule
          ? " Retrieved " +
            new Date(schedule.calculatedAt).toLocaleString("en-GB", {
              timeZone: schedule.timezone,
            }) +
            "."
          : ""}
      </p>
    </section>
  );
}
