import { formatTime } from "@/lib/format";
import type { Citation, Message } from "@/lib/types";
import { CitedText } from "./citations";
import { PersonaMark } from "./persona-mark";

function UserMessage({ message }: { message: Message }) {
  return (
    <li className="flex justify-end">
      <div className="max-w-[80%]">
        <p className="rounded-xl rounded-br-sm bg-accent-soft px-4 py-3 text-[0.9375rem] leading-relaxed text-ink">
          {message.content}
        </p>
        <p className="mt-1.5 text-right text-[0.75rem] text-ink-muted tabular-nums">
          {formatTime(message.createdAt)}
        </p>
      </div>
    </li>
  );
}

function PersonaMessage({
  message,
  citations,
  personaName,
  personaId,
  choice,
  onViewSources,
}: {
  message: Message;
  citations: Citation[];
  personaName: string;
  personaId: string;
  choice: string;
  onViewSources: () => void;
}) {
  return (
    <li>
      <div className="flex items-center gap-2.5">
        <PersonaMark
          name={personaName}
          choice={choice}
          personaId={personaId}
          size="sm"
        />
        <span className="text-[0.8125rem] font-medium text-ink">
          {personaName}
        </span>
        <span className="text-[0.75rem] text-ink-muted tabular-nums">
          {formatTime(message.createdAt)}
        </span>
      </div>
      <div className="mt-2 ml-[2.625rem] rounded-xl rounded-tl-sm border border-border bg-card px-5 py-4">
        <CitedText
          content={message.content}
          citations={citations}
          onViewSources={onViewSources}
        />
      </div>
    </li>
  );
}

/** The staged pause before a reply, described honestly rather than dressed up. */
export function ThinkingRow({
  personaName,
  personaId,
  choice,
}: {
  personaName: string;
  personaId: string;
  choice: string;
}) {
  return (
    <li>
      <div className="flex items-center gap-2.5">
        <PersonaMark
          name={personaName}
          choice={choice}
          personaId={personaId}
          size="sm"
        />
        <span className="text-[0.8125rem] font-medium text-ink">
          {personaName}
        </span>
      </div>
      <div className="mt-2 ml-[2.625rem] flex items-center gap-2 rounded-xl rounded-tl-sm border border-border bg-card px-5 py-4">
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 animate-pulse rounded-full bg-ink-muted"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </span>
        <span className="text-[0.875rem] text-ink-muted">
          Checking the survey response and profile
        </span>
      </div>
    </li>
  );
}

export function MessageThread({
  messages,
  citations,
  personaName,
  personaId,
  choice,
  onViewSources,
}: {
  messages: Message[];
  citations: Citation[];
  personaName: string;
  personaId: string;
  choice: string;
  onViewSources: () => void;
}) {
  return (
    <ol className="flex flex-col gap-7">
      {messages.map((message) =>
        message.author === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <PersonaMessage
            key={message.id}
            message={message}
            citations={citations.filter((c) => c.messageId === message.id)}
            personaName={personaName}
            personaId={personaId}
            choice={choice}
            onViewSources={onViewSources}
          />
        ),
      )}
    </ol>
  );
}
