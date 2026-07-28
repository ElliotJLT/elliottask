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

  const glide = "duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)]";

  // The society holds the screen while browsing, shares it with a record, and
  // steps back to a column once the interview is the work being done. Exactly
  // one of the two columns grows in each mode; the other carries a fixed width.
  const societyBox =
    mode === "interview"
      ? `w-0 shrink-0 overflow-hidden p-0 transition-[width] ${glide}`
      : "min-w-0 flex-1 p-5";
  const panelBox =
    mode === "interview"
      ? "min-w-0 flex-1"
      : `shrink-0 overflow-hidden transition-[width] ${glide} ${
          mode === "record" ? "w-[31rem]" : "w-0"
        }`;

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
        <div className={societyBox}>
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

        <div className={panelBox}>
          <div
            className={`h-full ${mode === "record" ? "w-[31rem]" : "w-full"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
