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
export function SourceSummary({ citations }: { citations: Citation[] }) {
  const groups = group(citations);
  const grounded = citations.filter(
    (citation) => citation.source.kind !== "simulated",
  ).length;
  const simulated = citations.length - grounded;

  return (
    <div
      aria-label="Sources used in this interview"
      className="flex max-h-[26rem] w-[24rem] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_16px_40px_-12px_rgba(29,27,23,0.26)]"
    >
      <div className="shrink-0 border-b border-border px-5 py-4">
        <p className="label">Sources in this interview</p>
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
                className={`text-[0.75rem] font-medium ${entry.grounded ? "text-grounded" : "text-simulated"}`}
              >
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
