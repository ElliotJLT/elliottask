import type { Persona, SurveyResponse } from "@/lib/types";
import { OptionTag } from "./option-tag";
import { PersonaMark } from "./persona-mark";

/**
 * The respondent record, kept beside the conversation for its whole length.
 * Attributes are rows rather than chips so the pattern still holds when a
 * persona carries twenty of them.
 */
export function PersonaPanel({
  persona,
  response,
}: {
  persona: Persona;
  response: SurveyResponse | undefined;
}) {
  const attributes: Array<[string, string]> = [
    ["Location", persona.location],
    ["Industry", persona.industry],
    ["Seniority", persona.seniority],
    ["Generation", persona.generation],
    ["Gender", persona.gender],
  ];

  return (
    <aside
      aria-label="Respondent record"
      className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-surface-sunk"
    >
      <div className="border-b border-border px-6 py-6">
        <div className="flex items-start gap-3">
          <PersonaMark name={persona.name} choice={response?.choice ?? ""} />
          <div className="min-w-0">
            <h2 className="font-medium text-ink">{persona.name}</h2>
            <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-muted">
              {persona.role}
            </p>
            <p className="text-[0.8125rem] leading-snug text-ink-muted">
              {persona.company}
            </p>
          </div>
        </div>
      </div>

      {response ? (
        <div className="border-b border-border px-6 py-5">
          <p className="label">Answered</p>
          <div className="mt-2">
            <OptionTag option={response.choice} />
          </div>
          <p className="verbatim mt-3 text-[0.9375rem] leading-relaxed text-ink">
            &ldquo;{response.comment}&rdquo;
          </p>
        </div>
      ) : null}

      <div className="border-b border-border px-6 py-5">
        <p className="label">Profile</p>
        <dl className="mt-3 flex flex-col gap-2">
          {attributes.map(([term, value]) => (
            <div key={term} className="flex items-baseline gap-3">
              <dt className="w-24 shrink-0 text-[0.8125rem] text-ink-muted">
                {term}
              </dt>
              <dd className="min-w-0 flex-1 text-[0.8125rem] text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="px-6 py-5">
        <p className="label">How this respondent was built</p>
        <ol className="mt-3 flex flex-col gap-2.5 text-[0.8125rem] leading-relaxed text-ink-muted">
          <li>
            Psychographic profile triangulated from anonymised public
            observations and first-party research.
          </li>
          <li>
            Placed in a network of 1,000 respondents drawn from the same
            audience, where opinion forms through observed connections.
          </li>
          <li>
            Answered this survey by reasoning from that profile, then calibrated
            against the network.
          </li>
        </ol>
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
          Anything outside that profile is the model extrapolating, and it is
          marked as such in the transcript.
        </p>
      </div>
    </aside>
  );
}
