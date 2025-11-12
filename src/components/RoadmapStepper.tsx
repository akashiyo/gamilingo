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
}

export default function RoadmapStepper({ steps, title = "Road to Lv. B1" }: RoadmapStepperProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(steps.map((s) => s.isCompleted || false));

  const handleStepClick = (index: number) => {
    const isUnlocked = index === 0 || progress[index - 1];
    if (!isUnlocked) return;

    // Simulate navigation to a game page
    router.push(`/games/${steps[index].id}`);
  };

  const handleStepComplete = (index: number) => {
    const newProgress = [...progress];
    newProgress[index] = true;
    setProgress(newProgress);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>

      <div className="relative border-l-2 border-dashed border-gray-300 pl-6">
        {steps.map((step, index) => {
          const isUnlocked = index === 0 || progress[index - 1];
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
              <div className="absolute -left-[38px] top-6 w-4 h-4 rounded-full border-2 border-gray-400 bg-white" />

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
