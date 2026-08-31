import Link from "next/link";

export default function ReviewBadge({
  label = "Source-checked",
  detail = "Reviewed by the NOOR editorial team",
  compact = false,
}: {
  label?: string;
  detail?: string;
  compact?: boolean;
}) {
  return (
    <aside className={`review-badge${compact ? " review-badge-compact" : ""}`} aria-label={`${label}. ${detail}.`}>
      <span className="review-badge-mark" aria-hidden="true">✓</span>
      <div><strong>{label}</strong><span>{detail}</span><small>Last reviewed 31 August 2026</small></div>
      <Link href="/editorial-policy">Review policy</Link>
    </aside>
  );
}
