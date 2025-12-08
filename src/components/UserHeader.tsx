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

    const { user, isAuthenticated, loading } = useUser();

    if (loading) return null;
    if (!isAuthenticated || !user) return null;

    return (
        <div className="user-header-container">
            <div className="user-header-left">

                {/* BOUTON RETOUR */}
                {!isHomeboard && (
                    <button
                        onClick={() => router.back()}
                        className="back-button"
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

                <span className="user-header-username">{user.username}</span>
            </div>

            <div className="user-header-center">
                <XPBar />
            </div>

            <div className="user-header-right">
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
