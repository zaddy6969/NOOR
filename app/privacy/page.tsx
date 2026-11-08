import type { Metadata } from "next";
import TrustPage from "../trust/TrustPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How NOOR handles location, local preferences, accounts and external data requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <TrustPage
      title="Privacy"
      kicker="MINIMUM DATA, CLEAR PURPOSE"
      intro="Most NOOR tools work without an account. Location is requested only after a user action and private preferences stay on the device unless stated otherwise."
      sections={[
        {
          title: "Correction reports",
          paragraphs: [
            "Reports submitted inside NOOR are stored privately for review, with a receipt and a daily hashed network identifier for abuse prevention. Avoid sensitive information. GitHub reports use a separate public service. To request removal, submit a technical report with the original receipt.",
          ],
        },
        {
          title: "Location",
          paragraphs: [
            "Prayer, Qibla and mosque tools may use coordinates after you tap a location button. Coordinates are sent to the calculation or map provider. If you enable background reminders, NOOR stores the chosen city coordinates, calculation settings and browser push subscription for delivery. Disable reminders to delete that registration.",
          ],
        },
        {
          title: "On-device information",
          points: [
            "Theme choice, saved Quran bookmarks, counters, checklist progress and product-request ideas may be kept in browser local storage.",
            "Use Saved to export, restore or delete local bookmarks, notes and progress. Backups contain private information; keep them safe. Local storage is not an encryption guarantee.",
            "Offline Quran and audio downloads remain in this browser until removed from Offline Downloads or site data is cleared.",
            "Financial calculator values are calculated in the browser and are not stored by NOOR.",
          ],
        },
        {
          title: "Accounts and matrimony preview",
          paragraphs: [
            "Where Clerk and Neon are configured, authentication and private matrimony drafts use those connected services. Public profile discovery, direct messaging and matching are disabled. Do not place identity documents, exact addresses or private contact details in profile text.",
          ],
        },
        {
          title: "External services",
          paragraphs: [
            "NOOR requests Quran, calendar, prayer, Qibla, Open-Meteo / GeoNames city search and OpenStreetMap data from their respective providers. Those services may receive ordinary request metadata such as IP address and browser headers under their own policies.",
          ],
        },
        {
          title: "Site analytics",
          paragraphs: [
            "NOOR includes Vercel Web Analytics and Speed Insights to measure page visits and performance. These services process ordinary request and performance metadata under Vercel’s policies. Private notes, calculator inputs and saved-content text are not intentionally included in analytics events.",
          ],
        },
        {
          title: "Control",
          paragraphs: [
            "You can deny location, use a preset city, clear browser storage or avoid account-only features. Account deletion controls are available through the connected identity service when enabled.",
          ],
        },
      ]}
    />
  );
}
