"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageThread } from "./message-thread";
import { OptionTag } from "./option-tag";
import { PersonaMark } from "./persona-mark";
import type { Message, Persona, SurveyResponse } from "@/lib/types";

/**
 * The conversation, sharing the screen with the society rather than replacing
 * it. The respondent record sits at the top and folds away, so a long
 * transcript can take the height once you know who you are talking to.
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
  const [showRecord, setShowRecord] = useState(messages.length === 0);

  const attributes: Array<[string, string]> = [
    ["Location", persona.location],
    ["Industry", persona.industry],
    ["Seniority", persona.seniority],
    ["Generation", persona.generation],
    ["Gender", persona.gender],
  ];

  return (
    <section
      aria-label={`Interview with ${persona.name}`}
      className="flex w-[31rem] shrink-0 flex-col border-l border-border bg-surface"
    >
      <header className="shrink-0 border-b border-border bg-card px-6 py-5">
        <div className="flex items-start gap-3">
          <PersonaMark name={persona.name} choice={response?.choice ?? ""} />
          <div className="min-w-0 flex-1">
            <h2 className="leading-tight font-medium text-ink">
              {persona.name}
            </h2>
            <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-muted">
              {persona.role}, {persona.company}
            </p>
          </div>
          <Link
            href="/"
            aria-label="Close interview"
            className="-mt-1 -mr-2 rounded-md px-2 py-1 text-lg leading-none text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
          >
            &times;
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {response ? (
            <div className="flex items-baseline gap-2">
              <OptionTag option={response.choice} />
              <span className="text-[0.8125rem] text-ink-muted">
                in this survey
              </span>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => setShowRecord((open) => !open)}
            aria-expanded={showRecord}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] font-medium text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
          >
            {showRecord ? "Hide record" : "Show record"}
            <span
              aria-hidden
              className={`transition-transform duration-200 ${showRecord ? "rotate-180" : ""}`}
            >
              &#8964;
            </span>
          </button>
        </div>
      </header>

      {showRecord ? (
        <div className="max-h-[46%] shrink-0 overflow-y-auto border-b border-border bg-surface-sunk px-6 py-5">
          {response ? (
            <>
              <p className="label">Their words in the survey</p>
              <p className="verbatim mt-2 text-[0.9375rem] leading-relaxed text-ink">
                &ldquo;{response.comment}&rdquo;
              </p>
            </>
          ) : null}

          <p className="label mt-6">Profile</p>
          <dl className="mt-3 flex flex-col gap-2">
            {attributes.map(([term, value]) => (
              <div key={term} className="flex items-baseline gap-3">
                <dt className="w-24 shrink-0 text-[0.8125rem] text-ink-muted">
                  {term}
                </dt>
                <dd className="min-w-0 flex-1 text-[0.8125rem] text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="label mt-6">How this respondent was built</p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
            A psychographic profile triangulated from anonymised public
            observations, then placed among the respondents lit on the map, who
            are the ones whose views shape theirs. Answers come from reasoning
            over that profile. Anything past it is extrapolation, and the
            transcript says so.
          </p>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {messages.length > 0 ? (
          <MessageThread
            messages={messages}
            personaName={persona.name}
            choice={response?.choice ?? ""}
          />
        ) : (
          <div>
            <h3 className="text-[0.9375rem] font-medium text-ink">
              Start with what you want to understand
            </h3>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
              {persona.name.split(" ")[0]} can speak to the answer given in this
              survey and the profile behind it. Questions past that are answered
              as extrapolation, and labelled.
            </p>

            <p className="label mt-6">Openings from this answer</p>
            <ul className="mt-3 flex flex-col gap-2">
              {openings.map((opening) => (
                <li
                  key={opening}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-[0.875rem] leading-relaxed text-ink"
                >
                  {opening}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
