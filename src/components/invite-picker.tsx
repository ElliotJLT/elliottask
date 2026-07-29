"use client";

import { useEffect, useRef, useState } from "react";
import { getResults, listPersonas } from "@/lib/store";
import type { Persona } from "@/lib/types";
import { PersonaMark } from "./persona-mark";
import { optionStyles } from "./option-tag";

/**
 * Bring another respondent into the interview. This is the seam the current
 * build can't yet cross, and it's the one closest to the point of the product:
 * a client's question is rarely about one person, it's about how a group of
 * grounded respondents answer it. Adding a respondent or a whole survey segment
 * turns a one-to-one into a group interview whose spread is still traceable to
 * the data. The action isn't wired up yet, and says so rather than pretending.
 */
export function InvitePicker({ current }: { current: Persona }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const others = listPersonas().filter((persona) => persona.id !== current.id);
  const segments = getResults();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-150 ${
          open
            ? "border-border-strong bg-surface-sunk text-ink"
            : "border-border bg-card text-ink-muted hover:border-border-strong hover:text-ink"
        }`}
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6" cy="6" r="2.4" />
          <path d="M2.4 13c0-2 1.6-3.2 3.6-3.2 1 0 1.9.3 2.5.8M11 4.5v4M13 6.5h-4" />
        </svg>
        Invite to interview
      </button>

      {open ? (
        <div className="absolute bottom-full left-0 z-40 mb-2 w-[21rem] animate-[fade-in_120ms_ease-out] overflow-hidden rounded-xl border border-border bg-card shadow-[0_16px_40px_-12px_rgba(29,27,23,0.28)]">
          <div className="border-b border-border bg-surface-sunk px-3.5 py-2.5">
            <p className="text-[0.8125rem] font-medium text-ink">
              Ask the same question to a group
            </p>
            <p className="mt-0.5 text-[0.75rem] text-ink-muted">
              Add a respondent or a survey segment and read the spread. Group
              interviews aren&apos;t wired up in this prototype yet.
            </p>
          </div>

          <div className="max-h-[15rem] overflow-y-auto py-1.5">
            <p className="label px-3.5 pt-1.5 pb-1">Add a respondent</p>
            {others.map((persona) => (
              <button
                key={persona.id}
                type="button"
                disabled
                className="flex w-full items-center gap-2.5 px-3.5 py-1.5 text-left opacity-60"
              >
                <PersonaMark
                  name={persona.name}
                  choice=""
                  personaId={persona.id}
                  size="sm"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[0.8125rem] text-ink">
                    {persona.name}
                  </span>
                  <span className="block truncate text-[0.75rem] text-ink-muted">
                    {persona.role}
                  </span>
                </span>
              </button>
            ))}

            <p className="label px-3.5 pt-2.5 pb-1">Add a segment</p>
            {segments.map((segment) => (
              <button
                key={segment.option}
                type="button"
                disabled
                className="flex w-full items-center gap-2.5 px-3.5 py-1.5 text-left opacity-60"
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${optionStyles(segment.option).dot}`}
                />
                <span className="text-[0.8125rem] text-ink">
                  Everyone who chose {segment.option}
                </span>
                <span className="text-[0.75rem] text-ink-muted tabular-nums">
                  {Math.round(segment.share * 100)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
