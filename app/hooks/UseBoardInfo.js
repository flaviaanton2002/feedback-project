import axios from "axios";
import { usePathname } from "next/navigation";

export function UseBoardName() {
  const pathname = usePathname();
  const result = /^\/board\/([a-z0-9\-]+)(\/.*)?$/.exec(pathname);
  const boardName = result?.[1];
  return boardName;
}

export async function isBoardAdmin(boardName) {
  const res = await axios.get("/api/board");
  return !!res.data.find((board) => board.name === boardName);
}
