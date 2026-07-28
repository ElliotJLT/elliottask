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
      className="flex w-72 shrink-0 flex-col border-r border-border bg-surface-sunk"
    >
      <div className="border-b border-border px-5 py-5">
        <p className="label">Simulated survey</p>
        <p className="mt-2 text-[0.9375rem] leading-snug font-medium text-ink">
          {surveyQuestion}
        </p>
        <p className="mt-2 text-[0.8125rem] text-ink-muted">
          {respondentCount.toLocaleString("en-GB")} respondents
        </p>
      </div>

      <div className="px-5 pt-5 pb-3">
        <Link
          href="/"
          className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150 ${
            pathname === "/"
              ? "border-accent bg-accent text-white"
              : "border-border-strong bg-card text-ink hover:border-accent hover:text-accent"
          }`}
        >
          New interview
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5">
        <p className="label pt-2 pb-2">Saved interviews</p>

        {items.length === 0 ? (
          <p className="text-[0.8125rem] leading-relaxed text-ink-muted">
            Interviews you start are saved here, with the full transcript and
            every source cited in it.
          </p>
        ) : (
          <ul className="-mx-2 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
            {items.map((item) => {
              const href = `/interviews/${item.id}`;
              const active = pathname === href;
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-2 py-2 transition-colors duration-150 ${
                      active ? "bg-card shadow-[0_1px_2px_rgba(29,27,23,0.06)]" : "hover:bg-card/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <OptionDot option={item.choice} />
                      <span className="truncate text-sm font-medium text-ink">
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
