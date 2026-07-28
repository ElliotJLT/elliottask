"use client";

import Link from "next/link";
import { useState } from "react";
import type { Insight, Persona, Survey, SurveyResponse } from "@/lib/types";
import type { OptionShare } from "@/lib/store";
import { optionStyles } from "./option-tag";
import { PersonaCard } from "./persona-card";
import { SocietyGraph } from "./society-graph";

export interface ExploreData {
  survey: Survey;
  results: OptionShare[];
  insights: Insight[];
  respondents: Array<{
    persona: Persona;
    response: SurveyResponse | undefined;
    conversationId: string | undefined;
    hasTranscript: boolean;
  }>;
  savedCount: number;
}

export function ExploreView({ data }: { data: ExploreData }) {
  const [muted, setMuted] = useState<string[]>([]);
  const [selected, setSelected] = useState<{
    personaId: string;
    x: number;
    y: number;
  } | null>(null);

  const activeOptions = data.results
    .map((result) => result.option)
    .filter((option) => !muted.includes(option));

  const toggle = (option: string) =>
    setMuted((current) =>
      current.includes(option)
        ? current.filter((entry) => entry !== option)
        : [...current, option],
    );

  const chosen = selected
    ? data.respondents.find((entry) => entry.persona.id === selected.personaId)
    : undefined;

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[23rem] shrink-0 flex-col border-r border-border bg-surface">
        <div className="shrink-0 px-7 pt-7 pb-6">
          <p className="label">Simulated survey</p>
          <h1 className="mt-2.5 text-[1.0625rem] leading-snug font-medium text-ink">
            {data.survey.question}
          </h1>
          <p className="mt-2.5 text-[0.8125rem] text-ink-muted">
            {data.survey.audience} ·{" "}
            {data.survey.respondentCount.toLocaleString("en-GB")} respondents
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-t border-border px-7 py-6">
          <div className="flex items-baseline justify-between">
            <p className="label">Result</p>
            {muted.length > 0 ? (
              <button
                type="button"
                onClick={() => setMuted([])}
                className="text-[0.75rem] font-medium text-accent"
              >
                Show all
              </button>
            ) : (
              <p className="text-[0.75rem] text-ink-muted">Tap to filter</p>
            )}
          </div>

          <ul className="mt-4 flex flex-col gap-1">
            {data.results.map((result) => {
              const off = muted.includes(result.option);
              return (
                <li key={result.option}>
                  <button
                    type="button"
                    onClick={() => toggle(result.option)}
                    aria-pressed={!off}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-sunk ${
                      off ? "opacity-40" : ""
                    }`}
                  >
                    <span
                      className={`size-2.5 shrink-0 rounded-full ${optionStyles(result.option).dot}`}
                    />
                    <span className="w-16 shrink-0 text-[0.875rem] text-ink">
                      {result.option}
                    </span>
                    <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border">
                      <span
                        className={`block h-full rounded-full transition-[width] duration-300 ${optionStyles(result.option).dot}`}
                        style={{ width: `${Math.round(result.share * 100)}%` }}
                      />
                    </span>
                    <span className="w-9 shrink-0 text-right text-[0.875rem] font-medium text-ink tabular-nums">
                      {Math.round(result.share * 100)}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-border px-7 py-6">
          <p className="label">What the result says</p>
          <ul className="mt-4 flex flex-col gap-6">
            {data.insights.map((insight) => (
              <li key={insight.id}>
                {insight.stat ? (
                  <p className="text-[1.75rem] leading-none font-medium text-ink tabular-nums">
                    {insight.stat}
                  </p>
                ) : null}
                <h3
                  className={`text-[0.9375rem] leading-snug font-medium text-ink ${insight.stat ? "mt-2" : ""}`}
                >
                  {insight.headline}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                  {insight.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
        </div>

        {data.savedCount > 0 ? (
          <div className="shrink-0 border-t border-border bg-surface px-7 py-4">
            <Link
              href={`/interviews/${data.respondents.find((entry) => entry.hasTranscript)?.conversationId ?? ""}`}
              className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-sunk"
            >
              <span className="flex items-center gap-2">
                Saved interviews
                <span className="rounded-full bg-border px-2 py-0.5 text-[0.75rem] font-medium text-ink-muted tabular-nums">
                  {data.savedCount}
                </span>
              </span>
              <span
                aria-hidden
                className="text-ink-muted transition-transform duration-150 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </Link>
          </div>
        ) : null}
      </aside>

      <div className="relative flex min-w-0 flex-1 items-center justify-center bg-card">
        <div className="pointer-events-none absolute top-7 left-8 z-10 max-w-sm">
          <p className="label">The society</p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
            A sample of the society. Each dot is one respondent, tied to the
            neighbours who shape their view and drawn toward the others who
            answered as they did. The lit ones have a profile loaded to
            interview.
          </p>
        </div>

        <div className="relative aspect-square h-full max-h-full w-full max-w-full">
          <SocietyGraph
            activeOptions={activeOptions}
            selectedPersonaId={selected?.personaId ?? null}
            onSelect={(personaId, point) =>
              setSelected({ personaId, x: point.x, y: point.y })
            }
          />

          {chosen && selected ? (
            <div
              className="absolute z-20"
              style={{
                left: `${selected.x * 100}%`,
                top: `${selected.y * 100}%`,
                transform: `translate(${selected.x > 0.5 ? "calc(-100% - 1.25rem)" : "1.25rem"}, ${
                  selected.y > 0.5 ? "calc(-100% - 0.5rem)" : "-0.5rem"
                })`,
              }}
            >
              <PersonaCard
                persona={chosen.persona}
                response={chosen.response}
                conversationId={chosen.conversationId}
                hasTranscript={chosen.hasTranscript}
                onDismiss={() => setSelected(null)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
