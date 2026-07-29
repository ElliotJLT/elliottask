"use client";

import { useMemo } from "react";
import { neighbourhood, nodeIndexForPersona, society } from "@/lib/graph";
import { getOptionIndex } from "@/lib/store";

const FILLS = [
  "var(--data-1)",
  "var(--data-2)",
  "var(--data-3)",
  "var(--data-4)",
];

function fillFor(option: string): string {
  return FILLS[getOptionIndex(option)] ?? FILLS[0];
}

/**
 * The society, present in both modes. Discovery shows the whole population;
 * an open interview pulls the view in toward that respondent and lights the
 * people they are tied to, so the conversation keeps its place on the map.
 */
export function SocietyStage({
  activeOptions,
  activeIndustries,
  focusPersonaId,
  selectedPersonaId,
  onSelect,
  fill = false,
}: {
  activeOptions: string[];
  activeIndustries: string[];
  focusPersonaId: string | null;
  selectedPersonaId: string | null;
  onSelect: (personaId: string) => void;
  /** Fill the box by cropping, for the narrow column beside an interview. */
  fill?: boolean;
}) {
  const { nodes, edges, size } = society;

  const isLit = useMemo(() => {
    const options = new Set(activeOptions);
    const industries = new Set(activeIndustries);
    return (option: string, industry: string) =>
      (options.size === 0 || options.has(option)) &&
      (industries.size === 0 || industries.has(industry));
  }, [activeOptions, activeIndustries]);

  const focus = useMemo(() => {
    if (!focusPersonaId) return null;
    const index = nodeIndexForPersona(focusPersonaId);
    if (index < 0) return null;
    return { index, node: nodes[index], members: neighbourhood(index) };
  }, [focusPersonaId, nodes]);

  // Pull the view toward the focused respondent without cutting to a new scene.
  const scale = focus ? 1.55 : 1;
  const translateX = focus ? size / 2 - focus.node.x * scale : 0;
  const translateY = focus ? size / 2 - focus.node.y * scale : 0;

  const inFocus = (index: number) => !focus || focus.members.has(index);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio={fill ? "xMidYMid slice" : "xMidYMid meet"}
      className="h-full w-full"
      role="img"
      aria-label="Society of simulated respondents, grouped by the season each one chose"
    >
      <defs>
        <filter id="society-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <g
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          transformBox: "view-box",
          transformOrigin: "0 0",
          transition: "transform 700ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <g>
          {edges.map((edge, index) => {
            const a = nodes[edge.a];
            const b = nodes[edge.b];
            const lit = isLit(a.option, a.industry) && isLit(b.option, b.industry);
            const near = inFocus(edge.a) && inFocus(edge.b);
            const strength = lit ? (edge.local ? 0.45 : 0.16) : 0.04;
            return (
              <line
                key={index}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={edge.local ? fillFor(a.option) : "var(--ink)"}
                strokeWidth={edge.local ? 1.6 : 1}
                strokeOpacity={near ? strength : strength * 0.5}
                className="transition-opacity duration-500"
              />
            );
          })}
        </g>

        <g>
          {nodes.map((node, index) =>
            node.personaId === null ? (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={9}
                fill={fillFor(node.option)}
                opacity={
                  isLit(node.option, node.industry) ? (inFocus(index) ? 0.62 : 0.22) : 0.06
                }
                className="transition-opacity duration-500"
              />
            ) : null,
          )}
        </g>

        <g filter="url(#society-glow)">
          {nodes.map((node, index) =>
            node.personaId !== null ? (
              <circle
                key={`glow-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={node.personaId === selectedPersonaId ? 26 : 18}
                fill={fillFor(node.option)}
                opacity={
                  isLit(node.option, node.industry) ? (inFocus(index) ? 0.55 : 0.12) : 0.04
                }
                className="transition-all duration-500"
              />
            ) : null,
          )}
        </g>

        <g>
          {nodes.map((node, index) => {
            if (node.personaId === null) return null;
            const lit = isLit(node.option, node.industry);
            const selected = node.personaId === selectedPersonaId;
            return (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={selected ? 17 : 14}
                fill={fillFor(node.option)}
                stroke="var(--card)"
                strokeWidth={4}
                opacity={lit ? (inFocus(index) ? 1 : 0.3) : 0.12}
                className="cursor-pointer transition-all duration-500"
                onClick={() => lit && onSelect(node.personaId as string)}
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}
