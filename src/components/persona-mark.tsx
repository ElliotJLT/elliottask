import { optionStyles } from "./option-tag";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Personas are constructed, not photographed. An initials mark tinted with the
 * respondent's answer says "modelled respondent" where a portrait would imply
 * a record of something a real person said.
 */
export function PersonaMark({
  name,
  choice,
  size = "md",
}: {
  name: string;
  choice: string;
  size?: "sm" | "md";
}) {
  const dimensions = size === "sm" ? "size-8 text-[0.6875rem]" : "size-11 text-sm";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-medium tracking-wide ${dimensions} ${optionStyles(choice).tint}`}
    >
      {initials(name)}
    </span>
  );
}
