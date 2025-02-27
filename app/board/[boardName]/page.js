"use client";
import Board from "@/app/components/Board";
import Header from "@/app/components/Header";
import UseBoardName from "@/app/hooks/UseBoardName";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function BoardPage() {
  const boardName = UseBoardName();
  return (
    <SessionProvider>
      <Header />
      <Board name={boardName} />
    </SessionProvider>
  );
}
