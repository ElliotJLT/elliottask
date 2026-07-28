"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ShellData } from "@/lib/shell-data";
import { ContextRail } from "./context-rail";
import { PersonaCard } from "./persona-card";
import { SocietyStage } from "./society-stage";

/**
 * One place, two modes. Discovery gives the society the room; an open
 * interview narrows it to the respondent's neighbourhood and hands the rest of
 * the width to the conversation. The society never unmounts, so moving between
 * the two reads as a change of focus rather than a change of place.
 */
export function AppShell({
  data,
  children,
}: {
  data: ShellData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [muted, setMuted] = useState<string[]>([]);
  const [picked, setPicked] = useState<{
    personaId: string;
    x: number;
    y: number;
  } | null>(null);

  const conversationId = pathname.startsWith("/interviews/")
    ? pathname.split("/")[2]
    : null;

  const openInterview = conversationId
    ? data.respondents.find((entry) => entry.conversationId === conversationId)
    : undefined;

  // The floating card belongs to discovery. While an interview is open the
  // conversation panel describes the respondent instead, and the pick is kept
  // so closing the interview returns you to where you were on the map.
  const inConversation = Boolean(openInterview);

  const activeOptions = data.results
    .map((result) => result.option)
    .filter((option) => !muted.includes(option));

  const chosen = picked
    ? data.respondents.find((entry) => entry.persona.id === picked.personaId)
    : undefined;

  return (
    <div className="flex h-full">
      <ContextRail
        data={data}
        muted={muted}
        onToggleOption={(option) =>
          setMuted((current) =>
            current.includes(option)
              ? current.filter((entry) => entry !== option)
              : [...current, option],
          )
        }
        onShowAll={() => setMuted([])}
        activeConversationId={conversationId}
      />

      <div className="flex min-w-0 flex-1">
        <div className="relative flex min-w-0 flex-1 items-center justify-center bg-card">
          <div className="pointer-events-none absolute top-7 left-8 z-10 max-w-sm">
            <p className="label">The society</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
              {inConversation
                ? `${openInterview?.persona.name.split(" ")[0]} and the respondents whose views shape theirs. The rest of the society is still here, behind them.`
                : "A sample of the society. Each dot is one respondent, tied to the neighbours who shape their view and drawn toward the others who answered as they did. The lit ones have a profile loaded to interview."}
            </p>
          </div>

          <div className="relative aspect-square h-full max-h-full w-full max-w-full">
            <SocietyStage
              activeOptions={activeOptions}
              focusPersonaId={openInterview?.persona.id ?? null}
              selectedPersonaId={
                openInterview?.persona.id ?? picked?.personaId ?? null
              }
              onSelect={(personaId, point) =>
                setPicked({ personaId, x: point.x, y: point.y })
              }
            />

            {chosen && picked && !inConversation ? (
              <div
                className="absolute z-20"
                style={{
                  left: `${picked.x * 100}%`,
                  top: `${picked.y * 100}%`,
                  transform: `translate(${picked.x > 0.5 ? "calc(-100% - 1.25rem)" : "1.25rem"}, ${
                    picked.y > 0.5 ? "calc(-100% - 0.5rem)" : "-0.5rem"
                  })`,
                }}
              >
                <PersonaCard
                  persona={chosen.persona}
                  response={chosen.response}
                  conversationId={chosen.conversationId}
                  hasTranscript={chosen.hasTranscript}
                  onDismiss={() => setPicked(null)}
                />
              </div>
            ) : null}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
