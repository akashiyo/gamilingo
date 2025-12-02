"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/cards";
import { motion } from "framer-motion";
import Image from "next/image";

const games = [
  { id: "flashcards", name: "Flashcards", image: "/images/flashcard.png" },
  { id: "memory", name: "Memory Game", image: "/images/memory.png" },
  { id: "hangman", name: "Hangman", image: "/images/hangman.png" },
];

export default function GamesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const level = searchParams.get("level") || "1";
  const theme = searchParams.get("theme") || "Unknown";

  const handleGameClick = (gameId: string) => {
    // Route mapping:
    // - flashcards is nested under /games/flashcards
    // - memory and hangman live at top-level (/memory, /hangman)
    const qs = `?level=${level}&theme=${encodeURIComponent(theme)}`;
    if (gameId === "flashcards") {
      router.push(`/games/flashcards${qs}`);
      return;
    }

    // default: top-level route
    router.push(`/${gameId}${qs}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Road to Lv. {level === "1" ? "A1" : level === "2" ? "A2" : "B1"} › {theme}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleGameClick(game.id)}
            className="cursor-pointer"
          >
            <Card className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm hover:shadow-md bg[var(--medium-purple)]">
                <div className="relative w-16 h-16 mb-2">
                    <Image
                        src={game.image}
                        alt={game.name}
                        fill
                        className="object-contain rounded-lg"
                    />
                </div>
              <p className="text-sm font-medium text-gray-700">{game.name}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
