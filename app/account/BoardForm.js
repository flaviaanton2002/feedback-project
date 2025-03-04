import axios from "axios";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BoardForm({
  _id,
  name: defaultName,
  slug: defaultSlug,
  description: defaultDescription,
  visibility: defaultVisibility = "public",
  allowedEmails: defaultAllowedEmails,
  archived: defaultArchived,
  buttonText = "",
  onSubmit,
}) {
  const [name, setName] = useState(defaultName || "");
  const [slug, setSlug] = useState(defaultSlug || "");
  const [description, setDescription] = useState(defaultDescription || "");
  const [visibility, setVisibility] = useState(defaultVisibility || "public");
  const [allowedEmails, setAllowedEmails] = useState(
    defaultAllowedEmails?.join("\n") || ""
  );
  const [archived, setArchived] = useState(defaultArchived || false);
  const router = useRouter();
  function getBoardData() {
    return {
      name,
      slug,
      description,
      visibility,
      allowedEmails: allowedEmails.split("\n"),
    };
  }
  async function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit(getBoardData());
  }
  function handleArchiveButtonClick(e) {
    e.preventDefault();
    axios
      .put("/api/board", { id: _id, archived: !archived, ...getBoardData() })
      .then(() => {
        setArchived((prev) => !prev);
      });
  }
  return (
    <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
      {archived && (
        <div className="border border-orange-400 bg-orange-200 rounded-md p-4 my-4">
          This board is archived
        </div>
      )}
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
      <div>Visibility:</div>
      <label className="block">
        <input
          type="radio"
          name="visibility"
          value="public"
          checked={visibility === "public"}
          onChange={() => setVisibility("public")}
        />
        Public
      </label>
      <label className="block">
        <input
          type="radio"
          name="visibility"
          value="invite-only"
          checked={visibility === "invite-only"}
          onChange={() => setVisibility("invite-only")}
        />
        Invite only
      </label>
      {visibility === "invite-only" && (
        <div className="my-4">
          <label>
            <div>Who should be able to access the board?</div>
            <div className="text-sm text-gray-600">
              List all email adresses separated by new line
            </div>
            <textarea
              className="block w-full bg-white rounded-md h-24 p-2 mt-2"
              value={allowedEmails}
              onChange={(e) => setAllowedEmails(e.target.value)}
              placeholder={
                "user1@exemple.com\nuser2@exemple.com\nuser3@exemple.com"
              }
            />
          </label>
        </div>
      )}
      <Button
        primary={1}
        disabled={name === "" || slug === ""}
        className="w-full bg-primary px-6 py-2 justify-center my-4"
      >
        {buttonText}
      </Button>
      {!!_id && (
        <Button
          onClick={handleArchiveButtonClick}
          className="w-full justify-center py-2 my-4 border border-gray-400"
        >
          {archived ? "Unarchive" : "Archive"} this board
        </Button>
      )}
    </form>
  );
}
