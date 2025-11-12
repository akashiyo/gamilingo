"use client";

import RoadmapStepper from "@/components/RoadmapStepper";

import { useEffect, useState } from "react";

interface StepData {
  id: string;
  title: string;
  wordCount: number;
}

export default function HomeboardPage() {
  const [stepsByLevel, setStepsByLevel] = useState<Record<number, StepData[]>>({});

  useEffect(() => {
    const fetchWords = async () => {
      const res = await fetch("/api/words");
      const data = await res.json();
      const words = data.words;

      // Group words par theme et par niveau (category)
      const grouped: Record<number, Record<string, StepData>> = {};

      words.forEach((word: any) => {
        const level = word.category || 1; // category = niveau
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
        Number(level), // clé level
        Object.values(themesObj), // on convertit l'objet de thèmes en tableau
    ])
  )
);

    };

    fetchWords();
  }, []);

  return (
    <div className="p-6 space-y-12">
      {Object.entries(stepsByLevel).map(([level, steps]) => (
        <div key={level}>
          <h2 className="text-xl font-bold mb-4">Level {level}</h2>
          <RoadmapStepper steps={Object.values(steps)} />
        </div>
      ))}
    </div>
  );
}

// Fonction utilitaire pour transformer un thème en ID friendly
function themeToId(theme: string) {
  return theme
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
