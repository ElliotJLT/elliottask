import {
  getCitations,
  getConversationForPersona,
  getMessages,
  getPersona,
  getResponse,
  getResults,
  getSurvey,
  listInsights,
  listPersonas,
  listStartedConversations,
  type OptionShare,
} from "./store";
import type {
  Citation,
  Insight,
  Message,
  Persona,
  Survey,
  SurveyResponse,
} from "./types";

export interface ShellRespondent {
  persona: Persona;
  response: SurveyResponse | undefined;
  conversationId: string | undefined;
  hasTranscript: boolean;
}

export interface ShellSaved {
  conversationId: string;
  personaName: string;
  title: string;
  choice: string;
  updatedAt: string;
}

export interface ShellData {
  survey: Survey;
  results: OptionShare[];
  insights: Insight[];
  respondents: ShellRespondent[];
  saved: ShellSaved[];
  transcripts: Record<string, { messages: Message[]; citations: Citation[] }>;
}

/** Everything the persistent shell needs, on every route. */
export function getShellData(): ShellData {
  return {
    survey: getSurvey(),
    results: getResults(),
    insights: listInsights(),
    respondents: listPersonas().map((persona) => {
      const conversation = getConversationForPersona(persona.id);
      return {
        persona,
        response: getResponse(persona.id),
        conversationId: conversation?.id,
        hasTranscript: conversation
          ? getMessages(conversation.id).length > 0
          : false,
      };
    }),
    transcripts: Object.fromEntries(
      listPersonas()
        .map((persona) => getConversationForPersona(persona.id))
        .filter((conversation) => conversation !== undefined)
        .map((conversation) => {
          const messages = getMessages(conversation.id);
          return [
            conversation.id,
            {
              messages,
              citations: messages.flatMap((message) => getCitations(message.id)),
            },
          ];
        }),
    ),
    saved: listStartedConversations().map((conversation) => ({
      conversationId: conversation.id,
      personaName: getPersona(conversation.personaId)?.name ?? "Unknown",
      title: conversation.title,
      choice: getResponse(conversation.personaId)?.choice ?? "",
      updatedAt: conversation.updatedAt,
    })),
  };
}
