"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useUser } from "@/contexts/UserContext";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = async () => {
    try {
      // Wait for logout to complete before navigating
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Use hard navigation to ensure complete state reset
      window.location.href = "/login";
    }
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
