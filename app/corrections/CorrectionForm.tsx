"use client";
import { useState } from "react";
import NoorSelect from "../site/NoorSelect";
export default function CorrectionForm({
  initialPage = "",
  initialKind = "content",
}: {
  initialPage?: string;
  initialKind?: string;
}) {
  const [kind, setKind] = useState(
    ["content", "translation", "technical", "review"].includes(initialKind)
      ? initialKind
      : "content",
  );
  const [page, setPage] = useState(initialPage);
  const [statement, setStatement] = useState("");
  const [source, setSource] = useState("");
  const [receipt, setReceipt] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const body =
    "Report type: " +
    kind +
    "\n\nPage: " +
    page +
    "\n\nStatement to check:\n" +
    statement +
    "\n\nSupporting source:\n" +
    source +
    "\n\nPlease verify the text, reference and relevant context.";
  return (
    <section className="correction-form">
      <h2>Report a correction</h2>
      <p>
        Submit directly to NOOR. No account needed. Include a reference for
        religious content and avoid sensitive personal information.
      </p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          setDraft(body);
          try {
            const response = await fetch("/api/corrections", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ kind, page, statement, source }),
            });
            const data = await response.json();
            if (!response.ok || !data.receipt)
              throw new Error(data.error ?? "Report was not confirmed.");
            setReceipt(data.receipt);
            setDraft("");
          } catch (reason) {
            setError(
              reason instanceof Error
                ? reason.message
                : "Report was not confirmed.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Report type
          <NoorSelect
            aria-label="Report type"
            value={kind}
            onChange={(event) => setKind(event.target.value)}
          >
            <option value="content">Content or reference</option>
            <option value="translation">Translation or attribution</option>
            <option value="technical">Website problem</option>
            <option value="review">Qualified review submission</option>
          </NoorSelect>
        </label>
        {kind === "review" ? (
          <p>
            Please include your name, relevant qualifications, exact review
            scope, date, source checks and approval or requested corrections.
            Publication of your name requires your agreement.
          </p>
        ) : null}
        <label>
          NOOR page URL or path
          <input
            required
            maxLength={500}
            value={page}
            onChange={(event) => setPage(event.target.value)}
          />
        </label>
        <label>
          Statement or issue
          <textarea
            required
            minLength={10}
            maxLength={2000}
            value={statement}
            onChange={(event) => setStatement(event.target.value)}
          />
        </label>
        <label>
          Supporting reference or source
          <input
            required={kind !== "technical"}
            maxLength={1000}
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />
        </label>
        <button type="submit" disabled={busy || !!receipt}>
          {busy ? "Sending…" : "Submit report"}
        </button>
      </form>
      {receipt ? (
        <p role="status">
          Report received. Reference: <code>{receipt}</code>. This confirms
          receipt, not approval of the suggested change.
        </p>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
      {draft && error ? (
        <div>
          <h3>Your report</h3>
          <pre>{draft}</pre>
          <a
            className="primary-action"
            href={
              "https://github.com/zaddy6969/NOOR/issues/new?" +
              new URLSearchParams({
                title:
                  (kind === "review" ? "Review submission: " : "Correction: ") +
                  page.slice(0, 100),
                body: draft,
              })
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Submit on GitHub instead ↗
          </a>
          <p>
            Optional public route for contributors. GitHub sign-in is required.
          </p>
        </div>
      ) : null}
    </section>
  );
}
