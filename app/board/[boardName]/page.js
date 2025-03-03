"use client";
import Board from "@/app/components/Board";
import Header from "@/app/components/Header";
import { BoardInfoProvider, UseBoardSlug } from "@/app/hooks/UseBoardInfo";
import { SessionProvider } from "next-auth/react";

export default function BoardPage() {
  const boardName = UseBoardSlug();
  return (
    <SessionProvider>
      <BoardInfoProvider>
        <Header />
        <Board />
      </BoardInfoProvider>
    </SessionProvider>
  );
}
