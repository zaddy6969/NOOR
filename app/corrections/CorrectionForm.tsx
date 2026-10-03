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
  const [kind, setKind] = useState(["content", "translation", "technical", "review"].includes(initialKind) ? initialKind : "content");
  const [page, setPage] = useState(initialPage);
  const [statement, setStatement] = useState("");
  const [source, setSource] = useState("");
  const [draft, setDraft] = useState("");
  const body =
    "Report type: " + kind + "\n\nPage: " +
    page +
    "\n\nStatement to check:\n" +
    statement +
    "\n\nSupporting source:\n" +
    source +
    "\n\nPlease verify the text, reference and relevant context.";
  return (
    <section className="correction-form">
      <h2>Prepare a correction report</h2>
      <p>
        Describe the exact issue and supporting reference. You can review the
        draft before opening GitHub to submit it. Reports are public; exclude
        private information.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setDraft(body);
        }}
      >
        <label>Report type<NoorSelect aria-label="Report type" value={kind} onChange={(event) => setKind(event.target.value)}><option value="content">Content or reference</option><option value="translation">Translation or attribution</option><option value="technical">Website problem</option><option value="review">Qualified review submission</option></NoorSelect></label>
        {kind === "review" ? <p>Please include your name, relevant qualifications, exact review scope, date, source checks and approval or requested corrections. Publication of your name requires your agreement.</p> : null}
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
        <button type="submit">Preview correction report</button>
      </form>
      {draft ? (
        <div>
          <h3>Your report</h3>
          <pre>{draft}</pre>
          <a
            className="primary-action"
            href={
              "https://github.com/zaddy6969/NOOR/issues/new?" +
              new URLSearchParams({
                title: (kind === "review" ? "Review submission: " : "Correction: ") + page.slice(0, 100),
                body: draft,
              })
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Review and submit on GitHub ↗
          </a>
          <p>
            GitHub sign-in is required. Nothing is submitted from this form
            automatically. Follow your submitted issue for updates.
          </p>
        </div>
      ) : null}
    </section>
  );
}
