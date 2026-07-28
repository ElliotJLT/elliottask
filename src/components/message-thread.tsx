import { formatTime } from "@/lib/format";
import type { Message } from "@/lib/types";
import { PersonaMark } from "./persona-mark";

function paragraphs(content: string): string[] {
  return content.split("\n\n").filter((part) => part.trim().length > 0);
}

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
  personaName,
  choice,
}: {
  message: Message;
  personaName: string;
  choice: string;
}) {
  return (
    <li>
      <div className="flex items-center gap-2.5">
        <PersonaMark name={personaName} choice={choice} size="sm" />
        <span className="text-[0.8125rem] font-medium text-ink">
          {personaName}
        </span>
        <span className="text-[0.75rem] text-ink-muted tabular-nums">
          {formatTime(message.createdAt)}
        </span>
      </div>
      <div className="mt-2 ml-[2.625rem] rounded-xl rounded-tl-sm border border-border bg-card px-5 py-4">
        {paragraphs(message.content).map((paragraph, index) => (
          <p
            key={index}
            className="text-[0.9375rem] leading-relaxed text-ink not-first:mt-4"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </li>
  );
}

export function MessageThread({
  messages,
  personaName,
  choice,
}: {
  messages: Message[];
  personaName: string;
  choice: string;
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
            personaName={personaName}
            choice={choice}
          />
        ),
      )}
    </ol>
  );
}
