"use client";
import Board from "@/app/components/Board";
import Header from "@/app/components/Header";
import UseBoardName from "@/app/hooks/UseBoardName";
import { SessionProvider } from "next-auth/react";

export default function FeedbackPage() {
  const boardName = UseBoardName();
  return (
    <SessionProvider>
      <Header />
      <Board name={boardName} />;
    </SessionProvider>
  );
}
