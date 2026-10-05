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
        <div><p><LocaleText text="LOCAL PRAYER SCHEDULE" /></p><h1><LocaleText text="Prayer times you can verify." /></h1></div>
        <p><LocaleText text="One location powers NOOR’s prayer, Qibla and mosque tools. Review the calculation method and always confirm congregation times with your local mosque." /></p>
      </section>
      <PrayerTimesCenter />
      <ReviewBadge label="Calculation settings" detail="AlAdhan method and Asr settings are visible. Confirm congregation times locally." />
      <SiteFooter />
    </main>
  );
}
