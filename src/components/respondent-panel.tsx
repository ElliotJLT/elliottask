import Link from "next/link";
import type { Persona, SurveyResponse } from "@/lib/types";
import { AttributePills } from "./attribute-pills";
import { OptionTag } from "./option-tag";
import { PersonaMark } from "./persona-mark";
import { ProvenanceNote } from "./provenance-note";

/**
 * The respondent record: the middle step between browsing the society and
 * interviewing someone in it. Its job is to give you enough to decide whether
 * this is the person worth spending an interview on, so their own words carry
 * the panel and the interview is the one action on it.
 */
export function RespondentPanel({
  persona,
  response,
  conversationId,
  hasTranscript,
}: {
  persona: Persona;
  response: SurveyResponse | undefined;
  conversationId: string | undefined;
  hasTranscript: boolean;
}) {
  const firstName = persona.name.split(" ")[0];

  return (
    <section
      aria-label={`Respondent record for ${persona.name}`}
      className="flex h-full w-full flex-col border-l border-border bg-surface"
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card px-7 pt-7 pb-6">
          <div className="flex items-start gap-4">
            <PersonaMark
              name={persona.name}
              choice={response?.choice ?? ""}
              personaId={persona.id}
              size="lg"
            />
            <div className="min-w-0 flex-1 pt-1">
              <h2 className="text-[1.125rem] leading-tight font-medium text-ink">
                {persona.name}
              </h2>
              <p className="mt-1 text-[0.875rem] leading-snug text-ink-muted">
                {persona.role}
              </p>
              <p className="text-[0.875rem] leading-snug text-ink-muted">
                {persona.company}
              </p>
            </div>
          </div>
        </div>

        {response ? (
          <div className="border-b border-border px-7 py-7">
            <div className="flex items-baseline gap-2">
              <span className="label">Answered</span>
              <OptionTag option={response.choice} />
            </div>
            <blockquote className="verbatim mt-5 text-[1.25rem] leading-[1.6] text-ink">
              &ldquo;{response.comment}&rdquo;
            </blockquote>
            <p className="mt-5 text-[0.75rem] text-ink-muted">
              Their own words in the survey, unedited.
            </p>
          </div>
        ) : null}

        <div className="px-7 py-6">
          <p className="label">Profile</p>
          <div className="mt-3">
            <AttributePills persona={persona} />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-7 py-5">
        <div className="flex justify-end">
          <ProvenanceNote name={firstName} />
        </div>

        {conversationId ? (
          <Link
            href={`/interviews/${conversationId}`}
            className="group mt-4 flex items-center justify-between rounded-xl bg-accent px-5 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-[#bd5637]"
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
        ) : null}
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
          Ask why they answered as they did, what would move them, and where
          their reasoning stops being grounded in data.
        </p>
      </div>
    </section>
  );
}
