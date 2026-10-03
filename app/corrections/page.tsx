import type { Metadata } from "next";
import ToolHeader from "../site/ToolHeader";
import SiteFooter from "../site/SiteFooter";
import CorrectionForm from "./CorrectionForm";
export const metadata: Metadata = {
  title: "Report a Correction",
  description:
    "Prepare a source-backed content or technical correction for NOOR.",
  alternates: { canonical: "/corrections" },
};
export default async function CorrectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  return (
    <main className="trust-page">
      <ToolHeader
        title="CORRECTIONS"
        subtitle="References · Responsibility · Improvement"
      />
      <section className="trust-hero">
        <h1>Report a correction</h1>
        <p>Help us improve a reference, explanation or feature.</p>
      </section>
      <CorrectionForm initialPage={query.page?.slice(0, 500) ?? ""} />
      <SiteFooter />
    </main>
  );
}
