"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { society } from "@/lib/graph";
import type { ShellData } from "@/lib/shell-data";
import { ContextRail } from "./context-rail";
import { SocietyPanel } from "./society-panel";

/**
 * Three steps, in the order the work actually happens. Browse the society,
 * read a respondent, then interview them. Each step gives width to the one
 * after it, and the society stays mounted throughout so none of it reads as
 * leaving the page.
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

  const segments = pathname.split("/").filter(Boolean);
  const mode: "browse" | "record" | "interview" =
    segments[0] === "interviews"
      ? "interview"
      : segments[0] === "respondents"
        ? "record"
        : "browse";

  const focus =
    mode === "record"
      ? data.respondents.find((entry) => entry.persona.id === segments[1])
      : mode === "interview"
        ? data.respondents.find((entry) => entry.conversationId === segments[1])
        : undefined;

  const activeOptions = data.results
    .map((result) => result.option)
    .filter((option) => !muted.includes(option));

  const openRecord = (personaId: string) =>
    router.push(`/respondents/${personaId}`);

  const glide = "duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]";

  // Each panel is laid out at a fixed width and revealed by an animating cap,
  // so moving between modes widens the right column without a single line of
  // text rewrapping. The society keeps its place on the left throughout, which
  // is what makes this read as one screen opening rather than two screens
  // swapping.
  const panelWidth = mode === "record" ? "w-[31rem]" : "w-[56rem]";
  const panelCap =
    mode === "browse" ? "0px" : mode === "record" ? "31rem" : "56rem";

  return (
    <div className="flex h-full">
      <div
        aria-hidden={mode !== "browse"}
        className={`shrink-0 overflow-hidden transition-[width] ${glide} ${
          mode === "browse" ? "w-[20rem]" : "w-0"
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
            activeConversationId={
              mode === "interview" ? (segments[1] ?? null) : null
            }
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1">
        <div className="min-w-0 flex-1 overflow-hidden p-5">
          <SocietyPanel
            results={data.results}
            activeOptions={activeOptions}
            focusPersonaId={focus?.persona.id ?? null}
            focusName={focus?.persona.name.split(" ")[0] ?? null}
            compact={false}
            interviewableCount={
              data.respondents.filter((entry) => entry.conversationId).length
            }
            populationCount={society.nodes.length}
            onSelect={openRecord}
          />
        </div>

        <div
          style={{ maxWidth: panelCap }}
          className={`min-w-0 flex-1 overflow-hidden transition-[max-width] ${glide}`}
        >
          <div className={`h-full ${panelWidth}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
