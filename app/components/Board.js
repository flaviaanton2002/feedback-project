"use client";
import Button from "./Button";
import FeedbackFormPopup from "./FeedbackFormPopup";
import FeedbackItem from "./FeedbackItem";
import { useEffect, useState } from "react";
import FeedbackItemPopup from "./FeedbackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Board() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const [votes, setVotes] = useState([]);
  const { data: session } = useSession();
  useEffect(() => {
    fetchFeedbacks();
  }, []);
  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);
  useEffect(() => {
    if (session?.user?.email) {
      const feedbackToVote = localStorage.getItem("vote_after_login");
      if (feedbackToVote) {
        axios.post("/api/vote", { feedbackId: feedbackToVote }).then(() => {
          localStorage.removeItem("vote_after_login");
          fetchVotes();
        });
      }
      const feedbackToPost = localStorage.getItem("post_after_login");
      if (feedbackToPost) {
        const feedbackData = JSON.parse(feedbackToPost);
        axios.post("/api/feedback", feedbackData).then(async (res) => {
          await fetchFeedbacks();
          setShowFeedbackPopupItem(res.data);
          localStorage.removeItem("post_after_login");
        });
      }
      const commentToPost = localStorage.getItem("comment_after_login");
      if (commentToPost) {
        const commentData = JSON.parse(commentToPost);
        axios.post("/api/comment", commentData).then(() => {
          axios
            .get("/api/feedback?id=" + commentData.feedbackId)
            .then((res) => {
              setShowFeedbackPopupItem(res.data);
              localStorage.removeItem("comment_after_login");
            });
        });
      }
    }
  }, [session?.user?.email]);
  async function fetchFeedbacks() {
    axios.get("/api/feedback").then((res) => {
      setFeedbacks(res.data);
    });
  }
  async function fetchVotes() {
    setIsVotesLoading(true);
    const ids = feedbacks.map((f) => f._id);
    const res = await axios.get("/api/vote?feedbackIds=" + ids.join(","));
    setVotes(res.data);
    setIsVotesLoading(false);
  }
  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }
  function openFeedbackPopupItem(feedback) {
    setShowFeedbackPopupItem(feedback);
  }

  return (
    <main className="bg-white md:max-w-2xl md:mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-8">
        <h1 className="font-bold text-xl">My App</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide the logo of the app
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow"></div>
        <div>
          <Button primary="true" onClick={openFeedbackPopupForm}>
            Make a suggestion
          </Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks.map((feedback, index) => (
          <FeedbackItem
            key={index}
            {...feedback}
            onVotesChange={fetchVotes}
            votes={votes.filter(
              (v) => v.feedbackId.toString() === feedback._id.toString()
            )}
            parentLoagingVotes={isVotesLoading}
            onOpen={() => openFeedbackPopupItem(feedback)}
          />
        ))}
      </div>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup
          onCreate={fetchFeedbacks}
          setShow={setShowFeedbackPopupForm}
        />
      )}
      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          {...showFeedbackPopupItem}
          votes={votes.filter(
            (v) => v.feedbackId.toString() === showFeedbackPopupItem._id
          )}
          onVotesChange={fetchVotes}
          setShow={setShowFeedbackPopupItem}
        />
      )}
    </main>
  );
}
