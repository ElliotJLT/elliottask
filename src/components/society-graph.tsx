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

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full"
      role="img"
      aria-label="Society of simulated respondents, grouped by the season each one chose"
    >
      <g stroke="var(--ink)" strokeOpacity={0.06} strokeWidth={1}>
        {edges.map((edge, index) => (
          <line
            key={index}
            x1={nodes[edge.a].x}
            y1={nodes[edge.a].y}
            x2={nodes[edge.b].x}
            y2={nodes[edge.b].y}
          />
        ))}
      </g>

      <g>
        {nodes.map((node) => {
          const lit = isLit(node.option);
          const interviewable = node.personaId !== null;
          const selected = interviewable && node.personaId === selectedPersonaId;

          if (!interviewable) {
            return (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={7}
                fill={fillFor(node.option)}
                opacity={lit ? 0.78 : 0.1}
                className="transition-opacity duration-300"
              />
            );
          }

          return (
            <g
              key={node.id}
              className="transition-opacity duration-300"
              opacity={lit ? 1 : 0.15}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={selected ? 26 : 19}
                fill="none"
                stroke={fillFor(node.option)}
                strokeWidth={selected ? 3 : 1.5}
                strokeOpacity={selected ? 0.9 : 0.45}
                className="transition-all duration-200"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={13}
                fill={fillFor(node.option)}
                stroke="var(--card)"
                strokeWidth={4}
                className="cursor-pointer"
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
