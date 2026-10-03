import type { Metadata } from "next";
import ToolHeader from "../site/ToolHeader";
import SiteFooter from "../site/SiteFooter";
import OfflineManager from "./OfflineManager";
export const metadata: Metadata = {
  title: "Offline Downloads",
  description:
    "Download selected Quran Surahs, translations and recitations for offline use.",
  alternates: { canonical: "/offline" },
};
export default function OfflinePage() {
  return (
    <main className="trust-page">
      <ToolHeader
        title="OFFLINE DOWNLOADS"
        subtitle="Choose · Download · Read"
      />
      <section className="trust-hero">
        <h1>Read wherever you are</h1>
        <p>Manage Quran downloads and their storage on this device.</p>
      </section>
      <OfflineManager />
      <SiteFooter />
    </main>
  );
}
