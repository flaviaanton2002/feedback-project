"use client";
import Button from "./components/Button";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import FeedbackItem from "./components/FeedbackItem";
import { useEffect, useState } from "react";
import FeedbackItemPopup from "./components/FeedbackItemPopup";
import axios from "axios";

export default function Home() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    axios.get("/api/feedback").then((res) => setFeedbacks(res.data));
  }, []);
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
          Help me decide the name of the app
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
            onOpen={() => openFeedbackPopupItem(feedback)}
          />
        ))}
      </div>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup setShow={setShowFeedbackPopupForm} />
      )}
      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          {...showFeedbackPopupItem}
          setShow={setShowFeedbackPopupItem}
        />
      )}
    </main>
  );
}
