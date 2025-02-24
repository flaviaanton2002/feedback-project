import { useState } from "react";
import Button from "./Button";
import AttachFilesButton from "./AttachFilesButton";
import Attachment from "./Attachment";
import axios from "axios";

export default function CommentForm({ feedbackId, onPost }) {
  const [commentText, setCommentText] = useState("");
  const [uploads, setUploads] = useState([]);
  function addNewUploads(newLinks) {
    setUploads((prevLinks) => [...prevLinks, ...newLinks]);
  }
  function handleRemoveFileButtonClick(e, link) {
    e.preventDefault();
    e.stopPropagation();
    setUploads((currentUploads) => {
      return currentUploads.filter((v) => v !== link);
    });
  }
  async function handleCommentButtonClick(e) {
    e.preventDefault();
    await axios.post("/api/comment", {
      text: commentText,
      uploads,
      feedbackId,
    });
    setCommentText("");
    setUploads([]);
    onPost();
  }
  return (
    <form>
      <textarea
        className="border rounded-md w-full p-2"
        placeholder="Let me know what you think..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      {uploads?.length > 0 && (
        <div className="">
          <div className="text-sm text-gray-600 mb-2 mt-3">Files:</div>
          <div className="flex gap-3">
            {uploads.map((link, index) => (
              <div key={index}>
                <Attachment
                  link={link}
                  showRemoveButton={true}
                  handleRemoveFileButtonClick={(e, link) =>
                    handleRemoveFileButtonClick(e, link)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <AttachFilesButton onNewFiles={addNewUploads} />
        <Button
          onClick={handleCommentButtonClick}
          primary="true"
          disabled={commentText === ""}
        >
          Comment
        </Button>
      </div>
    </form>
  );
}
