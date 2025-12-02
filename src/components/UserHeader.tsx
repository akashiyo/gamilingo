"use client";

import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

export default function UserHeader() {
    const { user, isAuthenticated } = useUser();

    if (!isAuthenticated || !user) return null;

    return (
        <div className="user-header-container">
            <div className="user-header-left">
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
