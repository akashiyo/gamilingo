"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import XPBar from "@/components/XPBar";

export default function UserHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useUser();

    const isHomeboard = pathname === "/homeboard";

    if (!isAuthenticated || !user) return null;

    return (
        <div className="user-header-container">
            <div className="user-header-left">
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
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <img
                    src={
                        user.img
                            ? `data:image/png;base64,${user.img}`
                            : "/profil.svg"
                    }
                    alt="profil"
                    className="user-header-avatar"
                />

                <span className="user-header-username">{user.username}</span>
            </div>

            <div className="user-header-center">
                <XPBar />
            </div>

            <div className="user-header-right">
                <div className="level-box">
                    <img src="/fire.svg" alt="Fire" className="badge-icon" />
                    <p className="badge-text">Lv. {user.level}</p>
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
