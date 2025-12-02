"use client";
import React from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useUser } from "@/contexts/UserContext";

export default function AuthHeader() {
  const { isAuthenticated, loading } = useUser();

  // While loading, render basic public links to avoid flicker
  if (loading) {
    return (
      <nav className="flex gap-4 items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/words" className="hover:underline">
          Words
        </Link>
        <Link href="/ai-chat" className="hover:underline">
          AI Chat
        </Link>
      </nav>
    );
  }

  // not authenticated: only show public pages
  if (!isAuthenticated) {
    return (
      <nav className="flex gap-4 items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/words" className="hover:underline">
          Words
        </Link>
        <Link href="/ai-chat" className="hover:underline">
          AI Chat
        </Link>
        <Link href="/signup" className="hover:underline">
          Sign-up
        </Link>
        <Link href="/login" className="hover:underline">
          Login
        </Link>
      </nav>
    );
  }

  // authenticated: restricted links per request
  return (
    <nav className="flex gap-4 items-center">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      <Link href="/words" className="hover:underline">
        Words
      </Link>
      <Link href="/ai-chat" className="hover:underline">
        AI Chat
      </Link>
      <Link href="/homeboard" className="hover:underline">
        Homeboard
      </Link>
      <Link href="/games/flashcards" className="hover:underline">
        Flashcards
      </Link>
      <Link href="/profil" className="hover:underline">
        Profil
      </Link>
      <LogoutButton />
    </nav>
  );
}
