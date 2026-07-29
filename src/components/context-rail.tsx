"use client";

import Link from "next/link";
import { formatDay } from "@/lib/format";
import type { ShellData } from "@/lib/shell-data";
import { OptionDot, optionStyles } from "./option-tag";

/**
 * The context column. It holds the same four things in both modes, so moving
 * into an interview never rearranges the furniture.
 */
export function ContextRail({
  data,
  muted,
  onToggleOption,
  onShowAll,
  activeConversationId,
}: {
  data: ShellData;
  muted: string[];
  onToggleOption: (option: string) => void;
  onShowAll: () => void;
  activeConversationId: string | null;
}) {
  return (
    <nav
      aria-label="Survey context"
      className="flex h-full w-full flex-col bg-card"
    >
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
                onClick={onShowAll}
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
                    onClick={() => onToggleOption(result.option)}
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
                        className={`block h-full rounded-full ${optionStyles(result.option).dot}`}
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

        {data.saved.length > 0 ? (
          <div className="border-t border-border px-7 py-6">
            <p className="label">Saved interviews</p>
            <ul className="-mx-2 mt-3 flex flex-col gap-0.5">
              {data.saved.map((item) => {
                const active = item.conversationId === activeConversationId;
                return (
                  <li key={item.conversationId}>
                    <Link
                      href={`/interviews/${item.conversationId}`}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2.5 transition-colors duration-150 ${
                        active
                          ? "bg-card shadow-[0_1px_3px_rgba(29,27,23,0.08)]"
                          : "hover:bg-surface-sunk"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <OptionDot option={item.choice} />
                        <span className="truncate text-[0.875rem] font-medium text-ink">
                          {item.personaName}
                        </span>
                      </span>
                      <span className="mt-1 flex items-baseline justify-between gap-2 pl-4">
                        <span className="truncate text-[0.8125rem] text-ink-muted">
                          {item.title}
                        </span>
                        <span className="shrink-0 text-[0.75rem] text-ink-muted tabular-nums">
                          {formatDay(item.updatedAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
