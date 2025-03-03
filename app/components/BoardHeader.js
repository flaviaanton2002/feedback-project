import { useContext, useState } from "react";
import Button from "./Button";
import Search from "./icons/Search";
import { FeedbacksFetchContext } from "../hooks/FeedbacksFetchContext";
import FeedbackFormPopup from "./FeedbackFormPopup";
import { BoardInfoContext, UseBoardSlug } from "../hooks/UseBoardInfo";

export default function BoardHeader({ onNewFeedback }) {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const { sortOrFilter, setSortOrFilter, searchPhrase, setSearchPhrase } =
    useContext(FeedbacksFetchContext);
  const slug = UseBoardSlug();
  const { name: boardName, description } = useContext(BoardInfoContext);
  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }
  return (
    <>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup
          onCreate={onNewFeedback}
          setShow={setShowFeedbackPopupForm}
        />
      )}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 p-8">
        <h1 className="font-bold text-xl">{boardName}</h1>
        <p className="text-opacity-90 text-slate-700">{description}</p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex items-center border-b">
        <div className="grow flex items-center gap-4 text-gray-400">
          <select
            value={sortOrFilter}
            onChange={(e) => {
              setSortOrFilter(e.target.value);
            }}
            className="bg-transparent py-2"
          >
            <option value="votes">Most voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
            <option value="complete">Complete</option>
            <option value="archived">Archived</option>
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
          <Button primary={1} onClick={openFeedbackPopupForm}>
            Make a suggestion
          </Button>
        </div>
      </div>
    </>
  );
}
