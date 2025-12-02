"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (e) {
      // ignore
    }
    router.push("/login");
    // notify XPBar and other listeners
    window.dispatchEvent(new Event("xp-updated"));
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ml-3"
    >
      Déconnexion
    </button>
  );
}
