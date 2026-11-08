import ToolHeader from "../site/ToolHeader";
import type { Metadata } from "next";
import NaatLibrary from "./NaatLibrary";
import { naatEntries } from "./naat-data";

export const metadata: Metadata = {
  title: "Naat & Salam Library",
  description:
    "Browse Naat and Salam by title, writer, reciter and language, with separate audio and video players.",
  alternates: { canonical: "/naat" },
};

export default function NaatLibraryPage() {
  return (
    <main className="naat-library-page">
      <ToolHeader title="Naat & Salam" subtitle="" />
      <div className="naat-library-heading">
        <h1>Naat &amp; Salam</h1>
      </div>
      <NaatLibrary entries={naatEntries} />
    </main>
  );
}
