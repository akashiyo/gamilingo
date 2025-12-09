"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/cards";
import { motion } from "framer-motion";
import Image from "next/image";

const games = [
  { id: "memory", name: "Memory Game", image: "/images/memory.png" },
  { id: "hangman", name: "Hangman", image: "/images/hangman.png" },
];

export default function GamesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const level = searchParams.get("level") || "1";
  const theme = searchParams.get("theme") || "Unknown";

  const handleGameClick = (gameId: string) => {
    const qs = `?level=${level}&theme=${encodeURIComponent(theme)}`;
    router.push(`/${gameId}${qs}`);
  };

  return (
    <div className="p-4">
      <div className="container mx-auto max-w-[700px]">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Road to Lv. {level === "1" ? "A1" : level === "2" ? "A2" : "B1"} › {theme}
        </h2>

        <div className="flex flex-col gap-6 mt-6">
          {games.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleGameClick(game.id)}
              className="cursor-pointer"
            >
              <Card className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-sm hover:shadow-md bg[var(--medium-purple)]">
                  <div className="relative w-24 h-24 mb-4">
                      <Image
                          src={game.image}
                          alt={game.name}
                          fill
                          className="object-contain rounded-lg"
                      />
                  </div>
                <p className="text-base font-medium text-gray-700">{game.name}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
