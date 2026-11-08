import type { Metadata } from "next";
import { Suspense } from "react";
import { LocaleText } from "../site/SiteUtilities";
import DuasLibrary from "./DuasLibrary";
import ToolHeader from "../site/ToolHeader";
import SiteFooter from "../site/SiteFooter";
export const metadata: Metadata = {
  title: "Daily Duas",
  description:
    "Daily supplications with Arabic, meanings, source references and private saved items.",
  alternates: { canonical: "/duas" },
};
export default function DuasPage() {
  return (
    <main className="trust-page">
      <ToolHeader title="DAILY DUAS" subtitle="Read · Remember · Save" />
      <section className="trust-hero">
        <h1><LocaleText text="Daily Duas" /></h1>
        <p>
          <LocaleText text="Arabic, meanings and sources" />
        </p>
      </section>
      <section className="daily-duas-page">
        <Suspense><DuasLibrary /></Suspense>
      </section>
      <SiteFooter />
    </main>
  );
}
