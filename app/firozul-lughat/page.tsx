import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import LughatLibrary from "./LughatLibrary";

export const metadata: Metadata = {
  title: "Firoz-ul-Lughat — Urdu & Islamic Dictionary | NOOR",
  description: "Search a concise Urdu and Islamic glossary with Urdu script, Roman reading help, English meanings and usage notes.",
};

export default function FirozulLughatPage() {
  return (
    <main className="directory-tool-page">
      <ToolHeader title="FIROZ-UL-LUGHAT" subtitle="Urdu · Roman · English" />
      <section className="compact-directory-intro">
        <div><p>URDU & ISLAMIC DICTIONARY</p><h1>Find the word.<br/><em>Understand the meaning.</em></h1></div>
        <p>Search common Islamic terms by English, Roman Urdu or Urdu script. Every definition is concise, readable and kept inside NOOR.</p>
      </section>
      <LughatLibrary />
      <section className="internal-source-note"><strong>About this library</strong><p>This is NOOR’s original concise glossary. It does not reproduce the text of the commercial Feroz-ul-Lughat dictionary. Technical religious rulings should be confirmed with a qualified scholar.</p></section>
      <SiteFooter />
    </main>
  );
}
