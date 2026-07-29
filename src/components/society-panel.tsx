"use client";

import Link from "next/link";
import { AppliedFilters, FilterBar, type Filters } from "./filter-bar";
import { SocietyStage } from "./society-stage";

/**
 * The framed society. Giving the map a header and an edge stops it reading as
 * loose artwork behind the interface, and gives the colour key somewhere to
 * live once the context column steps aside for a conversation.
 */
export function SocietyPanel({
  activeOptions,
  filters,
  onFiltersChange,
  shownCount,
  focusPersonaId,
  focusName,
  populationCount,
  compact,
  onSelect,
}: {
  activeOptions: string[];
  filters: Filters;
  onFiltersChange: (next: Filters) => void;
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
      <header className="flex h-[4.75rem] shrink-0 items-center justify-between gap-8 border-b border-border px-6">
        <div
          className="flex min-w-0 items-center gap-3"
        >
          {focused ? (
            <Link
              href="/"
              aria-label="Back to all respondents"
              title="All respondents"
              className="group flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-ink-muted transition-colors duration-150 hover:border-border-strong hover:bg-surface-sunk hover:text-ink"
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden
                className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.5 3.5 5 8l4.5 4.5" />
              </svg>
            </Link>
          ) : null}

          <p className="min-w-0 truncate">
            <span className="text-[0.9375rem] font-medium text-ink">
              {focused ? "Neighbourhood" : "The society"}
            </span>
            <span className="ml-2 text-[0.8125rem] text-ink-muted">
              {focused
                ? `${focusName} and the respondents whose views reach theirs`
                : `${shownCount} of ${populationCount} in view · select a lit respondent to interview`}
            </span>
          </p>
        </div>

        <div className={`shrink-0 ${focused ? "hidden" : ""}`}>
          <FilterBar
            filters={filters}
            activeOptions={activeOptions}
            onChange={onFiltersChange}
          />
        </div>
      </header>

      {focused ? null : (
        <AppliedFilters filters={filters} onChange={onFiltersChange} />
      )}

      <div className="flex min-h-0 flex-1 items-center justify-center p-2">
        <div
          className={`relative h-full w-full ${compact ? "" : "aspect-square max-h-full max-w-full"}`}
        >
          <SocietyStage
            activeOptions={activeOptions}
            filters={filters}
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
