"use client";

import Link from "next/link";
import type { OptionShare } from "@/lib/store";
import { optionStyles } from "./option-tag";
import { SocietyStage } from "./society-stage";

/**
 * The framed society. Giving the map a header and an edge stops it reading as
 * loose artwork behind the interface, and gives the colour key somewhere to
 * live once the context column steps aside for a conversation.
 */
export function SocietyPanel({
  results,
  activeOptions,
  focusPersonaId,
  focusName,
  interviewableCount,
  populationCount,
  onSelect,
}: {
  results: OptionShare[];
  activeOptions: string[];
  focusPersonaId: string | null;
  focusName: string | null;
  interviewableCount: number;
  populationCount: number;
  onSelect: (personaId: string) => void;
}) {
  const focused = Boolean(focusPersonaId);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(29,27,23,0.04)]">
      <header className="flex shrink-0 items-start justify-between gap-8 border-b border-border px-6 py-4">
        <div className="flex min-w-0 items-start gap-4">
          {focused ? (
            <Link
              href="/"
              className="group -ml-2 flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink transition-colors duration-150 hover:bg-surface-sunk"
            >
              <span
                aria-hidden
                className="transition-transform duration-150 group-hover:-translate-x-0.5"
              >
                &larr;
              </span>
              All respondents
            </Link>
          ) : null}

          <div className="min-w-0">
            <p className="label">{focused ? "Neighbourhood" : "The society"}</p>
            <p className="mt-1.5 max-w-xl text-[0.8125rem] leading-relaxed text-ink-muted">
              {focused
                ? `${focusName} and the respondents whose views reach theirs. The rest of the society is still here, behind them. Select another lit respondent to switch.`
                : "Each dot is one respondent, tied to the neighbours who shape their view and drawn toward the others who answered as they did. Select a lit one to interview them."}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <ul className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
            {results.map((result) => {
              const off = !activeOptions.includes(result.option);
              return (
                <li
                  key={result.option}
                  className={`flex items-center gap-1.5 transition-opacity duration-150 ${off ? "opacity-35" : ""}`}
                >
                  <span
                    className={`size-2 rounded-full ${optionStyles(result.option).dot}`}
                  />
                  <span className="text-[0.75rem] text-ink-muted">
                    {result.option}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-[0.75rem] text-ink-muted tabular-nums">
            {populationCount} shown · {interviewableCount} to interview
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center p-2">
        <div className="relative aspect-square h-full max-h-full w-full max-w-full">
          <SocietyStage
            activeOptions={activeOptions}
            focusPersonaId={focusPersonaId}
            selectedPersonaId={focusPersonaId}
            onSelect={onSelect}
          />
        </div>
      </div>
    </section>
  );
}
