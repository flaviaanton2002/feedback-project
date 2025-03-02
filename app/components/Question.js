"use client";

import { useState } from "react";
import ChevronDown from "./icons/ChevronDown";
import ChevronUp from "./icons/ChevronUp";

export default function Question({ question, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden my-4">
      <button
        className="w-full flex gap-2 items-center bg-rose-300 bg-opacity-50 text-xl p-4 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {!isOpen && <ChevronDown className="size-6 text-rose-800" />}
        {isOpen && <ChevronUp className="size-6 text-rose-800" />}
        {question}
      </button>
      {isOpen && (
        <div className="bg-rose-300 bg-opacity-30 p-4 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}
