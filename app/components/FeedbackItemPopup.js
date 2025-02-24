import axios from "axios";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";
import Attachment from "./Attachment";
import Edit from "./icons/Edit";
import AttachFilesButton from "./AttachFilesButton";
import Trash from "./icons/Trash";

export default function FeedbackItemPopup({
  _id,
  title,
  description,
  setShow,
  votes,
  onVotesChange,
  uploads,
  user,
  onUpdate,
}) {
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newUploads, setNewUploads] = useState(uploads);
  const { data: session } = useSession();
  function handleVoteButtonClick() {
    setIsVotesLoading(true);
    axios.post("/api/vote", { feedbackId: _id }).then(async () => {
      await onVotesChange();
      setIsVotesLoading(false);
    });
  }
  function handleEditButtonClick() {
    setIsEditMode(true);
  }
  function handleRemoveFileButtonClick(e, linkToRemove) {
    e.preventDefault();
    setNewUploads((prevNewUploads) =>
      prevNewUploads.filter((l) => l !== linkToRemove)
    );
  }
  function handleCancelButtonClick() {
    setIsEditMode(false);
    setNewTitle(title);
    setNewDescription(description);
    setNewUploads(uploads);
  }
  function handleNewUploads(newLinks) {
    setNewUploads((currentLinks) => [...currentLinks, ...newLinks]);
  }
  function handleSaveButtonClick() {
    axios
      .put("/api/feedback", {
        id: _id,
        title: newTitle,
        description: newDescription,
        uploads: newUploads,
      })
      .then(() => {
        setIsEditMode(false);
        onUpdate({
          id: _id,
          title: newTitle,
          description: newDescription,
          uploads: newUploads,
        });
      });
  }
  const iVoted = !!votes.find((v) => v.userEmail === session?.user?.email);
  return (
    <Popup title={""} setShow={setShow}>
      <div className="p-8 pb-2">
        {isEditMode && (
          <input
            className="block w-full mb-2 p-2 border rounded-md"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        )}
        {!isEditMode && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        {isEditMode && (
          <textarea
            className="block w-full mb-2 p-2 border rounded-md"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        )}
        {!isEditMode && <p className="text-gray-600">{description}</p>}
        {uploads?.length > 0 && (
          <div className=" mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {(isEditMode ? newUploads : uploads).map((link, index) => (
                <Attachment
                  key={index}
                  link={link}
                  handleRemoveFileButtonClick={handleRemoveFileButtonClick}
                  showRemoveButton={isEditMode}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-end px-8 py-2 border-b">
        {isEditMode && (
          <>
            <AttachFilesButton onNewFiles={handleNewUploads} />
            <Button onClick={handleCancelButtonClick}>
              <Trash classnName="size-4" />
              Cancel
            </Button>
            <Button primary="true" onClick={handleSaveButtonClick}>
              Save changes
            </Button>
          </>
        )}
        {!isEditMode && user?.email && session?.user?.email === user?.email && (
          <Button onClick={handleEditButtonClick}>
            <Edit className="size-4" />
            Edit
          </Button>
        )}
        {!isEditMode && (
          <Button primary="true" onClick={handleVoteButtonClick}>
            {isVotesLoading && <MoonLoader size={18} />}
            {!isVotesLoading && (
              <>
                {iVoted && (
                  <>
                    <Tick className="size-4" />
                    Upvoted {votes?.length || "0"}
                  </>
                )}
                {!iVoted && (
                  <>
                    <span className="triangle-vote-up"></span>
                    Upvote {votes?.length || "0"}
                  </>
                )}
              </>
            )}
          </Button>
        )}
      </div>
      <FeedbackItemPopupComments feedbackId={_id} />
    </Popup>
  );
}
