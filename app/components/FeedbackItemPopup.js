import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";

export default function FeedbackItemPopup({
  title,
  description,
  setShow,
  votesCount,
}) {
  return (
    <Popup title={""} setShow={setShow}>
      <div className="p-8 pb-2">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex justify-end px-8 py-2 border-b">
        <Button primary="true">
          <span className="triangle-vote-up"></span>
          Upvote {votesCount}
        </Button>
      </div>
      <FeedbackItemPopupComments />
    </Popup>
  );
}
