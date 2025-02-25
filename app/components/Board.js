"use client";
import Button from "./Button";
import FeedbackFormPopup from "./FeedbackFormPopup";
import FeedbackItem from "./FeedbackItem";
import { useEffect, useRef, useState } from "react";
import FeedbackItemPopup from "./FeedbackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MoonLoader } from "react-spinners";
import Search from "./icons/Search";
import { debounce } from "lodash";

export default function Board() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const fetchingFeedbacksRef = useRef(false);
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
  const watingRef = useRef(false);
  const [wating, setWating] = useState(false);
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const [sort, setSort] = useState("votes");
  const sortRef = useRef("votes");
  const loadedRows = useRef(0);
  const everythingLoadedRef = useRef(false);
  const [votes, setVotes] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const searchPhraseRef = useRef("");
  const debouncedFetchFeedbacksRef = useRef(debounce(fetchFeedbacks, 300));
  const { data: session } = useSession();
  useEffect(() => {
    fetchFeedbacks();
  }, []);
  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);
  useEffect(() => {
    loadedRows.current = 0;
    sortRef.current = sort;
    searchPhraseRef.current = searchPhrase;
    everythingLoadedRef.current = false;
    if (feedbacks?.length > 0) {
      setFeedbacks([]);
    }
    setWating(true);
    watingRef.current = true;
    debouncedFetchFeedbacksRef.current();
  }, [sort, searchPhrase]);
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
  function handleScroll() {
    const html = window.document.querySelector("html");
    const howMuchScrolled = html.scrollTop;
    const howMuchIsToScroll = html.scrollHeight;
    const leftToScroll =
      howMuchIsToScroll - howMuchScrolled - html.clientHeight;
    if (leftToScroll <= 100) {
      fetchFeedbacks(true);
    }
  }
  function registerScrollListener() {
    window.addEventListener("scroll", handleScroll);
  }
  function unregisterScrollListener() {
    window.removeEventListener("scroll", handleScroll);
  }
  useEffect(() => {
    registerScrollListener();
    return () => {
      unregisterScrollListener();
    };
  }, []);
  async function fetchFeedbacks(append = false) {
    if (fetchingFeedbacksRef.current) return;
    if (everythingLoadedRef.current) return;
    fetchingFeedbacksRef.current = true;
    setFetchingFeedbacks(true);
    axios
      .get(
        `/api/feedback?sort=${sortRef.current}&loadedRows=${loadedRows.current}&search=${searchPhraseRef.current}`
      )
      .then((res) => {
        if (append) {
          setFeedbacks((currentFeedbacks) => [
            ...currentFeedbacks,
            ...res.data,
          ]);
        } else {
          setFeedbacks(res.data);
        }
        if (res.data?.length > 0) {
          loadedRows.current += res.data.length;
        }
        if (res.data?.length === 0) {
          everythingLoadedRef.current = true;
        }
        fetchingFeedbacksRef.current = false;
        setFetchingFeedbacks(false);
        watingRef.current = false;
        setWating(false);
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
  async function handleFeedbackUpdate(newData) {
    setShowFeedbackPopupItem((prevData) => {
      return { ...prevData, ...newData };
    });
    await fetchFeedbacks();
  }
  return (
    <main className="bg-white md:max-w-2xl md:mx-auto md:shadow-lg md:rounded-lg md:mt-4 md:mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-8">
        <h1 className="font-bold text-xl">My App</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide the logo of the app
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex items-center border-b">
        <div className="grow flex items-center gap-4 text-gray-400">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
            className="bg-transparent py-2"
          >
            <option value="votes">Most voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div className="relative">
            <Search className="size-4 absolute top-3 left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value)}
              className="bg-transparent p-2 pl-7"
            />
          </div>
        </div>
        <div>
          <Button primary="true" onClick={openFeedbackPopupForm}>
            Make a suggestion
          </Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks?.length === 0 && !fetchingFeedbacks && !wating && (
          <div className="py-8 text-4xl text-gray-200">Nothing found :(</div>
        )}
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
        {(fetchingFeedbacks || wating) && (
          <div className="p-4">
            <MoonLoader size={24} />
          </div>
        )}
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
          onUpdate={handleFeedbackUpdate}
          setShow={setShowFeedbackPopupItem}
        />
      )}
    </main>
  );
}
