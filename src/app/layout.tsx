"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import XPBar from "@/components/XPBar";
import AuthHeader from "@/components/AuthHeader";
import "./globals.css";
import BottomNav from "@/app/main-menu";
import UserHeader from "@/components/UserHeader";
import { UserProvider } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <>
      {/* barre de navigation */}
      {!isHomepage && (
        <header className="p-2 sm:p-4 w-full">
          <div className="container mx-auto max-w-[700px] flex items-center justify-between px-2 sm:px-0">
            <UserHeader/>
          </div>
        </header>
      )}

      {/* contenu spécifique à chaque page */}
      <main>{children}</main>

      {/* footer global */}
      {!isHomepage && (
        <footer className="text-center text-sm p-2 sm:p-4 mt-6 flex-wrap items-center justify-center">
          <BottomNav/>
        </footer>
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "var(--medium-purple)" }}
      >
        <UserProvider>
          <LayoutContent>{children}</LayoutContent>
        </UserProvider>
      </body>
    </html>
  );
}
