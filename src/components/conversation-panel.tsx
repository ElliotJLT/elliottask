"use client";

import Link from "next/link";
import { MessageThread } from "./message-thread";
import { OptionTag } from "./option-tag";
import { PersonaMark } from "./persona-mark";
import { ProvenanceNote } from "./provenance-note";
import type { Message, Persona, SurveyResponse } from "@/lib/types";

/**
 * The interview, once it has been unlocked. By this point the respondent has
 * been read and chosen, so the record shrinks to a header line and the
 * transcript takes the room.
 */
export function ConversationPanel({
  persona,
  response,
  messages,
  openings,
}: {
  persona: Persona;
  response: SurveyResponse | undefined;
  messages: Message[];
  openings: string[];
}) {
  const firstName = persona.name.split(" ")[0];

  return (
    <section
      aria-label={`Interview with ${persona.name}`}
      className="flex h-full w-full min-w-0 flex-col bg-surface"
    >
      <header className="shrink-0 border-b border-border bg-card px-8 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/respondents/${persona.id}`}
            className="group -ml-2 flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
          >
            <span
              aria-hidden
              className="transition-transform duration-150 group-hover:-translate-x-0.5"
            >
              &larr;
            </span>
            Record
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <PersonaMark
              name={persona.name}
              choice={response?.choice ?? ""}
              personaId={persona.id}
              size="sm"
            />
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
              <h2 className="font-medium text-ink">{persona.name}</h2>
              <p className="truncate text-[0.8125rem] text-ink-muted">
                {persona.role}
              </p>
            </div>
            {response ? <OptionTag option={response.choice} /> : null}
          </div>

          <ProvenanceNote name={firstName} />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-[44rem]">
          {messages.length > 0 ? (
            <MessageThread
              messages={messages}
              personaName={persona.name}
              choice={response?.choice ?? ""}
            />
          ) : (
            <div>
              <h3 className="text-base font-medium text-ink">
                Start with what you want to understand
              </h3>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                {firstName} can speak to the answer given in this survey and the
                profile behind it. Questions past that are answered as
                extrapolation, and labelled.
              </p>

              <p className="label mt-8">Openings from this answer</p>
              <ul className="mt-3 flex flex-col gap-2">
                {openings.map((opening) => (
                  <li
                    key={opening}
                    className="rounded-lg border border-border bg-card px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink"
                  >
                    {opening}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
