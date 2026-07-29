"use client";

import Link from "next/link";
import { SocietyStage } from "./society-stage";

/**
 * The framed society. Giving the map a header and an edge stops it reading as
 * loose artwork behind the interface, and gives the colour key somewhere to
 * live once the context column steps aside for a conversation.
 */
export function SocietyPanel({
  activeOptions,
  industries,
  activeIndustries,
  onToggleIndustry,
  shownCount,
  focusPersonaId,
  focusName,
  populationCount,
  compact,
  onSelect,
}: {
  activeOptions: string[];
  industries: readonly string[];
  activeIndustries: string[];
  onToggleIndustry: (industry: string) => void;
  shownCount: number;
  focusPersonaId: string | null;
  focusName: string | null;
  populationCount: number;
  compact: boolean;
  onSelect: (personaId: string) => void;
}) {
  const focused = Boolean(focusPersonaId);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex shrink-0 items-start justify-between gap-8 border-b border-border px-6 py-4">
        <div
          className={`flex min-w-0 gap-4 ${compact ? "flex-col items-start" : "items-start"}`}
        >
          {focused ? (
            <Link
              href="/"
              aria-label="Back to all respondents"
              title="All respondents"
              className="group flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-ink-muted transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              <span
                aria-hidden
                className="text-[0.9375rem] leading-none transition-transform duration-150 group-hover:-translate-x-0.5"
              >
                &larr;
              </span>
            </Link>
          ) : null}

          <div className="min-w-0">
            <p className="label">{focused ? "Neighbourhood" : "The society"}</p>
            <p
              className={`mt-1.5 max-w-xl text-[0.8125rem] leading-relaxed text-ink-muted ${compact ? "hidden" : ""}`}
            >
              {focused
                ? `${focusName} and the respondents whose views reach theirs. The rest of the society is behind them.`
                : `${shownCount} of ${populationCount} respondents in view. Each dot is one person, drawn toward the others who answered as they did. Select a lit one to interview.`}
            </p>
          </div>
        </div>

        <div className={`flex shrink-0 items-center gap-1.5 ${focused ? "hidden" : ""}`}>
          <span className="label mr-1">Audience</span>
          {industries.map((industry) => {
            const on = activeIndustries.includes(industry);
            return (
              <button
                key={industry}
                type="button"
                onClick={() => onToggleIndustry(industry)}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors duration-150 ${
                  on
                    ? "border-ink bg-ink text-white"
                    : "border-border bg-card text-ink-muted hover:border-border-strong hover:text-ink"
                }`}
              >
                {industry}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center p-2">
        <div
          className={`relative h-full w-full ${compact ? "" : "aspect-square max-h-full max-w-full"}`}
        >
          <SocietyStage
            activeOptions={activeOptions}
            activeIndustries={activeIndustries}
            focusPersonaId={focusPersonaId}
            selectedPersonaId={focusPersonaId}
            onSelect={onSelect}
            fill={compact}
          />
        </div>
      </div>
    </section>
  );
}
