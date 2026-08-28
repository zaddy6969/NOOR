import type { Metadata } from "next";
import TrustPage from "../trust/TrustPage";

export const metadata: Metadata = { title: "Privacy", description: "How NOOR handles location, local preferences, accounts and external data requests.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <TrustPage title="Privacy" kicker="MINIMUM DATA, CLEAR PURPOSE" intro="Most NOOR tools work without an account. Location is requested only after a user action and private preferences stay on the device unless stated otherwise." sections={[
    { title: "Location", paragraphs: ["Prayer, Qibla and mosque tools may use coordinates after you tap a location button. Coordinates are sent only to the relevant calculation or map endpoint for that request and are not saved by NOOR as a profile field."] },
    { title: "On-device information", points: ["Theme choice, saved Quran bookmarks, counters, checklist progress and product-request ideas may be kept in browser local storage.", "Clearing site data removes these local items.", "Financial calculator values are calculated in the browser and are not stored by NOOR."] },
    { title: "Accounts and matrimony preview", paragraphs: ["Where Clerk and Neon are configured, authentication and private matrimony drafts use those connected services. Public profile discovery, direct messaging and matching are disabled. Do not place identity documents, exact addresses or private contact details in profile text."] },
    { title: "External services", paragraphs: ["NOOR requests Quran, calendar, prayer, Qibla and OpenStreetMap data from their respective providers. Those services may receive ordinary request metadata such as IP address and browser headers under their own policies."] },
    { title: "Control", paragraphs: ["You can deny location, use a preset city, clear browser storage or avoid account-only features. Account deletion controls are available through the connected identity service when enabled."] },
  ]} />;
}
