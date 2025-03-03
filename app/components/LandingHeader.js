"use client";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";

export default function LandingHeader() {
  return (
    <header className="flex gap-8 text-gray-600 h-24 items-center">
      <DesktopNav />
      <div className="grow md:hidden"></div>
      <MobileNav />
    </header>
  );
}
