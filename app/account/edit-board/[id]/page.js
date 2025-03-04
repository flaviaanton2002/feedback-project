"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BoardForm from "../../BoardForm";
import { useRouter } from "next/navigation";

export default function EditBoardPage() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();
  const router = useRouter();
  useEffect(() => {
    if (id) {
      axios.get("/api/board?id=" + id).then((res) => setBoard(res.data));
    }
  }, [id]);
  async function handleBoardSubmit({ name, slug, description }) {
    await axios.put("/api/board", { id: board._id, name, slug, description });
    router.push("/account");
  }
  return (
    <>
      <h1 className="text-center text-4xl mb-8">Edit board</h1>
      {board && (
        <BoardForm
          {...board}
          buttonText={"Update board"}
          onSubmit={handleBoardSubmit}
        />
      )}
    </>
  );
}
