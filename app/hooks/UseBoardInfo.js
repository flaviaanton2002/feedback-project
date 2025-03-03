import axios from "axios";
import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const BoardInfoContext = createContext({});

export function UseBoardSlug() {
  const pathname = usePathname();
  const result = /^\/board\/([a-z0-9\-]+)(\/.*)?$/.exec(pathname);
  const boardName = result?.[1];
  return boardName;
}

export async function isBoardAdmin(boardName) {
  const res = await axios.get("/api/board");
  return !!res.data.find((board) => board.name === boardName);
}

export function BoardInfoProvider({ children }) {
  const boardSlug = UseBoardSlug();
  const [boardName, setBoardName] = useState(boardSlug);
  const [boardAdmin, setBoardAdmin] = useState(undefined);
  const [boardDescription, setBoardDescription] = useState("");
  useEffect(() => {
    if (boardSlug) {
      axios.get("/api/board?slug=" + boardSlug).then((res) => {
        setBoardName(res.data.name);
        setBoardAdmin(res.data.adminEmail);
        setBoardDescription(res.data.description);
      });
    }
  }, [boardSlug]);
  return (
    <BoardInfoContext.Provider
      value={{
        slug: boardSlug,
        name: boardName,
        description: boardDescription,
      }}
    >
      {children}
    </BoardInfoContext.Provider>
  );
}
