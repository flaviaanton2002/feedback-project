import Popup from "./Popup";
import Button from "./Button";
import { useState } from "react";
import axios from "axios";

export default function FeedbackFormPopup({ setShow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  function handleCreatePostButtonClick(e) {
    e.preventDefault();
    axios.post("/api/feedback", { title, description }).then(() => {
      setShow(false);
    });
  }
  async function handleAttachFilesInputChange(e) {
    const files = [...e.target.files];
    const data = new FormData();
    for (const file of files) {
      data.append("file", file);
    }
    const res = await axios.post("/api/upload", data);
    console.log(res);
  }
  return (
    <Popup setShow={setShow} title={"Make a suggestion"}>
      <form className="p-8">
        <label className="block mt-4 mb-1 text-slate-700">Title</label>
        <input
          className="w-full border p-2 rounded-md"
          type="text"
          placeholder="A short, descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="block mt-4 mb-1 text-slate-700">Details</label>
        <textarea
          className="w-full border p-2 rounded-md"
          placeholder="Please include any details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2 mt-2 justify-end">
          <label className="py-2 px-4 text-gray-600 cursor-pointer">
            <span>Attach files</span>
            <input
              multiple
              onChange={handleAttachFilesInputChange}
              type="file"
              className="hidden"
            />
          </label>
          <Button primary="true" onClick={handleCreatePostButtonClick}>
            Create post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
