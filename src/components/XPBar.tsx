"use client";
import React from "react";
import { useUser } from "@/contexts/UserContext";

const XP_PER_LEVEL = 750; // should match backend computation

export default function XPBar() {
  const { user, loading, isAuthenticated } = useUser();

  if (loading) return <div className="ml-auto pr-4 text-gray-700">Loading...</div>;
  if (!isAuthenticated || !user) return null;

  const { xp, level } = user;
  const currentLevelBase = (level - 1) * XP_PER_LEVEL;
  const nextLevelBase = level * XP_PER_LEVEL;
  const progressInLevel = Math.max(0, xp - currentLevelBase);
  const toNext = Math.max(0, nextLevelBase - xp);
  const percent = Math.max(0, Math.min(100, Math.round((progressInLevel / XP_PER_LEVEL) * 100)));

  return (
    <div className="ml-auto flex items-center gap-3 pr-4" aria-live="polite">
      <div className="text-sm text-gray-700">Lvl {level}</div>
      <div className="w-48 bg-gray-300 rounded overflow-hidden h-4">
        <div className="bg-emerald-400 h-4" style={{ width: `${percent}%` }} />
      </div>
      <div className="text-xs text-gray-700 opacity-90">{xp} XP · {toNext} to next</div>
    </div>
  );
}
