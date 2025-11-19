"use client";

import { useEffect, useState } from "react";
import RoadmapStepper from "@/components/RoadmapStepper";

interface StepData {
  id: string;
  title: string;
  wordCount: number;
}

export default function HomeboardPage() {
  const [stepsByLevel, setStepsByLevel] = useState<Record<number, StepData[]>>({});
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const res = await fetch("/api/words");
      const data = await res.json();
      const words = data.words;

      const grouped: Record<number, Record<string, StepData>> = {};

      words.forEach((word: any) => {
        const level = word.category || 1;
        const theme = word.theme || "Unknown";
        if (!grouped[level]) grouped[level] = {};
        if (!grouped[level][theme]) {
          grouped[level][theme] = {
            id: themeToId(theme),
            title: theme,
            wordCount: 0,
          };
        }
        grouped[level][theme].wordCount++;
      });

      setStepsByLevel(
        Object.fromEntries(
          Object.entries(grouped).map(([level, themesObj]) => [
            Number(level),
            Object.values(themesObj),
          ])
        )
      );
    };

    fetchWords();
  }, []);

  // 🔐 Define titles and lock logic
  const levelTitles: Record<number, string> = {
    1: "Road to A1",
    2: "Road to A2",
    3: "Road to B1",
  };

  // Helper: check if a level is locked
  const isLocked = (level: number) => {
    if (level === 1) return false; // Level 1 always unlocked
    return !completedLevels.includes(level - 1); // locked if previous level not done
  };

  // Simulate marking a level completed (you can later replace this with real progress)
  const handleLevelComplete = (level: number) => {
    setCompletedLevels((prev) => Array.from(new Set([...prev, level])));
  };

  return (
    <div className="p-6 space-y-12">
      {Object.entries(stepsByLevel).map(([level, steps]) => {
        const lvl = Number(level);
        return (
          <div key={lvl} className="opacity-100 transition-all">
            <h2 className="text-xl font-bold mb-4">{levelTitles[lvl] || `Level ${lvl}`}</h2>

            <div className={isLocked(lvl) ? "opacity-50 pointer-events-none" : ""}>
              <RoadmapStepper
                steps={Object.values(steps)}
                locked={isLocked(lvl)}
                title={levelTitles[lvl]}
                level={lvl} 
                onComplete={() => handleLevelComplete(lvl)}
              />
            </div>

            {isLocked(lvl) && (
              <p className="text-sm text-gray-500 italic mt-2">
                🔒 Unlocks after completing Level {lvl - 1}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Utility: create id-friendly slugs
function themeToId(theme: string) {
  return theme
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
