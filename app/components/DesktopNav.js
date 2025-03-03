import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Popup from "./Popup";
import { useRouter } from "next/navigation";
import { UseBoardSlug } from "../hooks/UseBoardInfo";

export default function DesktopNav() {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  function goAndClose(uri) {
    setShowUserPopup(false);
    router.push(uri);
  }
  function login() {
    const isBoardPage = window.location.href.includes("/board/");
    if (isBoardPage) {
      signIn("google");
    } else {
      router.push("/account");
    }
  }
  return (
    <>
      <Link href="/" className="text-primary font-bold text-xl relative z-30">
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
            onClick={() => signOut()}
          >
            Logout
          </button>
        </Popup>
      )}
    </>
  );
}
