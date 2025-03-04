import axios from "axios";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";
import Attachment from "./Attachment";
import Edit from "./icons/Edit";
import AttachFilesButton from "./AttachFilesButton";
import Trash from "./icons/Trash";
import { isBoardAdmin, UseBoardSlug } from "../hooks/UseBoardInfo";

export default function FeedbackItemPopup({
  _id,
  title,
  description,
  status,
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
  const [newStatus, setNewStatus] = useState(status || "new");
  const [isAdmin, setIsAdmin] = useState(undefined);
  const { data: session } = useSession();
  const boardSlug = UseBoardSlug();
  useEffect(() => {
    if (boardSlug) {
      isBoardAdmin(boardSlug).then((resultIsAdmin) => {
        setIsAdmin(resultIsAdmin);
      });
    }
  }, [boardSlug]);
  useEffect(() => {
    if (newStatus === status) {
      return;
    }
    const data = { id: _id, title, description, status: newStatus, uploads };
    axios.put("/api/feedback", data).then(() => {
      onUpdate({ status: newStatus });
    });
  }, [newStatus]);
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
        {!isEditMode && (
          <p
            className="text-gray-600"
            dangerouslySetInnerHTML={{
              __html: (description || "").replace(/\n/gi, "<br />"),
            }}
          />
        )}
        {uploads?.length > 0 && (
          <div className=" mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {(isEditMode ? newUploads : uploads).map((link) => (
                <Attachment
                  key={_id + link}
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
            <Button primary={1} onClick={handleSaveButtonClick}>
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
        {!isEditMode && isAdmin && (
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="bg-gray-200 rounded-md"
          >
            <option value="new">new</option>
            <option value="planned">planned</option>
            <option value="in_progress">in progress</option>
            <option value="complete">complete</option>
            <option value="archived">archived</option>
          </select>
        )}
        {!isEditMode && (
          <Button primary={1} onClick={handleVoteButtonClick}>
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
