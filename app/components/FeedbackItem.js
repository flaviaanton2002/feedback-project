"use client";
import { useState } from "react";
import Popup from "./Popup";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { MoonLoader } from "react-spinners";

export default function FeedbackItem({
  onOpen,
  _id,
  title,
  description,
  votes,
  onVotesChange,
  parentLoagingVotes = true,
}) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;
  function handleVoteButtonClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      localStorage.setItem("vote_after_login", _id);
      setShowLoginPopup(true);
    } else {
      setIsVotesLoading(true);
      axios.post("/api/vote", { feedbackId: _id }).then(async () => {
        await onVotesChange();
        setIsVotesLoading(false);
      });
    }
  }
  async function handleGoogleLoginButtonClick(e) {
    e.stopPropagation();
    e.preventDefault();
    await signIn("google");
  }
  const iVoted = !!votes.find((v) => v.userEmail === session?.user?.email);
  return (
    <a
      href=""
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      className="my-8 flex gap-8 items-center"
    >
      <div className="flex-grow">
        <h2 className="font-bold">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div>
        {showLoginPopup && (
          <Popup
            title={"Confirm your vote!"}
            narrow
            setShow={setShowLoginPopup}
          >
            <div className="p-4">
              <Button primary="true" onClick={handleGoogleLoginButtonClick}>
                login with google
              </Button>
            </div>
          </Popup>
        )}
        <Button
          primary={iVoted ? "true" : undefined}
          onClick={handleVoteButtonClick}
          className="shadow-sm border"
        >
          {!isVotesLoading && (
            <>
              <span className="triangle-vote-up"></span>
              {votes?.length || "0"}
            </>
          )}
          {isVotesLoading && <MoonLoader size={18} />}
        </Button>
      </div>
    </a>
  );
}
