import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import LughatLibrary from "./LughatLibrary";

export const metadata: Metadata = {
  title: "Islamic Urdu Glossary",
  description: "Search NOOR's original concise Islamic Urdu glossary with Urdu script, Roman reading help, English meanings and usage notes.",
  alternates: { canonical: "/glossary" },
};

export default function FirozulLughatPage() {
  return (
    <main className="directory-tool-page">
      <ToolHeader title="ISLAMIC URDU GLOSSARY" subtitle="Urdu · Roman · English" />
      <section className="compact-directory-intro">
        <div><p>NOOR ORIGINAL GLOSSARY</p><h1>Find the word.<br/>{" "}<em>Understand the meaning.</em></h1></div>
        <p>Search common Islamic terms by English, Roman Urdu or Urdu script. Every definition is concise, readable and kept inside NOOR.</p>
      </section>
      <LughatLibrary />
      <section className="internal-source-note"><strong>About this glossary</strong><p>This is NOOR’s original concise reference. It is not the Feroz-ul-Lughat book and does not reproduce any commercial dictionary. Technical religious rulings should be confirmed with a qualified scholar.</p></section>
      <SiteFooter />
    </main>
  );
}
