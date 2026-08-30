import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import DestinationLibrary from "./DestinationLibrary";

export const metadata: Metadata = { title: "Famous Muslim Destinations", description: "Explore sacred cities, Islamic learning centres, Sufi heritage and historic Muslim destinations in one internal guide.", alternates: { canonical: "/destinations" } };

export default function DestinationsPage() {
  return <main className="directory-tool-page"><ToolHeader title="MUSLIM DESTINATIONS" subtitle="Sacred · Heritage · Learning"/><section className="compact-directory-intro"><div><p>PLACES WITH MEANING</p><h1>Know the place<br/><em>before you visit.</em></h1></div><p>Browse significance, key places, etiquette and planning notes without leaving NOOR. Open a destination only when you want its full details.</p></section><DestinationLibrary/><SiteFooter/></main>;
}
