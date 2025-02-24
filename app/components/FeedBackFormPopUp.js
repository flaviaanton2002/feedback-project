import Popup from "./Popup";
import Button from "./Button";
import { useState } from "react";
import axios from "axios";
import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";
import { MoonLoader } from "react-spinners";
import Attachments from "./Attachment";

export default function FeedbackFormPopup({ setShow, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  function handleCreatePostButtonClick(e) {
    e.preventDefault();
    axios.post("/api/feedback", { title, description, uploads }).then(() => {
      setShow(false);
      onCreate();
    });
  }
  async function handleAttachFilesInputChange(e) {
    const files = [...e.target.files];
    setIsUploading(true);
    const data = new FormData();
    for (const file of files) {
      data.append("file", file);
    }
    const res = await axios.post("/api/upload", data);
    setUploads((existingUploads) => {
      return [...existingUploads, ...res.data];
    });
    setIsUploading(false);
  }
  function handleRemoveFileButtonClick(e, link) {
    e.preventDefault();
    setUploads((currentUploads) => {
      return currentUploads.filter((val) => val !== link);
    });
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
        {uploads?.length > 0 && (
          <div>
            <label className="block mt-2 mb-1 text-slate-700">Files</label>
            <div className="flex gap-3">
              {uploads.map((link, index) => (
                <Attachments
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
          <label className="flex gap-2 py-2 px-4 cursor-pointer">
            {isUploading && <MoonLoader size={18} />}
            <span className={isUploading ? "text-gray-300 " : "text-gray-600 "}>
              {isUploading ? "Uploading..." : "Attach files"}
            </span>
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
