"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

type AuthState = { xp?: number; level?: number } | null;

export default function AuthHeader() {
  const [auth, setAuth] = useState<AuthState>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuth = async () => {
    try {
      const res = await fetch("/api/xp", { credentials: "include" });
      if (!res.ok) {
        setAuth(null);
      } else {
        const json = await res.json();
        setAuth({ xp: Number(json.xp || 0), level: Number(json.level || 1) });
      }
    } catch (e) {
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuth();
    const onUpdate = () => fetchAuth();
    window.addEventListener("xp-updated", onUpdate as EventListener);
    return () => window.removeEventListener("xp-updated", onUpdate as EventListener);
  }, []);

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
  if (!auth) {
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
