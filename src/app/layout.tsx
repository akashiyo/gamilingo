import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"; // pour créer des liens entre pages
import XPBar from "@/components/XPBar";
import AuthHeader from "@/components/AuthHeader";
import "./globals.css";
import BottomNav from "@/app/main-menu";
import UserHeader from "@/components/UserHeader";
import { UserProvider } from "@/contexts/UserContext";



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
        style={{ backgroundColor: "var(--medium-purple)" }}
      >
        <UserProvider>
          {/* barre de navigation */}
          <header className="p-4">
            <div className="container mx-auto flex items-center justify-between">
              {/* <AuthHeader /> */}
              {/* <XPBar /> */}
              <UserHeader/>
            </div>
          </header>

          {/* contenu spécifique à chaque page */}
          <main>{children}</main>


          {/* footer global */}
          <footer className="text-center text-sm p-4 mt-6 flex-wrap items-center justify-center">
            <BottomNav/>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
