import type { Metadata } from "next";
import Link from "next/link";
import IslamicCalendar from "./IslamicCalendar";

export const metadata: Metadata = {
  title: "Islamic Calendar — Gregorian & Hijri Dates | NOOR",
  description: "Browse a real month-by-month Islamic calendar with Hijri dates, important occasions and local date adjustment.",
  openGraph: { title: "Islamic Calendar | NOOR", description: "Gregorian and Hijri dates in one calm monthly view.", images: [] },
  twitter: { card: "summary", title: "Islamic Calendar | NOOR", description: "Gregorian and Hijri dates in one calm monthly view.", images: [] },
};

export default function IslamicCalendarPage() {
  return (
    <main className="calendar-page" id="top">
      <header className="quran-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><div><strong>ISLAMIC CALENDAR</strong><span>Gregorian · Hijri · Important dates</span></div><Link className="topic-home-link" href="/">← Home</Link></header>
      <IslamicCalendar />
      <footer className="calendar-source"><span>CALENDAR SOURCE</span><p>Hijri conversions are provided by AlAdhan / Islamic Network using the Umm al-Qura calculated calendar.</p><a href="https://aladhan.com/islamic-calendar-api" target="_blank" rel="noreferrer">View provider documentation ↗</a></footer>
    </main>
  );
}
