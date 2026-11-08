export type Correction = {
  kind: string;
  page: string;
  statement: string;
  source: string;
};
export function validateCorrection(value: unknown): Correction | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (
    !["content", "translation", "technical", "review"].includes(
      String(v.kind),
    ) ||
    typeof v.page !== "string" ||
    typeof v.statement !== "string" ||
    typeof v.source !== "string"
  )
    return null;
  const page = v.page.trim(),
    statement = v.statement.trim(),
    source = v.source.trim();
  if (
    !page ||
    page.length > 500 ||
    statement.length < 10 ||
    statement.length > 2000 ||
    source.length > 1000 ||
    (v.kind !== "technical" && !source)
  )
    return null;
  return { kind: String(v.kind), page, statement, source };
}
