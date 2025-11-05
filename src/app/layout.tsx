import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"; // pour créer des liens entre pages
import "./globals.css";
import BottomNav from "@/app/main-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gamilingo",
  description: "Learning words with fun 🐉",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* barre de navigation */}
        <header className="bg-gray-800 text-white p-4">
          <nav className="flex gap-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/words" className="hover:underline">
              Words
            </Link>
            <Link href="/ai-chat" className="hover:underline">
              AI Chat
            </Link>
            <Link href="/hangman" className="hover:underline">
              Hangman
            </Link>
            <Link href="/memory" className="hover:underline">
              Memory
            </Link>
            <Link href="/flashcards" className="hover:underline">
              Flashcards
            </Link>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Sign-up
            </Link>
          </nav>
        </header>

        {/* contenu spécifique à chaque page */}
        <main className="p-6">{children}</main>


        {/* footer global */}
        <footer className="text-center text-sm p-4 mt-6 flex-wrap items-center justify-center">
          <BottomNav/>
        </footer>
      </body>
    </html>
  );
}
