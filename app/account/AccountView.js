import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountView() {
  const { data: session, status } = useSession();
  const [boards, setBoards] = useState([]);
  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status === "unauthenticated") signIn("google");
    if (status === "authenticated") {
      axios.get("/api/board").then((res) => {
        setBoards(res.data);
      });
    }
  }, [status]);
  if (status === "loading") {
    return "Loading...";
  }
  if (status === "unauthenticated") {
    return "Unauthenticated. Redirecting...";
  }
  return (
    <>
      <h1 className="text-center text-4xl mb-8">Your boards:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boards.map((board, index) => (
          <Link
            key={index}
            className="bg-white p-4 rounded-md shadow-sm h-24 flex items-center justify-center"
            href={"/board/" + board.slug}
          >
            <span>{board.name}</span>
          </Link>
        ))}
        <Link
          href={"/account/new-board"}
          className="flex items-center justify-center bg-rose-300 rounded-md shadow-sm"
        >
          <span>Add new board+</span>
        </Link>
      </div>
    </>
  );
}
