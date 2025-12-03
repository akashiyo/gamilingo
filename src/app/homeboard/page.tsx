"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoadmapStepper from "@/components/RoadmapStepper";
import { useUser } from "@/contexts/UserContext";

interface StepData {
  id: string;
  title: string;
  wordCount: number;
}

export default function HomeboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useUser();
  const [stepsByLevel, setStepsByLevel] = useState<Record<number, StepData[]>>({});
  useEffect(() => {
    if (loading) return;
    
    // Check authentication
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

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
  }, [user, isAuthenticated, loading, router]);

  // 🔐 Define titles for each level
  const levelTitles: Record<number, string> = {
    1: "Road to A1",
    2: "Road to A2",
    3: "Road to B1",
  };

  // Get user's current level and XP (default to 1 and 0)
  const userLevel = user?.level || 1;
  const userXp = user?.xp || 0;

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12 min-h-screen" style={{ backgroundColor: "var(--medium-purple)" }}>
      {Object.entries(stepsByLevel).map(([level, steps]) => {
        const lvl = Number(level);
        const isLevelLocked = userLevel < lvl;
        return (
          <div key={lvl} className="opacity-100 transition-all">
            <RoadmapStepper
              steps={Object.values(steps)}
              title={levelTitles[lvl]}
              level={lvl}
              userLevel={userLevel}
              userXp={userXp}
            />

            {isLevelLocked && (
              <p className="text-sm text-gray-500 italic mt-2">
                🔒 Reach Level {lvl} to unlock these steps
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
