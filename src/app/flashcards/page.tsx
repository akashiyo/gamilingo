"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Flashcard from "./flashcard/flashcard";

export default function FlashcardsPage() {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") || "Foods"; // fallback

  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);

  const handleCountsUpdate = (known: number, unknown: number) => {
    setKnownCount(known);
    setUnknownCount(unknown);
  };

  return (
    <div className="py-4 text-center mx-auto w-64">
      {/* <nav className="flex justify-between mb-4">
        <div>BackButton</div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-row items-center gap-1">
            <span>{unknownCount}</span>
            <img src="/iconCross.svg" className="h-5" />
          </div>
          <div className="flex flex-row items-center gap-1">
            <span>{knownCount}</span>
            <img src="/iconCheck.svg" className="h-5" />
          </div>
        </div>
      </nav> */}

      <Flashcard theme={theme} onCountsChange={handleCountsUpdate} />
    </div>
  );
}
