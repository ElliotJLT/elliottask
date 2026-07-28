"use client";

import Link from "next/link";
import type { Persona, SurveyResponse } from "@/lib/types";
import { OptionTag } from "./option-tag";
import { PersonaMark } from "./persona-mark";

/**
 * The respondent card that opens from the society. It leads with what the
 * respondent said rather than with the names of the fields holding it.
 */
export function PersonaCard({
  persona,
  response,
  conversationId,
  hasTranscript,
  onDismiss,
}: {
  persona: Persona;
  response: SurveyResponse | undefined;
  conversationId: string | undefined;
  hasTranscript: boolean;
  onDismiss: () => void;
}) {
  return (
    <div className="w-[23rem] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_50px_-12px_rgba(29,27,23,0.28)]">
      <div className="flex items-start gap-3 px-6 pt-6">
        <PersonaMark name={persona.name} choice={response?.choice ?? ""} />
        <div className="min-w-0 flex-1">
          <h2 className="leading-tight font-medium text-ink">{persona.name}</h2>
          <p className="mt-1 text-[0.8125rem] leading-snug text-ink-muted">
            {persona.role}
          </p>
          <p className="text-[0.8125rem] leading-snug text-ink-muted">
            {persona.company}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close respondent"
          className="-mt-1 -mr-2 rounded-md px-2 py-1 text-lg leading-none text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
        >
          &times;
        </button>
      </div>

      {response ? (
        <div className="mt-5 px-6">
          <div className="flex items-baseline gap-2">
            <OptionTag option={response.choice} />
            <span className="text-[0.8125rem] text-ink-muted">
              was this respondent&rsquo;s answer
            </span>
          </div>
          <p className="verbatim mt-3 text-[0.9375rem] leading-relaxed text-ink">
            &ldquo;{response.comment}&rdquo;
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-x-2 gap-y-1 px-6 text-[0.8125rem] text-ink-muted">
        <span>{persona.location}</span>
        <span aria-hidden>·</span>
        <span>{persona.generation}</span>
        <span aria-hidden>·</span>
        <span>{persona.industry}</span>
      </div>

      <div className="mt-5 border-t border-border bg-surface-sunk px-6 py-4">
        {conversationId ? (
          <Link
            href={`/interviews/${conversationId}`}
            className="group flex items-center justify-between rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#bd5637]"
          >
            {hasTranscript
              ? `Open interview with ${persona.name.split(" ")[0]}`
              : `Interview ${persona.name.split(" ")[0]}`}
            <span
              aria-hidden
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </Link>
        ) : null}
        <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-muted">
          Answers are grounded in this profile and the survey response, and
          marked where the model extrapolates past them.
        </p>
      </div>
    </div>
  );
}
