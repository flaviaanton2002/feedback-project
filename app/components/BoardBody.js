import { MoonLoader } from "react-spinners";
import FeedbackItem from "./FeedbackItem";

export default function BoardBody({
  feedbacks,
  votes,
  fetchingFeedbacks,
  isVotesLoading,
  wating,
  onVotesChange,
  onFeedbackClick,
}) {
  return (
    <>
      {feedbacks?.length === 0 && !fetchingFeedbacks && !wating && (
        <div className="py-8 text-4xl text-gray-200">Nothing found :(</div>
      )}
      {feedbacks.map((feedback) => (
        <FeedbackItem
          {...feedback}
          key={feedback._id}
          onVotesChange={onVotesChange}
          votes={votes.filter(
            (v) => v.feedbackId.toString() === feedback._id.toString()
          )}
          parentLoagingVotes={isVotesLoading}
          onOpen={() => onFeedbackClick(feedback)}
        />
      ))}
      {(fetchingFeedbacks || wating) && (
        <div className="p-4">
          <MoonLoader size={24} />
        </div>
      )}
    </>
  );
}
