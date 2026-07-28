import type { Citation, CitationSource } from "@/lib/types";

function kindOf(source: CitationSource) {
  return source.kind === "simulated" ? "simulated" : "grounded";
}

function labelFor(source: CitationSource): string {
  switch (source.kind) {
    case "survey_response":
      return "Their survey answer";
    case "profile_attribute":
      return "Profile";
    case "simulated":
      return "Not in the data";
  }
}

/**
 * Grounded and simulated are separated by form as well as colour: grounded
 * claims carry a solid marker, extrapolation carries a dashed one. Colour
 * alone would fail anyone who cannot separate the two hues, and this is the
 * distinction the whole feature rests on.
 */
export function CitationMarker({ citation }: { citation: Citation }) {
  const grounded = kindOf(citation.source) === "grounded";
  return (
    <sup
      className={`mx-0.5 inline-flex h-[1.15rem] min-w-[1.15rem] translate-y-[-0.15em] items-center justify-center rounded-full px-1 text-[0.6875rem] font-medium ${
        grounded
          ? "bg-grounded-soft text-grounded"
          : "border border-dashed border-simulated bg-simulated-soft text-simulated"
      }`}
    >
      {citation.marker}
    </sup>
  );
}

/** Renders message text, swapping [n] tokens for their marker. */
export function CitedText({
  content,
  citations,
}: {
  content: string;
  citations: Citation[];
}) {
  const byMarker = new Map(citations.map((c) => [c.marker, c]));

  return (
    <>
      {content.split("\n\n").map((paragraph, index) => (
        <p
          key={index}
          className="text-[0.9375rem] leading-relaxed text-ink not-first:mt-4"
        >
          {paragraph.split(/(\[\d+\])/).map((part, partIndex) => {
            const match = part.match(/^\[(\d+)\]$/);
            if (!match) return part;
            const citation = byMarker.get(Number(match[1]));
            return citation ? (
              <CitationMarker key={partIndex} citation={citation} />
            ) : null;
          })}
        </p>
      ))}
    </>
  );
}

/**
 * The sources behind a reply, listed under it. Putting them in the flow rather
 * than behind a hover means the evidence is read at the same time as the claim.
 */
export function SourceList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
      {citations.map((citation) => {
        const grounded = kindOf(citation.source) === "grounded";
        return (
          <li key={citation.id} className="flex gap-2.5">
            <CitationMarker citation={citation} />
            <div className="min-w-0 flex-1">
              <p
                className={`text-[0.75rem] font-medium ${grounded ? "text-grounded" : "text-simulated"}`}
              >
                {labelFor(citation.source)}
              </p>
              <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                {citation.source.kind === "simulated" ? (
                  citation.source.note
                ) : citation.quote ? (
                  <span className="verbatim text-ink">
                    &ldquo;{citation.quote}&rdquo;
                  </span>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
