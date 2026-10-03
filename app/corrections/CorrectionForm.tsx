"use client";
import { useState } from "react";
export default function CorrectionForm({
  initialPage = "",
}: {
  initialPage?: string;
}) {
  const [page, setPage] = useState(initialPage);
  const [statement, setStatement] = useState("");
  const [source, setSource] = useState("");
  const [draft, setDraft] = useState("");
  const body =
    "Page: " +
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
            required
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
                title: "Content correction: " + page.slice(0, 100),
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
