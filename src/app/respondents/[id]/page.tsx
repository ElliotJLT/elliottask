import { notFound } from "next/navigation";
import { RespondentPanel } from "@/components/respondent-panel";
import {
  getConversationForPersona,
  getMessages,
  getPersona,
  getResponse,
} from "@/lib/store";

export default async function RespondentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const persona = getPersona(id);
  if (!persona) notFound();

  const conversation = getConversationForPersona(persona.id);

  return (
    <RespondentPanel
      persona={persona}
      response={getResponse(persona.id)}
      conversationId={conversation?.id}
      hasTranscript={conversation ? getMessages(conversation.id).length > 0 : false}
    />
  );
}
