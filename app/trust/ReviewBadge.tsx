import Link from "next/link";
export default function ReviewBadge({
  label = "References provided",
  detail = "Qualified scholarly review pending",
  compact = false,
  reviewedAt,
  reviewer,
}: {
  label?: string;
  detail?: string;
  compact?: boolean;
  reviewedAt?: string;
  reviewer?: string;
}) {
  return (
    <aside
      className={"review-badge" + (compact ? " review-badge-compact" : "")}
      aria-label={label + ". " + detail}
    >
      <span className="review-badge-mark" aria-hidden="true">
        i
      </span>
      <div>
        <strong>{label}</strong>
        <span>{detail}</span>
        {reviewedAt && reviewer ? (
          <small>
            Reviewed by {reviewer} · {reviewedAt}
          </small>
        ) : (
          <small>Review scope and sources: see policy</small>
        )}
      </div>
      <Link href="/editorial-policy">Review policy</Link>
    </aside>
  );
}
