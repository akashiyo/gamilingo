"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";

type Step = {
  id: string;
  title: string;
  wordCount: number;
  image?: string;
  isCompleted?: boolean;
};

interface RoadmapStepperProps {
  steps: Step[];
  title?: string;
  locked?: boolean;
  onComplete?: () => void;
  level?: number;
  userLevel?: number; // The user's current level - determines if steps are accessible
  userXp?: number; // The user's total XP - determines how many steps are unlocked (1 step per 100 XP)
}

// XP thresholds per level (each level starts fresh)
const XP_PER_LEVEL = 500; // 500 XP to level up
const XP_PER_STEP = 100; // 1 step unlocked per 100 XP within the level

export default function RoadmapStepper({
  steps,
  title = "Road to Lv. B1",
  level = 1,
  locked,
  onComplete,
  userLevel = 1,
  userXp = 0,
}: RoadmapStepperProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(steps.map((s) => s.isCompleted || false));

  // User can access this level's steps only if their level >= this stepper's level
  const hasLevelAccess = userLevel >= level;

  // Calculate XP within this level to determine unlocked steps
  // For level 1: XP from 0-749, for level 2: XP from 750-1499, etc.
  const levelStartXp = (level - 1) * XP_PER_LEVEL;
  const xpInThisLevel = Math.max(0, userXp - levelStartXp);
  // Number of steps unlocked based on XP (1 step per 100 XP, minimum 1 if has access)
  const stepsUnlockedByXp = hasLevelAccess ? Math.max(1, Math.floor(xpInThisLevel / XP_PER_STEP) + 1) : 0;

  const handleStepClick = (index: number) => {
    // Use same XP-based unlock logic as rendering
    const isUnlocked = hasLevelAccess && index < stepsUnlockedByXp;
    if (!isUnlocked) return;

    const step = steps[index];
    router.push(`/games?level=${level}&theme=${encodeURIComponent(step.title)}`);
  };


  const handleStepComplete = (index: number) => {
    const newProgress = [...progress];
    newProgress[index] = true;
    setProgress(newProgress);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>

      <div className="relative border-l-2 border-dashed border-gray-400 pl-6">
        {steps.map((step, index) => {
          // Step is unlocked if user has level access AND step index < number of steps unlocked by XP
          const isUnlocked = hasLevelAccess && index < stepsUnlockedByXp;
          const isDone = progress[index];

          return (
            <motion.div
              key={step.id}
              className={`relative bg-gray-100 rounded-2xl p-4 mb-6 flex items-center gap-4 cursor-pointer shadow-sm transition-all ${
                !isUnlocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
              }`}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              onClick={() => handleStepClick(index)}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[33px] top-6 w-4 h-4 rounded-full border-2 border-gray-400" style={{ backgroundColor: "var(--dark-purple)" }} />

              {/* Image */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {step.image ? (
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">🗺️</div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.wordCount} mots</p>
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                ) : !isUnlocked ? (
                  <Lock className="text-gray-400 w-6 h-6" />
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
