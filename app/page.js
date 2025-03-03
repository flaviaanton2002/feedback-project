"use client";
import Link from "next/link";
import { useWideHeader } from "./hooks/AppContext";

export default function Home() {
  useWideHeader();
  return (
    <section className="grid grid-cols-1 gap-24 text-center my-16">
      <div>
        <h1 className="text-4xl mb-4 leading-tight">
          Your users will love FeedbackBoard
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Experience a seamless, collaborative solution for user requests. Say
          goodbye to outdated spreadsheets and chaotic boards. Empower your
          customers, gain priceless insights.
        </p>
        <Link
          href={"/account"}
          className="bg-primary text-white px-6 py-4 rounded-lg"
        >
          Try for free &rarr;
        </Link>
      </div>
      <div className="relative">
        <img
          src="/board.png"
          alt=""
          className="relative z-10 max-w-full md:max-w-lg mx-auto"
        />
        <div className="bg-rose-400 bg-opacity-20 w-[360px] h-[360px] rounded-full absolute left-[50%] -ml-[180px] top-[50%] -mt-[180px]"></div>
      </div>
    </section>
  );
}
