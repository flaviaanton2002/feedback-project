import FeedbackItem from "./components/FeedbackItem";

export default function Home() {
  return (
    <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-8">
        <h1 className="font-bold text-xl">My App</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide the name of the app
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow"></div>
        <div>
          <button className="bg-pink-500 py-1 px-4 rounded-md text-white text-opacity-90">
            Make a suggestion
          </button>
        </div>
      </div>
      <div className="px-8">
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
      </div>
    </main>
  );
}
