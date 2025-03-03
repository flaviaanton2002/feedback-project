"use client";
import Board from "@/app/components/Board";
import Header from "@/app/components/Header";
import { BoardInfoProvider } from "@/app/hooks/UseBoardInfo";
import { SessionProvider } from "next-auth/react";

export default function FeedbackPage() {
  return (
    <SessionProvider>
      <BoardInfoProvider>
        <Header />
        <Board />
      </BoardInfoProvider>
    </SessionProvider>
  );
}
