import ToolHeader from "../site/ToolHeader";
import type { Metadata } from "next";
import IslamicCalendar from "./IslamicCalendar";

export const metadata: Metadata = {
  title: "Islamic Calendar — Gregorian & Hijri Dates",
  description:
    "Browse a real month-by-month Islamic calendar with Hijri dates, important occasions and local date adjustment.",
  alternates: { canonical: "/islamic-calendar" },
  openGraph: {
    title: "Islamic Calendar | NOOR",
    description: "Gregorian and Hijri dates in one calm monthly view.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Islamic Calendar | NOOR",
    description: "Gregorian and Hijri dates in one calm monthly view.",
    images: [],
  },
};

export default function IslamicCalendarPage() {
  return (
    <main className="calendar-page" id="top">
      <ToolHeader title="Islamic Calendar" subtitle="" />
      <IslamicCalendar />
      <footer className="calendar-source">
        <span>CALENDAR SOURCE</span>
        <p>
          Hijri conversions are provided inside NOOR using AlAdhan / Islamic
          Network and the Umm al-Qura calculated calendar.
        </p>
        <strong>Dates stay inside NOOR</strong>
      </footer>
    </main>
  );
}
