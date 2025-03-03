import { useState } from "react";
import BarsTwo from "./icons/BarsTwo";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MobileNav() {
  const [navOpen, setNavOpen] = useState(false);
  const { status: sessionStatus } = useSession();
  return (
    <>
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
              {sessionStatus === "unauthenticated" && (
                <>
                  <Link
                    className="block py-4 w-full uppercase"
                    href={"/account"}
                  >
                    Login
                  </Link>
                  <Link
                    className="block py-4 w-full uppercase"
                    href={"/account"}
                  >
                    Register
                  </Link>
                </>
              )}
              {sessionStatus === "authenticated" && (
                <Link className="block py-4 w-full uppercase" href={"/account"}>
                  Account
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
