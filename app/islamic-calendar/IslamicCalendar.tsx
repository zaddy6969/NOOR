"use client";
import { useNoorCopy } from "../site/SiteUtilities";
import { usePrayerSchedule } from "../prayer-times/usePrayerSchedule";
import { localDateISO } from "@/lib/prayer-schedule";
import { personalStorage } from "@/lib/personal-storage";
import { NOOR_LOCATION_EVENT } from "../site/location-settings";
import NoorSelect from "../site/NoorSelect";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CalendarDay = {
  gregorianDate: string;
  gregorianDay: number;
  weekday: string;
  hijriDate: string;
  hijriDay: number;
  hijriMonth: string;
  hijriMonthNumber: number;
  hijriMonthArabic: string;
  hijriYear: number;
  holidays: string[];
};

type CalendarResponse = {
  month: number;
  year: number;
  adjustment: number;
  days: CalendarDay[];
  source: string;
  method: string;
  error?: string;
};

type CalendarView = { month: number; year: number };

export default function IslamicCalendar() {
  const { locale, t } = useNoorCopy();
  const { location, settings, now, schedule } = usePrayerSchedule();
  const timezone = schedule?.timezone ?? location.timezone ?? "Asia/Kolkata";
  const dateISO = now ? localDateISO(now, timezone) : "";
  const todayKey = dateISO.split("-").reverse().join("-");
  const todayLabel = now
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: timezone,
      }).format(now)
    : t("Loading date…");
  const MONTH_FORMATTER = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const WEEKDAYS = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 0, 4 + i))),
  );
  function monthName(number: number, fallback: string) {
    const names =
      locale === "ur"
        ? [
            "محرم",
            "صفر",
            "ربیع الاول",
            "ربیع الآخر",
            "جمادی الاول",
            "جمادی الآخر",
            "رجب",
            "شعبان",
            "رمضان",
            "شوال",
            "ذوالقعدہ",
            "ذوالحجہ",
          ]
        : locale === "hi"
          ? [
              "मुहर्रम",
              "सफ़र",
              "रबीउल अव्वल",
              "रबीउल आखिर",
              "जुमादल अव्वल",
              "जुमादल आखिर",
              "रजब",
              "शाबान",
              "रमज़ान",
              "शव्वाल",
              "ज़ुलक़ादा",
              "ज़ुलहिज्जा",
            ]
          : [];
    return names[number - 1] ?? fallback;
  }
  const [selectedView, setView] = useState<CalendarView | null>(null);
  const [year, month] = dateISO ? dateISO.split("-").map(Number) : [0, 0];
  const view = selectedView ?? { year, month };
  const adjustment = settings.adjustment;
  const [saveError, setSaveError] = useState("");
  const setAdjustment = (value: number) => {
    try {
      personalStorage.setItem(
        "noor-prayer-settings-v1",
        JSON.stringify({ ...settings, adjustment: value }),
      );
      window.dispatchEvent(new Event(NOOR_LOCATION_EVENT));
      setSaveError("");
    } catch {
      setSaveError(t("Settings could not be saved."));
    }
  };
  const [eventMode, setEventMode] = useState<"Major" | "All">("Major");
  const [selectedDate, setSelectedDate] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const requestKey = `${view.year}-${view.month}-${adjustment}-${retryNonce}`;
  const [result, setResult] = useState<{
    key: string;
    calendar: CalendarResponse | null;
    error: string;
  }>({ key: "", calendar: null, error: "" });
  const loading = result.key !== requestKey;
  const calendar = loading ? null : result.calendar;
  const error = loading ? "" : result.error;

  useEffect(() => {
    if (!view.year) return;
    const controller = new AbortController();

    fetch(
      `/api/islamic-calendar/${view.year}/${view.month}?adjustment=${adjustment}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        const result = (await response.json()) as CalendarResponse;
        if (!response.ok)
          throw new Error(result.error ?? "Calendar request failed");
        return result;
      })
      .then((nextCalendar) =>
        setResult({ key: requestKey, calendar: nextCalendar, error: "" }),
      )
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError")
          return;
        setResult({
          key: requestKey,
          calendar: null,
          error:
            reason instanceof Error
              ? reason.message
              : "The calendar could not be loaded.",
        });
      });

    return () => controller.abort();
  }, [adjustment, requestKey, view.month, view.year]);

  const leadingBlankDays = new Date(
    Date.UTC(view.year, view.month - 1, 1),
  ).getUTCDay();
  const today = calendar?.days.find((day) => day.gregorianDate === todayKey);

  const hijriRange = (() => {
    if (!calendar?.days.length) return "Hijri dates";
    const months: string[] = [];
    for (const day of calendar.days) {
      const label = `${monthName(day.hijriMonthNumber, day.hijriMonth)} ${day.hijriYear} AH`;
      if (!months.includes(label)) months.push(label);
    }
    return months.join(" – ");
  })();

  const events = useMemo(() => {
    const all =
      calendar?.days.flatMap((day) =>
        day.holidays.map((holiday) => ({ day, holiday })),
      ) ?? [];
    if (eventMode === "All") return all;
    return all.filter(({ holiday }) =>
      /ramadan|eid|fitr|adha|ashura|arafah|mawlid|isra|miraj|laylat|qadr|new year/i.test(
        holiday,
      ),
    );
  }, [calendar, eventMode]);
  const selectedDay =
    calendar?.days.find((day) => day.gregorianDate === selectedDate) ??
    today ??
    calendar?.days[0];

  function changeMonth(delta: number) {
    const next = new Date(Date.UTC(view.year, view.month - 1 + delta, 1));
    setView({ year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 });
  }
  function showToday() {
    setView(null);
  }
  if (!view.year)
    return (
      <div className="calendar-state" role="status">
        {t("Loading date…")}
      </div>
    );

  return (
    <div className="calendar-tool">
      {saveError ? <p role="alert">{saveError}</p> : null}
      <section className="calendar-intro">
        <div>
          <h1>{t("Islamic Calendar")}</h1>
          <p>{t("Hijri dates and Islamic occasions, month by month.")}</p>
        </div>
        <article className="calendar-today-card">
          <span>{t("TODAY")}</span>
          {today ? (
            <>
              <strong>
                {today.hijriDay}{" "}
                {monthName(today.hijriMonthNumber, today.hijriMonth)}
              </strong>
              <b>{today.hijriYear} AH</b>
            </>
          ) : (
            <>
              <strong>{t("Hijri date")}</strong>
              <b>{t("Loading current date…")}</b>
            </>
          )}
          <small>{todayLabel}</small>
        </article>
      </section>

      <section className="calendar-panel" aria-busy={loading}>
        <div className="calendar-controls">
          <div className="calendar-nav">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label={t("Previous month")}
            >
              ←
            </button>
            <div>
              <strong>
                {MONTH_FORMATTER.format(
                  new Date(Date.UTC(view.year, view.month - 1, 1)),
                )}
              </strong>
              <span>{loading ? t("Loading Hijri dates…") : hijriRange}</span>
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label={t("Next month")}
            >
              →
            </button>
          </div>
          <div className="calendar-options">
            <button type="button" onClick={showToday}>
              {t("Today")}
            </button>
            <label>
              {t("Local adjustment")}
              <NoorSelect
                value={adjustment}
                onChange={(event) => setAdjustment(Number(event.target.value))}
                aria-label={t("Adjust Hijri dates")}
              >
                <option value={-2}>−2</option>
                <option value={-1}>−1 day</option>
                <option value={0}>{t("No adjustment")}</option>
                <option value={1}>+1</option>
                <option value={2}>+2</option>
              </NoorSelect>
            </label>
          </div>
        </div>

        {error ? (
          <div className="calendar-state" role="alert">
            <strong>{t("Calendar unavailable")}</strong>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRetryNonce((current) => current + 1)}
            >
              {t("Try again")}
            </button>
          </div>
        ) : (
          <div className="calendar-board">
            <div className="calendar-grid calendar-weekdays" role="row">
              {WEEKDAYS.map((weekday) => (
                <span role="columnheader" key={weekday}>
                  {weekday}
                </span>
              ))}
            </div>
            <div
              className="calendar-grid calendar-days"
              role="grid"
              aria-label={MONTH_FORMATTER.format(
                new Date(Date.UTC(view.year, view.month - 1, 1)),
              )}
            >
              {Array.from({ length: leadingBlankDays }, (_, index) => (
                <span
                  className="calendar-blank"
                  aria-hidden="true"
                  key={`blank-${index}`}
                />
              ))}
              {loading
                ? Array.from({ length: 28 }, (_, index) => (
                    <span
                      className="calendar-day calendar-day-loading"
                      aria-hidden="true"
                      key={`loading-${index}`}
                    />
                  ))
                : calendar?.days.map((day) => (
                    <button
                      type="button"
                      onClick={() => setSelectedDate(day.gregorianDate)}
                      className={`${day.gregorianDate === todayKey ? "calendar-day is-today" : "calendar-day"}${day.gregorianDate === selectedDay?.gregorianDate ? " is-selected" : ""}`}
                      role="gridcell"
                      key={day.gregorianDate}
                      aria-label={`${day.weekday}, Gregorian ${day.gregorianDay}; Hijri ${day.hijriDay} ${monthName(day.hijriMonthNumber, day.hijriMonth)} ${day.hijriYear}`}
                    >
                      <div>
                        <strong>{day.gregorianDay}</strong>
                        {day.gregorianDate === todayKey ? (
                          <span>{t("TODAY")}</span>
                        ) : null}
                      </div>
                      <p>
                        {day.hijriDay}{" "}
                        {monthName(day.hijriMonthNumber, day.hijriMonth)}
                      </p>
                      {day.holidays.slice(0, 1).map((holiday) => (
                        <small key={holiday}>{holiday}</small>
                      ))}
                    </button>
                  ))}
            </div>
          </div>
        )}
      </section>

      <section className="calendar-bottom-grid">
        <article className="calendar-events">
          <p className="eyebrow">{t("IMPORTANT DATES THIS MONTH")}</p>
          <h2>{t("Occasions and observances")}</h2>
          {selectedDay ? (
            <div className="calendar-selected-day">
              <span>{t("SELECTED DAY")}</span>
              <strong>
                {selectedDay.weekday}, {selectedDay.gregorianDay}{" "}
                {MONTH_FORMATTER.format(
                  new Date(Date.UTC(view.year, view.month - 1, 1)),
                )
                  .replace(String(view.year), "")
                  .trim()}
              </strong>
              <b>
                {selectedDay.hijriDay}{" "}
                {monthName(
                  selectedDay.hijriMonthNumber,
                  selectedDay.hijriMonth,
                )}{" "}
                {selectedDay.hijriYear} AH
              </b>
              {selectedDay.holidays.length ? (
                <small>{selectedDay.holidays.join(" · ")}</small>
              ) : (
                <small>{t("No provider-listed observance")}</small>
              )}
            </div>
          ) : null}
          <div
            className="calendar-event-filter"
            role="group"
            aria-label={t("Calendar event filter")}
          >
            <button
              className={eventMode === "Major" ? "active" : ""}
              type="button"
              onClick={() => setEventMode("Major")}
            >
              {t("Major dates")}
            </button>
            <button
              className={eventMode === "All" ? "active" : ""}
              type="button"
              onClick={() => setEventMode("All")}
            >
              {t("All observances")}
            </button>
          </div>
          {loading ? (
            <p className="calendar-muted">{t("Checking this month…")}</p>
          ) : events.length ? (
            <div>
              {events.map(({ day, holiday }) => (
                <span key={`${day.gregorianDate}-${holiday}`}>
                  <b>{day.gregorianDay}</b>
                  <span>
                    <strong>{holiday}</strong>
                    <small>
                      {day.hijriDay}{" "}
                      {monthName(day.hijriMonthNumber, day.hijriMonth)}{" "}
                      {day.hijriYear} AH
                    </small>
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="calendar-muted">
              {t("No provider-listed observances for this Gregorian month.")}
            </p>
          )}
        </article>
        <aside className="calendar-guidance">
          <span>{t("MOON-SIGHTING NOTE")}</span>
          <h2>{t("Calculated dates are a planning aid.")}</h2>
          <p>
            This calendar uses the calculated Umm al-Qura method. The beginning
            and end of Islamic months—and therefore dates such as Ramadan and
            Eid—can differ by local moon sighting.
          </p>
          <strong>
            {t(
              "For acts of worship, follow announcements from trusted local scholars and authorities.",
            )}
          </strong>
          <Link href="/topics/festivals">
            Read the Islamic occasions guide →
          </Link>
        </aside>
      </section>
    </div>
  );
}
