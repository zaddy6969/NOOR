import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import MosqueFinder from "./MosqueFinder";

export const metadata: Metadata = {
  title: "Mosque Finder — Nearby Masjids | NOOR",
  description: "Use your location to find nearby mosques, see distance and address, and open directions.",
};

export default function MosqueFinderPage() {
  return (
    <main className="directory-tool-page mosque-finder-page">
      <ToolHeader title="MOSQUE FINDER" subtitle="Live nearby masjids" />
      <section className="compact-directory-intro mosque-intro">
        <div><p>NEARBY PRAYER</p><h1>Find a masjid<br/><em>close to you.</em></h1></div>
        <p>Allow location once, select a search radius and NOOR will list the nearest mapped mosques. Your coordinates are used only for this request.</p>
      </section>
      <MosqueFinder />
      <section className="internal-source-note"><strong>Live community map</strong><p>Place data comes from OpenStreetMap through its read-only Overpass API and may be incomplete. Confirm prayer and Jumu‘ah times directly with the mosque.</p></section>
      <SiteFooter />
    </main>
  );
}
