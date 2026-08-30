import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import TravelPlanner from "./TravelPlanner";

export const metadata: Metadata = { title: "Muslim Religious Tourism Planner", description: "Build a respectful Muslim travel plan with destination guidance, prayer preparation, packing and a private checklist.", alternates: { canonical: "/religious-tourism" } };

export default function ReligiousTourismPage() {
  return <main className="directory-tool-page"><ToolHeader title="RELIGIOUS TOURISM" subtitle="Plan · Prepare · Visit with adab"/><section className="compact-directory-intro"><div><p>JOURNEY PLANNER</p><h1>Travel with purpose,<br/><em>prepare with care.</em></h1></div><p>Choose a destination and build a private preparation list covering worship, documents, health, accessibility and respectful conduct.</p></section><TravelPlanner/><SiteFooter/></main>;
}
