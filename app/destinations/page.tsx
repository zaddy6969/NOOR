import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import DestinationLibrary from "./DestinationLibrary";

export const metadata: Metadata = { title: "Famous Muslim Destinations", description: "Explore sacred cities, Islamic learning centres, Sufi heritage and historic Muslim destinations in one internal guide.", alternates: { canonical: "/destinations" } };

export default function DestinationsPage() {
  return <main className="directory-tool-page"><ToolHeader title="MUSLIM DESTINATIONS" subtitle="Sacred · Heritage · Learning"/><section className="compact-directory-intro"><div><h1>Muslim Destinations</h1></div><p>Explore places, history and visiting guidance.</p></section><DestinationLibrary/><SiteFooter/></main>;
}
