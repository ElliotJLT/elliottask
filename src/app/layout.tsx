import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HistoryRail, type RailItem } from "@/components/history-rail";
import {
  getPersona,
  getResponse,
  getSurvey,
  listStartedConversations,
} from "@/lib/store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radiant — Persona Chat",
  description:
    "Interview the personas who answered your simulated survey, with every claim traced to its source",
};

function railItems(): RailItem[] {
  return listStartedConversations().map((conversation) => {
    const persona = getPersona(conversation.personaId);
    const response = getResponse(conversation.personaId);
    return {
      id: conversation.id,
      title: conversation.title,
      personaName: persona?.name ?? "Unknown persona",
      choice: response?.choice ?? "",
      updatedAt: conversation.updatedAt,
    };
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const survey = getSurvey();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
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
      </body>
    </html>
  );
}
