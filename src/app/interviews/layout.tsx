import { HistoryRail, type RailItem } from "@/components/history-rail";
import {
  getPersona,
  getResponse,
  getSurvey,
  listStartedConversations,
} from "@/lib/store";

function railItems(): RailItem[] {
  return listStartedConversations().map((conversation) => {
    const persona = getPersona(conversation.personaId);
    const response = getResponse(conversation.personaId);
    return {
      id: conversation.id,
      title: conversation.title,
      personaName: persona?.name ?? "Unknown respondent",
      choice: response?.choice ?? "",
      updatedAt: conversation.updatedAt,
    };
  });
}

export default function InterviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const survey = getSurvey();

  return (
    <div className="flex h-full">
      <HistoryRail
        surveyQuestion={survey.question}
        respondentCount={survey.respondentCount}
        items={railItems()}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
