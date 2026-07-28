"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDay } from "@/lib/format";
import { OptionDot } from "./option-tag";

export interface RailItem {
  id: string;
  title: string;
  personaName: string;
  choice: string;
  updatedAt: string;
}

export function HistoryRail({
  surveyQuestion,
  respondentCount,
  items,
}: {
  surveyQuestion: string;
  respondentCount: number;
  items: RailItem[];
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Interviews"
      className="flex w-[19rem] shrink-0 flex-col border-r border-border bg-surface"
    >
      <div className="px-6 pt-6 pb-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink-muted transition-colors duration-150 hover:text-accent"
        >
          <span
            aria-hidden
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
          >
            &larr;
          </span>
          Back to the society
        </Link>

        <p className="mt-5 text-[0.9375rem] leading-snug font-medium text-ink">
          {surveyQuestion}
        </p>
        <p className="mt-2 text-[0.8125rem] text-ink-muted">
          {respondentCount.toLocaleString("en-GB")} respondents
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-border px-6 pt-5 pb-6">
        <p className="label">Saved interviews</p>

        {items.length === 0 ? (
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
            Interviews you start are saved here with the full transcript and
            every source cited in it.
          </p>
        ) : (
          <ul className="-mx-2 mt-3 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
            {items.map((item) => {
              const href = `/interviews/${item.id}`;
              const active = pathname === href;
              return (
                <li key={item.id}>
                  <Link
                    href={href}
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
        )}
      </div>
    </nav>
  );
}
