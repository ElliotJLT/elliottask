import { ExploreView, type ExploreData } from "@/components/explore-view";
import {
  getConversationForPersona,
  getMessages,
  getResponse,
  getResults,
  getSurvey,
  listInsights,
  listPersonas,
  listStartedConversations,
} from "@/lib/store";

export default function ExplorePage() {
  const respondents = listPersonas().map((persona) => {
    const conversation = getConversationForPersona(persona.id);
    return {
      persona,
      response: getResponse(persona.id),
      conversationId: conversation?.id,
      hasTranscript: conversation
        ? getMessages(conversation.id).length > 0
        : false,
    };
  });

  const data: ExploreData = {
    survey: getSurvey(),
    results: getResults(),
    insights: listInsights(),
    respondents,
    savedCount: listStartedConversations().length,
  };

  return <ExploreView data={data} />;
}
