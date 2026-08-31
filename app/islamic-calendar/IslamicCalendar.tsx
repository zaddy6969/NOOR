"use client";

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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });
const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function apiDate(date: Date) {
  return [String(date.getDate()).padStart(2, "0"), String(date.getMonth() + 1).padStart(2, "0"), date.getFullYear()].join("-");
}

export default function IslamicCalendar() {
  const [view, setView] = useState<CalendarView>(() => {
    const current = new Date();
    return { month: current.getMonth() + 1, year: current.getFullYear() };
  });
  const [todayKey, setTodayKey] = useState(() => apiDate(new Date()));
  const [todayLabel] = useState(() => FULL_DATE_FORMATTER.format(new Date()));
  const [adjustment, setAdjustment] = useState(0);
  const [eventMode, setEventMode] = useState<"Major" | "All">("Major");
  const [selectedDate, setSelectedDate] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const requestKey = `${view.year}-${view.month}-${adjustment}-${retryNonce}`;
  const [result, setResult] = useState<{ key: string; calendar: CalendarResponse | null; error: string }>({ key: "", calendar: null, error: "" });
  const loading = result.key !== requestKey;
  const calendar = loading ? null : result.calendar;
  const error = loading ? "" : result.error;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/islamic-calendar/${view.year}/${view.month}?adjustment=${adjustment}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as CalendarResponse;
        if (!response.ok) throw new Error(result.error ?? "Calendar request failed");
        return result;
      })
      .then((nextCalendar) => setResult({ key: requestKey, calendar: nextCalendar, error: "" }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setResult({ key: requestKey, calendar: null, error: reason instanceof Error ? reason.message : "The calendar could not be loaded." });
      });

    return () => controller.abort();
  }, [adjustment, requestKey, view.month, view.year]);

  const leadingBlankDays = new Date(view.year, view.month - 1, 1).getDay();
  const today = calendar?.days.find((day) => day.gregorianDate === todayKey);

  const hijriRange = useMemo(() => {
    if (!calendar?.days.length) return "Hijri dates";
    const months: string[] = [];
    for (const day of calendar.days) {
      const label = `${day.hijriMonth} ${day.hijriYear} AH`;
      if (!months.includes(label)) months.push(label);
    }
    return months.join(" – ");
  }, [calendar]);

  const events = useMemo(() => {
    const all = calendar?.days.flatMap((day) => day.holidays.map((holiday) => ({ day, holiday }))) ?? [];
    if (eventMode === "All") return all;
    return all.filter(({ holiday }) => /ramadan|eid|fitr|adha|ashura|arafah|mawlid|isra|miraj|laylat|qadr|new year/i.test(holiday));
  }, [calendar, eventMode]);
  const selectedDay = calendar?.days.find((day) => day.gregorianDate === selectedDate) ?? today ?? calendar?.days[0];

  function changeMonth(delta: number) {
    setView((current) => {
      const next = new Date(current.year, current.month - 1 + delta, 1);
      return { month: next.getMonth() + 1, year: next.getFullYear() };
    });
  }

  function showToday() {
    const current = new Date();
    setView({ month: current.getMonth() + 1, year: current.getFullYear() });
    setTodayKey(apiDate(current));
  }

  return (
    <div className="calendar-tool">
      <section className="calendar-intro">
        <div>
          <p className="eyebrow">GREGORIAN + HIJRI</p>
          <h1>Your Islamic calendar,<br/>{" "}<em>day by day.</em></h1>
          <p>See the Hijri date beneath every Gregorian date, move between months, and review important Islamic occasions in one calm view.</p>
        </div>
        <article className="calendar-today-card">
          <span>TODAY</span>
          {today ? <><strong>{today.hijriDay} {today.hijriMonth}</strong><b>{today.hijriYear} AH</b></> : <><strong>Hijri date</strong><b>Loading current date…</b></>}
          <small>{todayLabel}</small>
        </article>
      </section>

      <section className="calendar-panel" aria-busy={loading}>
        <div className="calendar-controls">
          <div className="calendar-nav">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">←</button>
            <div>
              <strong>{MONTH_FORMATTER.format(new Date(view.year, view.month - 1, 1))}</strong>
              <span>{loading ? "Loading Hijri dates…" : hijriRange}</span>
            </div>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">→</button>
          </div>
          <div className="calendar-options">
            <button type="button" onClick={showToday}>Today</button>
            <label>
              Local adjustment
              <select value={adjustment} onChange={(event) => setAdjustment(Number(event.target.value))} aria-label="Adjust Hijri dates">
                <option value={-1}>−1 day</option>
                <option value={0}>No adjustment</option>
                <option value={1}>+1 day</option>
              </select>
            </label>
          </div>
        </div>

        {error ? (
          <div className="calendar-state" role="alert"><strong>Calendar unavailable</strong><p>{error}</p><button type="button" onClick={() => setRetryNonce((current) => current + 1)}>Try again</button></div>
        ) : (
          <div className="calendar-board">
            <div className="calendar-grid calendar-weekdays" role="row">
              {WEEKDAYS.map((weekday) => <span role="columnheader" key={weekday}>{weekday}</span>)}
            </div>
            <div className="calendar-grid calendar-days" role="grid" aria-label={MONTH_FORMATTER.format(new Date(view.year, view.month - 1, 1))}>
              {Array.from({ length: leadingBlankDays }, (_, index) => <span className="calendar-blank" aria-hidden="true" key={`blank-${index}`}/>) }
              {loading
                ? Array.from({ length: 28 }, (_, index) => <span className="calendar-day calendar-day-loading" aria-hidden="true" key={`loading-${index}`}/>)
                : calendar?.days.map((day) => (
                  <button type="button" onClick={() => setSelectedDate(day.gregorianDate)} className={`${day.gregorianDate === todayKey ? "calendar-day is-today" : "calendar-day"}${day.gregorianDate === selectedDay?.gregorianDate ? " is-selected" : ""}`} role="gridcell" key={day.gregorianDate} aria-label={`${day.weekday}, Gregorian ${day.gregorianDay}; Hijri ${day.hijriDay} ${day.hijriMonth} ${day.hijriYear}`}>
                    <div><strong>{day.gregorianDay}</strong>{day.gregorianDate === todayKey ? <span>TODAY</span> : null}</div>
                    <p>{day.hijriDay} {day.hijriMonth}</p>
                    {day.holidays.slice(0, 1).map((holiday) => <small key={holiday}>{holiday}</small>)}
                  </button>
                ))}
            </div>
          </div>
        )}
      </section>

      <section className="calendar-bottom-grid">
        <article className="calendar-events">
          <p className="eyebrow">IMPORTANT DATES THIS MONTH</p>
          <h2>Occasions and observances</h2>
          {selectedDay ? <div className="calendar-selected-day"><span>SELECTED DAY</span><strong>{selectedDay.weekday}, {selectedDay.gregorianDay} {MONTH_FORMATTER.format(new Date(view.year, view.month - 1, 1)).replace(String(view.year), "").trim()}</strong><b>{selectedDay.hijriDay} {selectedDay.hijriMonth} {selectedDay.hijriYear} AH</b>{selectedDay.holidays.length ? <small>{selectedDay.holidays.join(" · ")}</small> : <small>No provider-listed observance</small>}</div> : null}
          <div className="calendar-event-filter" role="group" aria-label="Calendar event filter"><button className={eventMode === "Major" ? "active" : ""} type="button" onClick={() => setEventMode("Major")}>Major dates</button><button className={eventMode === "All" ? "active" : ""} type="button" onClick={() => setEventMode("All")}>All observances</button></div>
          {loading ? <p className="calendar-muted">Checking this month…</p> : events.length ? <div>{events.map(({ day, holiday }) => <span key={`${day.gregorianDate}-${holiday}`}><b>{day.gregorianDay}</b><span><strong>{holiday}</strong><small>{day.hijriDay} {day.hijriMonth} {day.hijriYear} AH</small></span></span>)}</div> : <p className="calendar-muted">No provider-listed observances for this Gregorian month.</p>}
        </article>
        <aside className="calendar-guidance">
          <span>MOON-SIGHTING NOTE</span>
          <h2>Calculated dates are a planning aid.</h2>
          <p>This calendar uses the calculated Umm al-Qura method. The beginning and end of Islamic months—and therefore dates such as Ramadan and Eid—can differ by local moon sighting.</p>
          <strong>For acts of worship, follow announcements from trusted local scholars and authorities.</strong>
          <Link href="/topics/festivals">Read the Islamic occasions guide →</Link>
        </aside>
      </section>
    </div>
  );
}
