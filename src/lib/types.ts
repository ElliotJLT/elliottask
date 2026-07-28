/**
 * Domain model for the persona chat.
 *
 * Shaped the way the production schema would be: one interface per table,
 * cross-references as ids (foreign keys), no denormalised nesting. The mock
 * store reads like a database so the real one can slot in behind the same
 * contracts.
 */

export interface Survey {
  id: string;
  question: string;
  options: string[];
  audience: string;
  respondentCount: number;
  createdAt: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  gender: string;
  generation: string;
  seniority: string;
  industry: string;
  avatarUrl: string | null;
}

/** A persona's answer to one survey — the ground truth a chat can cite. */
export interface SurveyResponse {
  id: string;
  surveyId: string;
  personaId: string;
  choice: string;
  comment: string;
}

/**
 * Where a cited claim comes from. `simulated` is a first-class source:
 * extrapolation is allowed, but it is never allowed to look like data.
 */
export type CitationSource =
  | { kind: "survey_response"; responseId: string }
  | { kind: "profile_attribute"; attribute: keyof Persona }
  | { kind: "simulated"; note: string };

export interface Citation {
  id: string;
  messageId: string;
  /** Position marker matching a [n] token in the message content. */
  marker: number;
  source: CitationSource;
  /** Verbatim excerpt from the source, when one exists. */
  quote: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  author: "user" | "persona";
  /** Plain text with [n] citation markers for persona messages. */
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  personaId: string;
  surveyId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
