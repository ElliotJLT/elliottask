"use client";

import { useState, useSyncExternalStore } from "react";
import { formatTime, stripMarkers } from "@/lib/format";
import {
  findingIdFor,
  isSaved,
  subscribeFindings,
  toggleFinding,
} from "@/lib/findings-store";
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

type Vote = "up" | "down" | null;

function ActionButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex size-7 items-center justify-center rounded-md transition-colors duration-150 ${
        active
          ? "bg-surface-sunk text-ink"
          : "text-ink-muted hover:bg-surface-sunk hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * The row under a persona reply. A reply is the unit a researcher reacts to,
 * copies, or keeps: rating it, lifting the words out, or pinning it to the
 * project's findings. Saving is the one that persists, since a finding is the
 * durable artefact; the rest are lightweight and live for the session.
 */
function MessageActions({
  message,
  citations,
  conversationId,
  personaId,
  personaName,
  choice,
}: {
  message: Message;
  citations: Citation[];
  conversationId: string;
  personaId: string;
  personaName: string;
  choice: string;
}) {
  const [vote, setVote] = useState<Vote>(null);
  const [copied, setCopied] = useState(false);

  const saved = useSyncExternalStore(
    subscribeFindings,
    () => isSaved(message.id),
    () => false,
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(stripMarkers(message.content));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard can be blocked; the reply is still on screen to copy by hand.
    }
  };

  const save = () => {
    toggleFinding({
      id: findingIdFor(message.id),
      conversationId,
      personaId,
      personaName,
      choice,
      content: message.content,
      citations,
      savedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="mt-2 ml-[2.625rem] flex items-center gap-1">
      <ActionButton
        label={vote === "up" ? "Rated helpful" : "Helpful"}
        active={vote === "up"}
        onClick={() => setVote((v) => (v === "up" ? null : "up"))}
      >
        <ThumbIcon />
      </ActionButton>
      <ActionButton
        label={vote === "down" ? "Rated unhelpful" : "Not helpful"}
        active={vote === "down"}
        onClick={() => setVote((v) => (v === "down" ? null : "down"))}
      >
        <ThumbIcon down />
      </ActionButton>
      <ActionButton
        label={copied ? "Copied" : "Copy reply"}
        active={copied}
        onClick={copy}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </ActionButton>
      <ActionButton
        label={saved ? "Saved to findings" : "Save to findings"}
        active={saved}
        onClick={save}
      >
        <BookmarkIcon filled={saved} />
      </ActionButton>
    </div>
  );
}

function PersonaMessage({
  message,
  citations,
  conversationId,
  personaName,
  personaId,
  choice,
  onViewSources,
}: {
  message: Message;
  citations: Citation[];
  conversationId: string;
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
      <MessageActions
        message={message}
        citations={citations}
        conversationId={conversationId}
        personaId={personaId}
        personaName={personaName}
        choice={choice}
      />
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
      <div className="mt-2 ml-[2.625rem] flex items-center gap-2.5 rounded-xl rounded-tl-sm border border-border bg-card px-5 py-4">
        <span className="flex items-center gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-ink-muted"
              style={{
                animation: "typing-bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 160}ms`,
              }}
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
  conversationId,
  personaName,
  personaId,
  choice,
  onViewSources,
}: {
  messages: Message[];
  citations: Citation[];
  conversationId: string;
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
            conversationId={conversationId}
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

function ThumbIcon({ down = false }: { down?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`size-[0.9375rem] ${down ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7.5 7.4 2.5c.9 0 1.6.7 1.6 1.6V6.3h2.7c.7 0 1.2.6 1.1 1.3l-.7 3.8c-.1.5-.6.9-1.1.9H5" />
      <path d="M5 7.5v6H3.5a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1H5Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="size-[0.9375rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="size-[0.9375rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="size-[0.9375rem]"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 3.2c0-.4.3-.7.7-.7h6.6c.4 0 .7.3.7.7v10.3L8 10.8l-4 2.7V3.2Z" />
    </svg>
  );
}
