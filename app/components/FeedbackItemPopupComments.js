import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";
import axios from "axios";
import Attachment from "./Attachment";
import TimeAgo from "timeago-react";
import { useSession } from "next-auth/react";
import AttachFilesButton from "./AttachFilesButton";
import { BoardInfoContext } from "../hooks/UseBoardInfo";

export default function FeedbackItemPopupComments({ feedbackId }) {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentUploads, setNewCommentUploads] = useState([]);
  const { data: session } = useSession();
  const { archived } = useContext(BoardInfoContext);
  useEffect(() => {
    fetchComments();
  }, []);
  function fetchComments() {
    axios.get("/api/comment?feedbackId=" + feedbackId).then((res) => {
      setComments(res.data);
    });
  }
  function handleEditButtonClick(comment) {
    setEditingComment(comment);
    setNewCommentText(comment.text);
    setNewCommentUploads(comment.uploads);
  }
  function handleCancelButtonClick() {
    setNewCommentText("");
    setEditingComment(null);
    setNewCommentUploads([]);
  }
  function handleRemoveFileButtonClick(e, linkToRemove) {
    e.preventDefault();
    setNewCommentUploads((prevNewCommentUploads) =>
      prevNewCommentUploads.filter((l) => l !== linkToRemove)
    );
  }
  function handleNewLinks(newLinks) {
    setNewCommentUploads((currentLinks) => [...currentLinks, ...newLinks]);
  }
  async function handleSaveButtonClick() {
    const newData = { text: newCommentText, uploads: newCommentUploads };
    await axios.put("/api/comment", { id: editingComment._id, ...newData });
    setComments((existingComments) => {
      return existingComments.map((comment) => {
        if (comment._id === editingComment._id) {
          return { ...comment, ...newData };
        } else {
          return comment;
        }
      });
    });
    setEditingComment(null);
  }
  const showCommentForm = !editingComment && !archived;
  return (
    <div className="p-8">
      {comments?.length > 0 &&
        comments.map((comment, index) => {
          const editingThis = editingComment?._id === comment?._id;
          const isAuthor =
            !!comment.user.email && comment.user.email === session?.user?.email;
          return (
            <div className="mb-8" key={comment._id}>
              <div className="flex gap-4">
                <Avatar url={comment.user.image} />
                <div>
                  {editingThis && (
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="border p-2 block w-full"
                    />
                  )}
                  {!editingThis && (
                    <p className="text-gray-600">{comment.text}</p>
                  )}
                  <div className="text-gray-400 mt-2 text-sm">
                    {comment.user.name}
                    &nbsp;&middot;&nbsp;
                    <TimeAgo datetime={comment.createdAt} locale="en_US" />
                    {!editingThis && isAuthor && !archived && (
                      <>
                        &nbsp;&middot;&nbsp;
                        <span
                          onClick={() => handleEditButtonClick(comment)}
                          className="hover:underline cursor-pointer"
                        >
                          Edit
                        </span>
                      </>
                    )}
                    {editingThis && (
                      <>
                        &nbsp;&middot;&nbsp;
                        <span
                          onClick={handleCancelButtonClick}
                          className="hover:underline cursor-pointer"
                        >
                          Cancel
                        </span>
                        &nbsp;&middot;&nbsp;
                        <span
                          onClick={handleSaveButtonClick}
                          className="hover:underline cursor-pointer"
                        >
                          Save changes
                        </span>
                      </>
                    )}
                  </div>
                  {(editingThis ? newCommentUploads : comment.uploads)?.length >
                    0 && (
                    <div className="flex gap-2 mt-3">
                      {(editingThis ? newCommentUploads : comment.uploads).map(
                        (link) => (
                          <Attachment
                            key={"edit" + comment._id + link}
                            handleRemoveFileButtonClick={
                              handleRemoveFileButtonClick
                            }
                            showRemoveButton={editingThis}
                            link={link}
                          />
                        )
                      )}
                    </div>
                  )}
                  {editingThis && (
                    <div className="mt-2">
                      <AttachFilesButton onNewFiles={handleNewLinks} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      {comments.length === 0 && !showCommentForm && (
        <div className="text-center text-black text-opacity-50 py-4">
          No comments on this post.
        </div>
      )}
      {showCommentForm && (
        <CommentForm feedbackId={feedbackId} onPost={fetchComments} />
      )}
    </div>
  );
}
