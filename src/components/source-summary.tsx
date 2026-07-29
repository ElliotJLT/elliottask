"use client";

import type { Citation } from "@/lib/types";

interface Entry {
  id: string;
  text: string;
  /** How many claims in this interview leaned on this source. */
  uses: number;
}

interface Group {
  key: string;
  title: string;
  grounded: boolean;
  entries: Entry[];
}

/**
 * A mark per kind of source. Quote marks for what the respondent said, a
 * figure for what their profile holds, and an open question for what the
 * survey never asked, so the three are separable before any label is read.
 */
const ICONS: Record<string, React.ReactNode> = {
  survey: <path d="M6 4.5C4.3 5.6 3.5 7.1 3.5 9v2.5h3.2V8.2H5.2c0-1.2.4-2.1 1.3-2.8Zm6 0c-1.7 1.1-2.5 2.6-2.5 4.5v2.5h3.2V8.2h-1.5c0-1.2.4-2.1 1.3-2.8Z" />,
  profile: (
    <>
      <circle cx="8" cy="5.6" r="2.5" />
      <path d="M3.4 13.2c0-2.4 2-3.9 4.6-3.9s4.6 1.5 4.6 3.9" />
    </>
  ),
  simulated: (
    <>
      <circle cx="8" cy="8" r="5.8" strokeDasharray="2.4 2" />
      <path d="M6.3 6.4a1.8 1.8 0 0 1 3.4.7c0 1.2-1.7 1.4-1.7 2.4M8 11.6v.1" />
    </>
  ),
};

function SourceIcon({ kind, grounded }: { kind: string; grounded: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`size-4 shrink-0 ${grounded ? "text-grounded" : "text-simulated"}`}
      fill={kind === "survey" ? "currentColor" : "none"}
      stroke={kind === "survey" ? "none" : "currentColor"}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[kind]}
    </svg>
  );
}

/**
 * One row per source, not per claim. Two claims resting on the same survey
 * quote is one source used twice, and listing it twice would read as a fault
 * in the very panel meant to establish that the evidence is handled carefully.
 */
function group(citations: Citation[]): Group[] {
  const groups: Group[] = [
    { key: "survey", title: "Their survey answer", grounded: true, entries: [] },
    { key: "profile", title: "Their profile", grounded: true, entries: [] },
    { key: "simulated", title: "Not in the data", grounded: false, entries: [] },
  ];

  for (const citation of citations) {
    const target =
      citation.source.kind === "survey_response"
        ? groups[0]
        : citation.source.kind === "profile_attribute"
          ? groups[1]
          : groups[2];

    const text =
      citation.source.kind === "simulated"
        ? citation.source.note
        : (citation.quote ?? "");

    const existing = target.entries.find((entry) => entry.text === text);
    if (existing) existing.uses += 1;
    else target.entries.push({ id: citation.id, text, uses: 1 });
  }

  return groups.filter((entry) => entry.entries.length > 0);
}

/**
 * Everything the interview has rested on so far, gathered in one place. The
 * per-claim markers answer "is this sentence grounded"; this answers the
 * question a client actually takes into a decision, which is how much of the
 * whole conversation was evidence and how much was the model reasoning.
 */
export function SourceSummary({
  citations,
  onClose,
}: {
  citations: Citation[];
  onClose: () => void;
}) {
  const groups = group(citations);
  const grounded = citations.filter(
    (citation) => citation.source.kind !== "simulated",
  ).length;
  const simulated = citations.length - grounded;

  return (
    <div
      aria-label="Sources used in this interview"
      className="flex h-full w-full flex-col bg-card"
    >
      <div className="shrink-0 border-b border-border px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <p className="label">Sources in this interview</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sources"
            className="-mt-1 -mr-1 rounded-md px-1.5 py-0.5 text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
          >
            &times;
          </button>
        </div>
        {citations.length === 0 ? (
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
            Nothing cited yet. Every claim in a reply will appear here with what
            it was drawn from.
          </p>
        ) : (
          <div className="mt-3 flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-grounded-soft px-2.5 py-1 text-[0.8125rem] font-medium text-grounded">
              <span className="size-1.5 rounded-full bg-grounded" />
              {grounded} grounded
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-simulated bg-simulated-soft px-2.5 py-1 text-[0.8125rem] font-medium text-simulated">
              {simulated} extrapolated
            </span>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-sunk px-5 py-4">
        <ul className="flex flex-col gap-6">
          {groups.map((entry) => (
            <li key={entry.key}>
              <p
                className={`flex items-center gap-2 text-[0.75rem] font-medium ${entry.grounded ? "text-grounded" : "text-simulated"}`}
              >
                <SourceIcon kind={entry.key} grounded={entry.grounded} />
                {entry.title} · {entry.entries.length}
              </p>
              <ul className="mt-2.5 flex flex-col gap-2.5">
                {entry.entries.map((source) => (
                  <li
                    key={source.id}
                    className={`rounded-lg border bg-card px-3.5 py-3 text-[0.8125rem] leading-relaxed ${
                      entry.grounded
                        ? "border-border"
                        : "border-dashed border-border-strong"
                    }`}
                  >
                    {entry.grounded ? (
                      <span className="verbatim text-ink">
                        &ldquo;{source.text}&rdquo;
                      </span>
                    ) : (
                      <span className="text-ink-muted">{source.text}</span>
                    )}
                    {source.uses > 1 ? (
                      <span className="mt-1.5 block text-[0.75rem] text-ink-muted">
                        Cited {source.uses} times
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
