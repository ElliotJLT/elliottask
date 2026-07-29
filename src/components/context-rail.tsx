"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { formatDay, formatTime, stripMarkers } from "@/lib/format";
import type { ShellConversation, ShellData } from "@/lib/shell-data";
import {
  clearTranscript,
  readTranscript,
  subscribe,
  type Transcript,
} from "@/lib/transcript-store";
import { optionStyles } from "./option-tag";
import { PersonaMark } from "./persona-mark";

interface RecentItem {
  conversationId: string;
  personaId: string;
  personaName: string;
  choice: string;
  status: ShellConversation["status"];
  preview: string;
  fromPersona: boolean;
  at: string;
}

const EMPTY: Transcript = { messages: [], citations: [] };

/**
 * The recent interviews, built on the client from whatever the transcripts hold
 * now. A conversation started this session sits beside the seeded ones, and a
 * refresh mid-interview leaves it exactly where it was, which is the whole point
 * of persisting it.
 */
function select(
  conversations: ShellConversation[],
  seeds: ShellData["transcripts"],
  live: boolean,
): RecentItem[] {
  const items: RecentItem[] = [];

  for (const conversation of conversations) {
    const seed = seeds[conversation.conversationId] ?? EMPTY;
    const transcript = live
      ? readTranscript(conversation.conversationId, seed)
      : seed;
    const last = transcript.messages.at(-1);
    if (!last) continue;

    items.push({
      conversationId: conversation.conversationId,
      personaId: conversation.personaId,
      personaName: conversation.personaName,
      choice: conversation.choice,
      status: conversation.status,
      preview: stripMarkers(last.content),
      fromPersona: last.author === "persona",
      at: last.createdAt,
    });
  }

  return items.sort((a, b) => b.at.localeCompare(a.at));
}

// useSyncExternalStore wants a stable reference while the data is unchanged, so
// each snapshot is memoised against a signature of the threads it summarises.
let liveCache: { sig: string; value: RecentItem[] } | null = null;
let serverCache: { sig: string; value: RecentItem[] } | null = null;

function signature(items: RecentItem[]): string {
  return items.map((item) => `${item.conversationId}:${item.at}`).join("|");
}

function cached(
  slot: { sig: string; value: RecentItem[] } | null,
  next: RecentItem[],
): { hit: RecentItem[]; store: { sig: string; value: RecentItem[] } } {
  const sig = signature(next);
  if (slot && slot.sig === sig) return { hit: slot.value, store: slot };
  const store = { sig, value: next };
  return { hit: next, store };
}

function StatusBadge({ status }: { status: ShellConversation["status"] }) {
  const done = status === "completed";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ${
        done
          ? "bg-grounded-soft text-grounded"
          : "bg-accent-soft text-[#a84e30]"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${done ? "bg-grounded" : "bg-accent"}`}
      />
      {done ? "Completed" : "In progress"}
    </span>
  );
}

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
  const router = useRouter();

  const recent = useSyncExternalStore(
    subscribe,
    () => {
      const { hit, store } = cached(
        liveCache,
        select(data.conversations, data.transcripts, true),
      );
      liveCache = store;
      return hit;
    },
    () => {
      const { hit, store } = cached(
        serverCache,
        select(data.conversations, data.transcripts, false),
      );
      serverCache = store;
      return hit;
    },
  );

  const startNew = (conversationId: string) => {
    clearTranscript(conversationId);
    router.push(`/interviews/${conversationId}`);
  };

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
            ) : null}
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

        {recent.length > 0 ? (
          <div className="border-t border-border px-7 py-6">
            <p className="label">Recent interviews</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {recent.map((item) => {
                const active = item.conversationId === activeConversationId;
                return (
                  <li key={item.conversationId}>
                    <div
                      className={`group rounded-xl border px-3 py-3 transition-colors duration-150 ${
                        active
                          ? "border-border-strong bg-surface-sunk"
                          : "border-border hover:border-border-strong"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/interviews/${item.conversationId}`)
                        }
                        aria-current={active ? "page" : undefined}
                        className="flex w-full gap-3 text-left"
                      >
                        <PersonaMark
                          name={item.personaName}
                          choice={item.choice}
                          personaId={item.personaId}
                          size="sm"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="min-w-0 flex-1 truncate text-[0.875rem] font-medium text-ink">
                              {item.personaName}
                            </span>
                            <StatusBadge status={item.status} />
                          </span>
                          <span className="mt-1 line-clamp-2 block text-[0.8125rem] leading-snug text-ink-muted">
                            {item.fromPersona ? "" : "You: "}
                            {item.preview}
                          </span>
                          <span className="mt-1 block text-[0.6875rem] text-ink-muted tabular-nums">
                            {formatDay(item.at)} · {formatTime(item.at)}
                          </span>
                        </span>
                      </button>

                      <div className="mt-2.5 flex items-center gap-2 pl-11">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/interviews/${item.conversationId}`)
                          }
                          className="rounded-md bg-accent px-2.5 py-1 text-[0.75rem] font-medium text-white transition-colors duration-150 hover:bg-[#bd5637]"
                        >
                          Resume
                        </button>
                        <button
                          type="button"
                          onClick={() => startNew(item.conversationId)}
                          title="Clear this thread and start over with the same respondent"
                          className="rounded-md border border-border px-2.5 py-1 text-[0.75rem] font-medium text-ink-muted transition-colors duration-150 hover:border-border-strong hover:text-ink"
                        >
                          Start new
                        </button>
                      </div>
                    </div>
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
