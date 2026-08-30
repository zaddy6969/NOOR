import type { Metadata } from "next";
import SavedLibrary from "./SavedLibrary";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";

export const metadata: Metadata = {
  title: "Saved Items",
  description: "Your privately saved Quran verses, Surahs, Darood and Islamic glossary words in NOOR.",
  alternates: { canonical: "/saved" },
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <main className="saved-page">
      <ToolHeader title="SAVED" subtitle="Your private NOOR collection" />
      <SavedLibrary />
      <SiteFooter />
    </main>
  );
}
