"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { society } from "@/lib/graph";
import type { ShellData } from "@/lib/shell-data";
import { ContextRail } from "./context-rail";
import { SocietyPanel } from "./society-panel";

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
  const router = useRouter();
  const [muted, setMuted] = useState<string[]>([]);

  const conversationId = pathname.startsWith("/interviews/")
    ? pathname.split("/")[2]
    : null;

  const openInterview = conversationId
    ? data.respondents.find((entry) => entry.conversationId === conversationId)
    : undefined;

  const inConversation = Boolean(openInterview);
  const populationCount = society.nodes.length;

  const activeOptions = data.results
    .map((result) => result.option)
    .filter((option) => !muted.includes(option));

  // Selecting a respondent opens their interview directly. A preview card in
  // between would show the same fields the panel already carries.
  const open = (personaId: string) => {
    const target = data.respondents.find(
      (entry) => entry.persona.id === personaId,
    );
    if (target?.conversationId) router.push(`/interviews/${target.conversationId}`);
  };

  const glide = "duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)]";

  return (
    <div className="flex h-full">
      {/* The context column is discovery furniture. It gives up its width to
          the conversation rather than competing with it. */}
      <div
        aria-hidden={inConversation}
        className={`shrink-0 overflow-hidden transition-[width] ${glide} ${
          inConversation ? "w-0" : "w-[20rem]"
        }`}
      >
        <div className="h-full w-[20rem]">
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
        </div>
      </div>

      <div className="flex min-w-0 flex-1">
        <div className="min-w-0 flex-1 p-5">
          <SocietyPanel
            results={data.results}
            activeOptions={activeOptions}
            focusPersonaId={openInterview?.persona.id ?? null}
            focusName={openInterview?.persona.name.split(" ")[0] ?? null}
            interviewableCount={
              data.respondents.filter((entry) => entry.conversationId).length
            }
            populationCount={populationCount}
            onSelect={open}
          />
        </div>

        <div
          className={`shrink-0 overflow-hidden transition-[width] ${glide} ${
            inConversation ? "w-[31rem]" : "w-0"
          }`}
        >
          <div className="h-full w-[31rem]">{children}</div>
        </div>
      </div>
    </div>
  );
}
