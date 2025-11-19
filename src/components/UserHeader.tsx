"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function UserHeader() {
    const [user, setUser] = useState<any>(null);

    // fonction pour charger l'utilisateur depuis localStorage
    const loadUserFromStorage = () => {
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
    };

    useEffect(() => {
        // 1ᵉʳ chargement
        loadUserFromStorage();

        // écoute l'évènement "user-updated"
        const handler = () => loadUserFromStorage();
        window.addEventListener("user-updated", handler);

        return () => {
            window.removeEventListener("user-updated", handler);
        };
    }, []);

    if (!user) return null;

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
