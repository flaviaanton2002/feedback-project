import Link from "next/link";

export default function Home() {
  return (
    <section className="grid gap-8 grid-cols-2 my-24 items-center">
      <div className="">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Your users will love FeedbackBoard
        </h1>
        <p className="text-gray-600 mb-8">
          Experience a seamless, collaborative solution for user requests. Say
          goodbye to outdated spreadsheets and chaotic boards. Empower your
          customers, gain priceless insights.
        </p>
        <Link
          href={"/register"}
          className="bg-primary text-white px-6 py-4 rounded-lg"
        >
          Try for free &rarr;
        </Link>
      </div>
      <div className="relative">
        <img src="/board.png" alt="" className="relative z-10" />
        <div className="bg-rose-400 bg-opacity-40 w-[300px] h-[300px] rounded-full absolute left-[50%] -ml-[150px] top-[50%] -mt-[150px]"></div>
      </div>
    </section>
  );
}
