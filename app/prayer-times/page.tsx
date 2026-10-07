import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import ReviewBadge from "../trust/ReviewBadge";
import { LocaleText } from "../site/SiteUtilities";
import PrayerTimesCenter from "./PrayerTimesCenter";

export const metadata: Metadata = {
  title: "Prayer Times — Daily & Monthly Schedule",
  description: "See today’s prayer times, next-prayer countdown and a monthly schedule with clear location, calculation and Asr settings.",
  alternates: { canonical: "/prayer-times" },
};

export default function PrayerTimesPage() {
  return (
    <main className="prayer-center-page">
      <ToolHeader title="PRAYER TIMES" subtitle="Today · Monthly schedule · Calculation settings" />
      <section className="prayer-center-intro">
        <div><h1><LocaleText text="Prayer Times" /></h1></div>
        <p><LocaleText text="Choose your city. Confirm congregation times with your mosque." /></p>
      </section>
      <PrayerTimesCenter />
      <ReviewBadge label="Calculation settings" detail="AlAdhan method and Asr settings are visible. Confirm congregation times locally." />
      <SiteFooter />
    </main>
  );
}
