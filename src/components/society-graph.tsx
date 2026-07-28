"use client";

import { useMemo } from "react";
import { society } from "@/lib/graph";
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
 * The society. Position carries community, colour carries the answer, and glow
 * carries whether a respondent can be interviewed. Respondents outside the
 * current filter fade into the background rather than disappearing, so the
 * share of the population being looked at stays legible.
 */
export function SocietyGraph({
  activeOptions,
  selectedPersonaId,
  onSelect,
}: {
  activeOptions: string[];
  selectedPersonaId: string | null;
  onSelect: (personaId: string, point: { x: number; y: number }) => void;
}) {
  const { nodes, edges, size } = society;

  const isLit = useMemo(() => {
    const set = new Set(activeOptions);
    return (option: string) => set.size === 0 || set.has(option);
  }, [activeOptions]);

  const interviewable = useMemo(
    () => nodes.filter((node) => node.personaId !== null),
    [nodes],
  );

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full"
      role="img"
      aria-label="Society of simulated respondents, grouped by the season each one chose"
    >
      <defs>
        <filter id="society-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <g>
        {edges.map((edge, index) => {
          const a = nodes[edge.a];
          const b = nodes[edge.b];
          const lit = isLit(a.option) && isLit(b.option);
          return (
            <line
              key={index}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={edge.local ? fillFor(a.option) : "var(--ink)"}
              strokeWidth={edge.local ? 1.6 : 1}
              strokeOpacity={lit ? (edge.local ? 0.45 : 0.16) : 0.04}
              className="transition-opacity duration-300"
            />
          );
        })}
      </g>

      {/* Background: the rest of the population, present but receded. */}
      <g>
        {nodes.map((node) =>
          node.personaId === null ? (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={9}
              fill={fillFor(node.option)}
              opacity={isLit(node.option) ? 0.45 : 0.08}
              className="transition-opacity duration-300"
            />
          ) : null,
        )}
      </g>

      {/* Foreground: respondents you can actually interview. */}
      <g filter="url(#society-glow)">
        {interviewable.map((node) => (
          <circle
            key={`glow-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.personaId === selectedPersonaId ? 26 : 18}
            fill={fillFor(node.option)}
            opacity={isLit(node.option) ? 0.55 : 0.06}
            className="transition-all duration-300"
          />
        ))}
      </g>

      <g>
        {interviewable.map((node) => {
          const lit = isLit(node.option);
          const selected = node.personaId === selectedPersonaId;
          return (
            <g
              key={node.id}
              opacity={lit ? 1 : 0.12}
              className="transition-opacity duration-300"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={selected ? 17 : 14}
                fill={fillFor(node.option)}
                stroke="var(--card)"
                strokeWidth={4}
                className="cursor-pointer transition-all duration-200"
                onClick={() =>
                  lit &&
                  onSelect(node.personaId as string, {
                    x: node.x / size,
                    y: node.y / size,
                  })
                }
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
