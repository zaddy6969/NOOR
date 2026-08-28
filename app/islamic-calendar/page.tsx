import type { Metadata } from "next";
import Link from "next/link";
import { HeaderUtilities } from "../site/SiteUtilities";
import IslamicCalendar from "./IslamicCalendar";

export const metadata: Metadata = {
  title: "Islamic Calendar — Gregorian & Hijri Dates | NOOR",
  description: "Browse a real month-by-month Islamic calendar with Hijri dates, important occasions and local date adjustment.",
  alternates: { canonical: "/islamic-calendar" },
  openGraph: { title: "Islamic Calendar | NOOR", description: "Gregorian and Hijri dates in one calm monthly view.", images: [] },
  twitter: { card: "summary", title: "Islamic Calendar | NOOR", description: "Gregorian and Hijri dates in one calm monthly view.", images: [] },
};

export default function IslamicCalendarPage() {
  return (
    <main className="calendar-page" id="top">
      <header className="quran-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><div><strong>ISLAMIC CALENDAR</strong><span>Gregorian · Hijri · Important dates</span></div><aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← Home</Link></aside></header>
      <IslamicCalendar />
      <footer className="calendar-source"><span>CALENDAR SOURCE</span><p>Hijri conversions are provided inside NOOR using AlAdhan / Islamic Network and the Umm al-Qura calculated calendar.</p><strong>Dates stay inside NOOR</strong></footer>
    </main>
  );
}
