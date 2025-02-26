import Popup from "./Popup";
import Button from "./Button";
import { useState } from "react";
import axios from "axios";
import Attachment from "./Attachment";
import AttachFilesButton from "./AttachFilesButton";
import { signIn, useSession } from "next-auth/react";

export default function FeedbackFormPopup({ setShow, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const { data: session } = useSession();
  async function handleCreatePostButtonClick(e) {
    e.preventDefault();
    if (session) {
      axios.post("/api/feedback", { title, description, uploads }).then(() => {
        setShow(false);
        onCreate();
      });
    } else {
      localStorage.setItem(
        "post_after_login",
        JSON.stringify({ title, description, uploads })
      );
      await signIn("google");
    }
  }
  function handleRemoveFileButtonClick(e, link) {
    e.preventDefault();
    setUploads((currentUploads) => {
      return currentUploads.filter((v) => v !== link);
    });
  }
  function addNewUploads(newLinks) {
    setUploads((prevLinks) => [...prevLinks, ...newLinks]);
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
          className="w-full border p-2 rounded-md h-24"
          placeholder="Please include any details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {uploads?.length > 0 && (
          <div>
            <label className="block mt-2 mb-1 text-slate-700">Files</label>
            <div className="flex gap-3">
              {uploads.map((link, index) => (
                <Attachment
                  key={index}
                  link={link}
                  showRemoveButton={true}
                  handleRemoveFileButtonClick={(e, link) =>
                    handleRemoveFileButtonClick(e, link)
                  }
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-2 justify-end">
          <AttachFilesButton onNewFiles={addNewUploads} />
          <Button primary={1} onClick={handleCreatePostButtonClick}>
            {session ? "Create post" : "Login and post"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
