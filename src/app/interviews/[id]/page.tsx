import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageThread } from "@/components/message-thread";
import { OptionTag } from "@/components/option-tag";
import { PersonaPanel } from "@/components/persona-panel";
import { suggestedOpenings } from "@/lib/openings";
import {
  getConversation,
  getMessages,
  getPersona,
  getResponse,
} from "@/lib/store";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const conversation = getConversation(id);
  if (!conversation) notFound();

  const persona = getPersona(conversation.personaId);
  if (!persona) notFound();

  const response = getResponse(persona.id);
  const messages = getMessages(conversation.id);

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-border bg-card px-8 py-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <div className="min-w-0">
              <p className="label">Interview</p>
              <h1 className="mt-1.5 text-lg font-medium text-ink">
                {persona.name}
              </h1>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="label">Answered</span>
              {response ? <OptionTag option={response.choice} /> : null}
            </div>
          </div>
          <p className="mt-3 border-t border-border pt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
            Simulated respondent. Answers are grounded in this profile and the
            survey response, and marked where the model is extrapolating beyond
            them.
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto max-w-[46rem]">
            {messages.length > 0 ? (
              <MessageThread
                messages={messages}
                personaName={persona.name}
                choice={response?.choice ?? ""}
              />
            ) : (
              <section>
                <h2 className="text-base font-medium text-ink">
                  Start with what you want to understand
                </h2>
                <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                  {persona.name.split(" ")[0]} can speak to the answer given in
                  this survey and the profile behind it. Questions beyond that
                  are answered as extrapolation, and labelled.
                </p>

                {response ? (
                  <div className="mt-6">
                    <p className="label">Openings from this answer</p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {suggestedOpenings(response).map((opening) => (
                        <li
                          key={opening}
                          className="rounded-lg border border-border bg-card px-4 py-3 text-[0.9375rem] leading-relaxed text-ink"
                        >
                          {opening}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <p className="mt-6 text-[0.8125rem] text-ink-muted">
                  Not the right respondent?{" "}
                  <Link
                    href="/"
                    className="font-medium text-accent underline underline-offset-2"
                  >
                    Choose someone else
                  </Link>
                  .
                </p>
              </section>
            )}
          </div>
        </div>
      </div>

      <PersonaPanel persona={persona} response={response} />
    </div>
  );
}
