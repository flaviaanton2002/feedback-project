"use client";
import Link from "next/link";
import BarsTwo from "./icons/BarsTwo";
import { useState } from "react";

export default function LandingHeader() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header className="flex gap-8 text-gray-600 h-24 items-center">
      <Link href="/" className="text-primary font-bold text-xl relative z-30">
        FeedbackBoard
      </Link>
      <nav className="gap-4 grow hidden md:flex">
        <Link href={"/"}>Home</Link>
        <Link href={"/pricing"}>Pricing</Link>
        <Link href={"/help"}>Help</Link>
      </nav>
      <nav className="gap-4 items-center hidden md:flex">
        <Link href={"/login"}>Login</Link>
        <Link
          href={"/register"}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Sign up
        </Link>
      </nav>
      <div className="grow md:hidden"></div>
      <label
        onClick={() => setNavOpen((prev) => !prev)}
        className="block md:hidden mobile-nav cursor-pointer"
      >
        <BarsTwo />
      </label>
      <input
        type="checkbox"
        id="navCb"
        checked={navOpen}
        onChange={() => setNavOpen((prev) => !prev)}
      />
      <div
        onClick={() => setNavOpen(false)}
        className="nav-popup fixed inset-0 bg-bgGray bg-opacity-80 p-4 rounded-2xl z-20 text-xl uppercase text-center pt-24"
      >
        <div className="w-full">
          <div className="bg-bgGray border shadow-lg rounded-lg max-w-sm mx-auto mt-4 py-4">
            <nav>
              <Link className="block py-4" href={"/"}>
                Home
              </Link>
              <Link className="block py-4" href={"/pricing"}>
                Pricing
              </Link>
              <Link className="block py-4" href={"/help"}>
                Help
              </Link>
              <Link className="block py-4" href={"/login"}>
                Login
              </Link>
              <Link className="block py-4" href={"/register"}>
                Register
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
