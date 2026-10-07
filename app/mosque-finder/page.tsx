import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import MosqueFinder from "./MosqueFinder";

export const metadata: Metadata = {
  title: "Mosque Finder — Nearby Masjids",
  description: "Find nearby mosques on a live map, filter mosques and dargahs, see distance and open directions.",
  alternates: { canonical: "/mosque-finder" },
};

export default function MosqueFinderPage() {
  return (
    <main className="directory-tool-page mosque-finder-page">
      <ToolHeader title="MOSQUE FINDER" subtitle="Live nearby masjids" />
      <section className="compact-directory-intro mosque-intro">
        <div><h1>Mosque Finder</h1></div>
        <p>Choose a city to find nearby mosques.</p>
      </section>
      <MosqueFinder />
      <section className="internal-source-note"><strong>Live community map</strong><p>Place data comes from OpenStreetMap through its read-only Overpass API and may be incomplete. Confirm prayer and Jumu‘ah times directly with the mosque.</p></section>
      <SiteFooter />
    </main>
  );
}
