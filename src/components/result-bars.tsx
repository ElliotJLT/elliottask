import type { OptionShare } from "@/lib/store";
import { optionStyles } from "./option-tag";

/**
 * The survey distribution, carried into the interview surface so a client can
 * see where a respondent sits relative to the population they came from.
 */
export function ResultBars({ results }: { results: OptionShare[] }) {
  return (
    <dl className="flex flex-col gap-2">
      {results.map((result) => (
        <div key={result.option} className="flex items-center gap-3">
          <dt className="w-16 shrink-0 text-[0.8125rem] text-ink-muted">
            {result.option}
          </dt>
          <dd className="flex min-w-0 flex-1 items-center gap-3">
            <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border">
              <span
                className={`block h-full rounded-full ${optionStyles(result.option).dot}`}
                style={{ width: `${Math.round(result.share * 100)}%` }}
              />
            </span>
            <span className="w-9 shrink-0 text-right text-[0.8125rem] text-ink tabular-nums">
              {Math.round(result.share * 100)}%
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
