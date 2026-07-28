import Link from "next/link";
import { OptionTag } from "@/components/option-tag";
import { PersonaMark } from "@/components/persona-mark";
import { ResultBars } from "@/components/result-bars";
import {
  getConversationForPersona,
  getResponse,
  getResults,
  getSurvey,
  listPersonas,
} from "@/lib/store";

export default function StartPage() {
  const survey = getSurvey();
  const results = getResults();
  const respondents = listPersonas().map((persona) => ({
    persona,
    response: getResponse(persona.id),
    conversation: getConversationForPersona(persona.id),
  }));

  return (
    <>
      <header className="shrink-0 border-b border-border bg-card px-10 py-7">
        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-6">
          <div className="max-w-xl">
            <p className="label">New interview</p>
            <h1 className="mt-2 text-[1.375rem] leading-snug font-medium text-ink">
              {survey.question}
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              {survey.audience} · {survey.respondentCount.toLocaleString("en-GB")}{" "}
              simulated respondents
            </p>
          </div>
          <div className="w-72 shrink-0">
            <p className="label mb-3">Population result</p>
            <ResultBars results={results} />
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-10 py-8">
        <section className="max-w-2xl">
          <h2 className="text-base font-medium text-ink">
            What an interview gives you
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            The result tells you what the population chose. An interview tells you
            why one respondent chose it, what would move them, and where their
            reasoning stops being grounded in what the simulation actually knows
            about them.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            <li className="flex gap-3">
              <span aria-hidden className="text-accent">
                &rarr;
              </span>
              Test a message on one respondent before you put it to a population.
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-accent">
                &rarr;
              </span>
              Read the reasoning behind a minority answer, where the segment is
              too small to interpret from the chart.
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-accent">
                &rarr;
              </span>
              Check how far an answer travels by asking what the respondent can
              and cannot speak to.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-base font-medium text-ink">Respondents</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Selected from the survey graph. Pick someone whose answer you want to
            understand.
          </p>

          <ul className="mt-5 flex max-w-4xl flex-col gap-3">
            {respondents.map(({ persona, response, conversation }) => (
              <li key={persona.id}>
                <Link
                  href={conversation ? `/interviews/${conversation.id}` : "/"}
                  className="group block rounded-xl border border-border bg-card px-5 py-4 transition-colors duration-150 hover:border-border-strong"
                >
                  <div className="flex items-start gap-4">
                    <PersonaMark
                      name={persona.name}
                      choice={response?.choice ?? ""}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-medium text-ink">{persona.name}</h3>
                        <p className="text-sm text-ink-muted">
                          {persona.role}, {persona.company}
                        </p>
                      </div>
                      <p className="mt-1 text-[0.8125rem] text-ink-muted">
                        {persona.location} · {persona.generation} ·{" "}
                        {persona.industry}
                      </p>
                      {response ? (
                        <p className="verbatim mt-3 text-[0.9375rem] leading-relaxed text-ink">
                          &ldquo;{response.comment}&rdquo;
                        </p>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="label mb-1.5">Chose</p>
                      {response ? <OptionTag option={response.choice} /> : null}
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-accent">
                    Interview {persona.name.split(" ")[0]}{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
                    >
                      &rarr;
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
