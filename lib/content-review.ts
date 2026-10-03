export type ContentReview = { path: string; title: string; status: "pending" | "reviewed"; reviewer: string | null; reviewedAt: string | null; scope: string; source: string };
// A reviewed status requires a named qualified reviewer, scope and dated approval.
// Provider attribution checks are separate from scholarly approval.
export const CONTENT_REVIEWS: ContentReview[] = [
  { path: "/topics/pillars", title: "Five pillars", status: "pending", reviewer: null, reviewedAt: null, scope: "Educational explanation and references", source: "Quran and cited Hadith collections" },
  { path: "/topics/tawheed", title: "Tawheed and beliefs", status: "pending", reviewer: null, reviewedAt: null, scope: "Educational explanation and differences of opinion", source: "Quran and cited Hadith collections" },
  { path: "/namaz", title: "Prayer guide", status: "pending", reviewer: null, reviewedAt: null, scope: "Prayer instructions and school-specific details", source: "References listed within the guide" },
  { path: "/duas", title: "Daily duas", status: "pending", reviewer: null, reviewedAt: null, scope: "Arabic, transliteration, meaning and report references", source: "References shown for each dua" },
  { path: "/darood", title: "Darood and salawat", status: "pending", reviewer: null, reviewedAt: null, scope: "Reported and traditional compositions; attribution", source: "Sources and composition labels shown on the page" },
  { path: "/zakat-calculator", title: "Zakat calculator", status: "pending", reviewer: null, reviewedAt: null, scope: "Calculation assumptions and explanations", source: "Assumptions and standards shown in the calculator" },
];
export function publishedReview(record: ContentReview) {
  return record.status === "reviewed" && Boolean(record.reviewer?.trim()) && Boolean(record.scope.trim()) && Boolean(record.reviewedAt && Number.isFinite(Date.parse(record.reviewedAt)));
}
