import { useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";

export default function FeedbackItemPopupComments() {
  const [commentText, setCommentText] = useState("");
  return (
    <div className="p-8">
      <div className="flex gap-4 mb-9">
        <Avatar />
        <div>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="text-gray-400 mt-2 text-sm">
            Anonymous &middot; a few seconds ago
          </div>
        </div>
      </div>
      <form>
        <textarea
          className="border rounded-md w-full p-2"
          placeholder="Let me know what you think..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button>Attach files</Button>
          <Button primary="true" disabled={commentText === ""}>
            Comment
          </Button>
        </div>
      </form>
    </div>
  );
}
