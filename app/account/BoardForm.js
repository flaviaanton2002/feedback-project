import axios from "axios";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BoardForm({
  name: defaultName,
  slug: defaultSlug,
  description: defaultDescription,
  buttonText = "",
  onSubmit,
}) {
  const [name, setName] = useState(defaultName || "");
  const [slug, setSlug] = useState(defaultSlug || "");
  const [description, setDescription] = useState(defaultDescription || "");
  const router = useRouter();
  async function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit({ name, slug, description });
  }
  return (
    <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
      <label>
        <div>Board name:</div>
        <input
          type="text"
          placeholder="Board name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full mb-4 p-2 rounded-md"
        />
      </label>
      <div className="flex items-center mb-4">
        <label className="w-full">
          <div>URL slug:</div>
          <div className="bg-white rounded-md flex">
            <span className="py-2 pl-2">feedback.com/board/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="board-name"
              className="py-2 bg-transparent flex grow"
            />
          </div>
        </label>
      </div>
      <label>
        <div>Description:</div>
        <input
          type="text"
          placeholder="Board description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full mb-4 p-2 rounded-md"
        />
      </label>
      <Button
        primary={1}
        disabled={name === "" || slug === ""}
        className="w-full bg-primary px-6 py-2 justify-center"
      >
        {buttonText}
      </Button>
    </form>
  );
}
