"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { citationsFor, stageReply } from "@/lib/replies";
import {
  messageId,
  readTranscript,
  subscribe,
  timestamp,
  writeTranscript,
  type Transcript,
} from "@/lib/transcript-store";
import type { Citation, Message, Persona, SurveyResponse } from "@/lib/types";
import { MessageThread, ThinkingRow } from "./message-thread";
import { SourceSummary } from "./source-summary";

/**
 * The interview. By this point the respondent has been read and chosen, so the
 * conversation owns the screen and the map is one step back rather than
 * occupying width it cannot use.
 */
export function ConversationPanel({
  conversationId,
  persona,
  response,
  seedMessages,
  seedCitations,
  openings,
}: {
  conversationId: string;
  persona: Persona;
  response: SurveyResponse | undefined;
  seedMessages: Message[];
  seedCitations: Citation[];
  openings: string[];
}) {
  const firstName = persona.name.split(" ")[0];
  const seed: Transcript = { messages: seedMessages, citations: seedCitations };
  const transcript = useSyncExternalStore(
    subscribe,
    () => readTranscript(conversationId, seed),
    () => seed,
  );
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript.messages.length, waiting]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || waiting || !response) return;

    const userMessage: Message = {
      id: messageId(),
      conversationId,
      author: "user",
      content: trimmed,
      createdAt: timestamp(),
    };

    const withQuestion: Transcript = {
      messages: [...transcript.messages, userMessage],
      citations: transcript.citations,
    };
    writeTranscript(conversationId, withQuestion);
    setDraft("");
    setWaiting(true);

    window.setTimeout(() => {
      const reply = stageReply(trimmed, persona, response);
      const replyId = messageId("_r");
      writeTranscript(conversationId, {
        messages: [
          ...withQuestion.messages,
          {
            id: replyId,
            conversationId,
            author: "persona",
            content: reply.content,
            createdAt: timestamp(),
          },
        ],
        citations: [
          ...withQuestion.citations,
          ...citationsFor(replyId, reply),
        ],
      });
      setWaiting(false);
    }, 900);
  };

  return (
    <section
      aria-label={`Interview with ${persona.name}`}
      className="flex h-full w-full min-w-0 flex-col bg-surface"
    >
      <header className="flex h-[4.75rem] shrink-0 items-center border-b border-border bg-card px-6">
        <div className="flex w-full items-center gap-3">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[0.8125rem] font-medium text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
          >
            <span
              aria-hidden
              className="transition-transform duration-150 group-hover:-translate-x-0.5"
            >
              &larr;
            </span>
            All respondents
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.9375rem] font-medium text-ink">
              Interview with {persona.name}
            </p>
          </div>

          <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowSources((open) => !open)}
            aria-expanded={showSources}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors duration-150 ${
              showSources
                ? "border-border-strong bg-surface-sunk text-ink"
                : "border-border bg-card text-ink-muted hover:border-border-strong hover:text-ink"
            }`}
          >
            Sources
            <span className="rounded-full bg-surface-sunk px-1.5 text-[0.75rem] tabular-nums">
              {
                new Set(
                  transcript.citations.map((citation) =>
                    citation.source.kind === "simulated"
                      ? citation.source.note
                      : (citation.quote ?? ""),
                  ),
                ).size
              }
            </span>
            <span
              aria-hidden
              className={`transition-transform duration-200 ${showSources ? "rotate-180" : ""}`}
            >
              &#8964;
            </span>
          </button>

          {showSources ? (
            <div className="absolute top-full right-0 z-30 mt-2 animate-[panel-in_200ms_ease-out]">
              <SourceSummary citations={transcript.citations} />
            </div>
          ) : null}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className={`mx-auto max-w-[42rem] ${transcript.messages.length === 0 && !waiting ? "flex min-h-full flex-col justify-center" : ""}`}>
          {transcript.messages.length === 0 && !waiting ? (
            <div>
              <h3 className="text-base font-medium text-ink">
                Start with what you want to understand
              </h3>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                {firstName} answers from the survey response and the profile
                behind it. Every claim is marked with where it came from, and
                anything past that data is marked as extrapolation.
              </p>

              <p className="label mt-8">Openings from this answer</p>
              <ul className="mt-3 flex flex-col gap-2">
                {openings.map((opening) => (
                  <li key={opening}>
                    <button
                      type="button"
                      onClick={() => ask(opening)}
                      className="group flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3.5 text-left text-[0.9375rem] leading-relaxed text-ink transition-colors duration-150 hover:border-border-strong"
                    >
                      {opening}
                      <span
                        aria-hidden
                        className="shrink-0 text-ink-muted transition-transform duration-150 group-hover:translate-x-0.5"
                      >
                        &rarr;
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <MessageThread
                messages={transcript.messages}
                citations={transcript.citations}
                personaName={persona.name}
                personaId={persona.id}
                choice={response?.choice ?? ""}
              />
              {waiting ? (
                <ol className="mt-7">
                  <ThinkingRow
                    personaName={persona.name}
                    personaId={persona.id}
                    choice={response?.choice ?? ""}
                  />
                </ol>
              ) : null}
            </>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-8 py-5">
        <form
          className="mx-auto max-w-[42rem]"
          onSubmit={(event) => {
            event.preventDefault();
            ask(draft);
          }}
        >
          <div className="flex items-end gap-3 rounded-xl border border-border bg-surface px-4 py-3 focus-within:border-border-strong">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  ask(draft);
                }
              }}
              rows={1}
              placeholder={`Ask ${firstName} about their answer`}
              aria-label={`Ask ${firstName} a question`}
              className="max-h-32 min-h-[1.5rem] flex-1 resize-none bg-transparent text-[0.9375rem] leading-relaxed text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim() || waiting}
              className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#bd5637] disabled:cursor-not-allowed disabled:bg-border-strong"
            >
              Ask
            </button>
          </div>
          <p className="mt-2.5 text-[0.75rem] text-ink-muted">
            {firstName} is a simulated respondent. Claims are marked as grounded
            in their data or as the model reasoning past it.
          </p>
        </form>
      </div>
    </section>
  );
}
