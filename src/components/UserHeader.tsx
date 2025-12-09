"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import XPBar from "@/components/XPBar";
import AvatarMini from "@/components/AvatarMini";

export default function UserHeader() {
    const router = useRouter();
    const pathname = usePathname();

    const isHomeboard = pathname === "/homeboard";
    const isGamePage = pathname.startsWith("/hangman") || pathname.startsWith("/memory") || pathname.startsWith("/flashcards");

    const { user, isAuthenticated, loading } = useUser();

    if (loading) return null;
    if (!isAuthenticated || !user) return null;

    return (
        <div className={`w-full bg-white p-4 sm:p-[17px_20px] shadow-sm max-w-[700px] mx-auto rounded-xl mt-2.5 flex items-center justify-between gap-2 ${isGamePage ? 'flex-wrap' : ''}`}>
            <div className="flex flex-row items-center gap-2.5 order-1">

                {/* BOUTON RETOUR */}
                {!isHomeboard && (
                    <button
                        onClick={() => router.back()}
                        className="bg-transparent border-none cursor-pointer p-1.5 rounded-full flex items-center justify-center text-[#333] hover:bg-black/8 active:bg-black/12 transition-colors"
                        aria-label="Go back"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                )}

                {/* ⭐ AVATAR MINI (version identique à la page profil) ⭐ */}
                <div onClick={() => router.push("/avatar")} className="cursor-pointer">
                        <AvatarMini avatar={user.avatar} />

                </div>

                <span className="text-sm font-semibold text-[#222]">{user.username}</span>
            </div>

            <div className={`flex items-center justify-center flex-1 order-2 ${isGamePage ? 'w-full sm:w-auto' : ''} ${!isGamePage ? 'hidden sm:flex' : ''}`}>
                <XPBar />
            </div>

            <div className={`flex items-center gap-2.5 order-3 justify-center sm:justify-end ${isGamePage ? 'w-full sm:w-auto' : ''}`}>
                <div className="level-box">
                    <img src="/fire.svg" alt="Fire" className="badge-icon" />
                    <p className="badge-text dark:text-black">Lv. {user.level}</p>
                </div>

                <Image
                    src="/language.svg"
                    width={30}
                    height={20}
                    alt="language"
                />
            </div>
        </div>
    );
}
