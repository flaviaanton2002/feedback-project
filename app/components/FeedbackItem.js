export default function FeedbackItem() {
  return (
    <div className="my-8 flex gap-8 items-center">
      <div>
        <h2 className="font-bold">Name 1</h2>
        <p className="text-gray-600 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div>
        <button className="shadow-sm shadow-gray-200 border rounded-md py-1 px-4 flex items-center gap-1 text-gray-600">
          <span className="triangle-vote-up"></span>
          80
        </button>
      </div>
    </div>
  );
}
