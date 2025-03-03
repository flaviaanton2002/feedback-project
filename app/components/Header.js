"use client";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import { useContext } from "react";
import { AppContext } from "../hooks/AppContext";

export default function Header() {
  const { narrowHeader } = useContext(AppContext);
  return (
    <>
      <header
        className={
          "flex gap-8 text-gray-600 h-24 items-center mx-auto " +
          (narrowHeader ? "max-w-2xl" : "")
        }
      >
        <DesktopNav />
        <div className="grow md:hidden"></div>
        <MobileNav />
      </header>
    </>
  );
}
