import { useEffect, useRef, useState } from "react";
import FeedbackItemPopup from "./FeedbackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";
import BoardHeader from "./BoardHeader";
import BoardBody from "./BoardBody";
import {
  feedbackOpenNeeded,
  fetchFeedback,
  fetchSpecificFeedbacks,
  notifyIfBottomOfThePage,
  postLoginActions,
} from "../libs/boardFunctions";
import { FeedbacksFetchContext } from "../hooks/FeedbacksFetchContext";
import { UseBoardSlug } from "../hooks/UseBoardInfo";

export default function Board() {
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksFetchCount, setFeedbacksFetchCount] = useState(0);
  const fetchingFeedbacksRef = useRef(false);
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
  const watingRef = useRef(false);
  const [wating, setWating] = useState(true);
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const [sortOrFilter, setSortOrFilter] = useState("votes");
  const sortOrFilterRef = useRef("votes");
  const loadedRows = useRef(0);
  const everythingLoadedRef = useRef(false);
  const [votes, setVotes] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const searchPhraseRef = useRef("");
  const pathname = usePathname();
  const slug = UseBoardSlug();
  const debouncedFetchFeedbacksRef = useRef(debounce(fetchFeedbacks, 300));
  const { data: session } = useSession();
  useEffect(() => {
    fetchFeedbacks();
    const handleScroll = () =>
      notifyIfBottomOfThePage(() => fetchFeedbacks(true));
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    if (feedbacksFetchCount === 0) {
      return;
    }
    loadedRows.current = 0;
    sortOrFilterRef.current = sortOrFilter;
    searchPhraseRef.current = searchPhrase;
    everythingLoadedRef.current = false;
    if (feedbacks?.length > 0) {
      setFeedbacks([]);
    }
    setWating(true);
    watingRef.current = true;
    debouncedFetchFeedbacksRef.current();
  }, [sortOrFilter, searchPhrase]);

  useEffect(() => {
    if (feedbacksFetchCount === 0) {
      return;
    }
    const url = showFeedbackPopupItem
      ? `/board/${slug}/feedback/${showFeedbackPopupItem._id}`
      : "/board/" + slug;
    window.history.pushState({}, "", url);
  }, [showFeedbackPopupItem]);
  useEffect(() => {
    const idToOpen = feedbackOpenNeeded(feedbacksFetchCount, pathname);
    if (idToOpen) {
      fetchFeedback(idToOpen).then(setShowFeedbackPopupItem);
    }
  }, [feedbacksFetchCount]);
  useEffect(() => {
    if (!session?.user?.email) {
      return;
    }
    postLoginActions(fetchVotes, fetchFeedbacks, openFeedbackPopupItem);
  }, [session]);
  async function fetchFeedbacks(append = false) {
    if (fetchingFeedbacksRef.current || everythingLoadedRef.current) {
      return;
    }
    fetchingFeedbacksRef.current = true;
    setFetchingFeedbacks(true);
    fetchSpecificFeedbacks({
      boardName: slug,
      sortOrFilter: sortOrFilterRef.current,
      loadedRows: loadedRows.current,
      search: searchPhraseRef.current,
    }).then((feedbacks) => {
      setFeedbacksFetchCount((prevCount) => prevCount + 1);
      setFeedbacks((currentFeedbacks) =>
        append ? [...currentFeedbacks, ...feedbacks] : feedbacks
      );
      if (feedbacks?.length > 0) {
        loadedRows.current += feedbacks.length;
      }
      if (feedbacks?.length === 0) {
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
  function openFeedbackPopupItem(feedback) {
    setShowFeedbackPopupItem(feedback);
  }
  async function handleFeedbackUpdate(newData) {
    setShowFeedbackPopupItem((prevData) => {
      return { ...prevData, ...newData };
    });
    loadedRows.current = 0;
    await fetchFeedbacks();
  }
  return (
    <main className="bg-white md:max-w-2xl md:mx-auto md:shadow-lg md:rounded-lg md:mt-4 md:mb-8 overflow-hidden">
      <FeedbacksFetchContext.Provider
        value={{
          sortOrFilter,
          setSortOrFilter,
          searchPhrase,
          setSearchPhrase,
        }}
      >
        <BoardHeader onNewFeedback={fetchFeedbacks} />
      </FeedbacksFetchContext.Provider>

      <div className="px-8">
        <BoardBody
          onVotesChange={fetchVotes}
          fetchingFeedbacks={fetchingFeedbacks}
          isVotesLoading={isVotesLoading}
          votes={votes}
          feedbacks={feedbacks}
          wating={wating}
          onFeedbackClick={openFeedbackPopupItem}
        />
      </div>
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
