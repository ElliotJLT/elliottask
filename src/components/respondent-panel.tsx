import Link from "next/link";
import type { Persona, SurveyResponse } from "@/lib/types";
import { AttributePills } from "./attribute-pills";
import { FindingsSection } from "./findings-section";
import { OptionTag } from "./option-tag";
import { PersonaMark } from "./persona-mark";
import { ProvenanceNote } from "./provenance-note";

/**
 * The respondent record: the middle step between browsing the society and
 * interviewing someone in it. Its job is to give you enough to decide whether
 * this is the person worth spending an interview on, so their own words carry
 * the panel and the interview is the one action on it.
 */
/** The same panel mark the sources column uses, so both edges fold alike. */
const PanelIcon = (
  <svg
    viewBox="0 0 16 16"
    aria-hidden
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
  >
    <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
    <path d="M6 3v10" />
  </svg>
);

export function RespondentPanel({
  persona,
  response,
  conversationId,
  hasTranscript,
  inInterview = false,
  activeConversationId = null,
  collapsed = false,
  onExpand,
  onCollapse,
}: {
  persona: Persona;
  response: SurveyResponse | undefined;
  conversationId: string | undefined;
  hasTranscript: boolean;
  inInterview?: boolean;
  activeConversationId?: string | null;
  collapsed?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}) {
  const firstName = persona.name.split(" ")[0];

  // Collapsed the record is a rail of who you are talking to, mirroring the
  // sources column on the far side of the transcript.
  if (collapsed) {
    return (
      <div
        aria-label="Respondent record, collapsed"
        className="flex h-full w-full flex-col items-center gap-2 bg-card py-4"
      >
        <button
          type="button"
          onClick={onExpand}
          aria-label="Expand respondent record"
          title="Respondent"
          className="flex size-9 items-center justify-center rounded-lg text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
        >
          {PanelIcon}
        </button>
        <span className="my-1 h-px w-6 bg-border" />
        <PersonaMark
          name={persona.name}
          choice={response?.choice ?? ""}
          personaId={persona.id}
          size="sm"
        />
      </div>
    );
  }

  return (
    <section
      aria-label={`Respondent record for ${persona.name}`}
      className="flex h-full w-full flex-col bg-card"
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex h-[4.75rem] shrink-0 items-center gap-3 border-b border-border bg-surface px-5">
          {inInterview ? (
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
          <PersonaMark
            name={persona.name}
            choice={response?.choice ?? ""}
            personaId={persona.id}
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[0.9375rem] leading-tight font-medium text-ink">
              {persona.name}
            </h2>
            <p className="mt-0.5 truncate text-[0.8125rem] leading-snug text-ink-muted">
              {persona.role} · {persona.company}
            </p>
          </div>
          {inInterview ? (
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse respondent record"
              title="Collapse"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors duration-150 hover:bg-surface-sunk hover:text-ink"
            >
              {PanelIcon}
            </button>
          ) : null}
        </div>

        {response ? (
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-baseline gap-2">
              <span className="label">Answered</span>
              <OptionTag option={response.choice} />
            </div>
            {inInterview ? null : (
              <>
                <blockquote className="verbatim mt-5 text-[1.1875rem] leading-[1.6] text-ink">
                  &ldquo;{response.comment}&rdquo;
                </blockquote>
                <p className="mt-4 text-[0.75rem] text-ink-muted">
                  Their own words in the survey, unedited.
                </p>
              </>
            )}
            <div className="mt-3.5">
              <ProvenanceNote name={firstName} />
            </div>
          </div>
        ) : null}

        <div className="border-b border-border px-6 py-6">
          <p className="label">Profile</p>
          <div className="mt-3">
            <AttributePills persona={persona} />
          </div>
        </div>

        <FindingsSection activeConversationId={activeConversationId} />
      </div>

      {/* Once the interview is open the record has no action left to offer, so
          the footer goes rather than standing in the primary slot saying
          nothing. */}
      {inInterview || !conversationId ? null : (
        <div className="shrink-0 border-t border-border bg-card px-6 py-5">
          <Link
            href={`/interviews/${conversationId}`}
            className="group flex items-center justify-between rounded-xl bg-accent px-5 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-[#bd5637]"
          >
            {hasTranscript
              ? `Open interview with ${firstName}`
              : `Interview ${firstName}`}
            <span
              aria-hidden
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </Link>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
            Ask why they answered as they did, what would move them, and where
            their reasoning stops being grounded in data.
          </p>
        </div>
      )}
    </section>
  );
}
