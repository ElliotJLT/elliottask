import { notFound } from "next/navigation";
import { ConversationPanel } from "@/components/conversation-panel";
import { suggestedOpenings } from "@/lib/openings";
import {
  getConversation,
  getMessages,
  getPersona,
  getResponse,
} from "@/lib/store";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const conversation = getConversation(id);
  if (!conversation) notFound();

  const persona = getPersona(conversation.personaId);
  if (!persona) notFound();

  const response = getResponse(persona.id);

  return (
    <ConversationPanel
      persona={persona}
      response={response}
      messages={getMessages(conversation.id)}
      openings={response ? suggestedOpenings(response) : []}
    />
  );
}
