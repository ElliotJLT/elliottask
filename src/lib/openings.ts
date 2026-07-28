import { getResults } from "./store";
import type { SurveyResponse } from "./types";

/** First clause of a comment, used to quote a respondent back to themselves. */
function firstClause(comment: string): string {
  const clause = comment.split(/[,.]/)[0]?.trim() ?? comment;
  return clause.length > 64 ? `${clause.slice(0, 61).trimEnd()}...` : clause;
}

/**
 * Openings are derived from this respondent's own answer rather than offered as
 * generic prompts, so the first question is already about them.
 */
export function suggestedOpenings(response: SurveyResponse): string[] {
  const contender = getResults()
    .filter((result) => result.option !== response.choice)
    .sort((a, b) => b.share - a.share)[0];

  const openings = [`Why did you choose ${response.choice}?`];

  if (contender) {
    openings.push(
      `What would it take for you to choose ${contender.option} instead?`,
    );
  }

  openings.push(
    `You said "${firstClause(response.comment)}". What does that look like day to day?`,
  );

  return openings;
}
