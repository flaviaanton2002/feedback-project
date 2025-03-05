"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";
import Popup from "./Popup";
import { useRouter } from "next/navigation";
import {
  AppContext,
  loginAndRedirect,
  logoutAndRedirect,
} from "../hooks/AppContext";

export default function DesktopNav() {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const { style } = useContext(AppContext);
  const router = useRouter();
  function goAndClose(uri) {
    setShowUserPopup(false);
    router.push(uri);
  }
  function login() {
    loginAndRedirect(router, signIn);
  }
  return (
    <>
      <Link
        href="/"
        className={
          "font-bold text-xl relative z-30 " +
          (style === "hyper"
            ? "text-red-500"
            : style === "oceanic"
            ? "text-blue-500"
            : style === "cotton-candy"
            ? "text-purple-300"
            : style === "gotham"
            ? "text-gray-900"
            : style === "sunset"
            ? "text-red-200"
            : style === "mojave"
            ? "text-yellow-300"
            : "text-pink-500")
        }
      >
        FeedbackBoard
      </Link>
      <nav className="gap-4 grow hidden md:flex">
        <Link href={"/"}>Home</Link>
        <Link href={"/pricing"}>Pricing</Link>
        <Link href={"/help"}>Help</Link>
      </nav>
      <nav className="gap-4 items-center hidden md:flex">
        {sessionStatus === "authenticated" && (
          <>
            <button
              onClick={() => setShowUserPopup(true)}
              className="flex items-center bg-gray-300 rounded-xl cursor-pointer"
            >
              <img
                className="w-8 h-8 rounded-full"
                src={session.user.image}
                alt=""
              />
              <span className="px-2">{session.user.name.split(" ")[0]}</span>
            </button>
          </>
        )}
        {sessionStatus === "unauthenticated" && (
          <>
            <button onClick={login}>Login</button>
            <button
              onClick={login}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Sign up
            </button>
          </>
        )}
      </nav>
      {showUserPopup && (
        <Popup narrow={1} setShow={setShowUserPopup}>
          <button
            className="block w-full text-center py-4 uppercase"
            onClick={() => goAndClose("/account")}
          >
            Your boards
          </button>
          <button
            className="block w-full text-center py-4 uppercase"
            onClick={() => {
              setShowUserPopup(false);
              logoutAndRedirect(router, signOut);
            }}
          >
            Logout
          </button>
        </Popup>
      )}
    </>
  );
}
