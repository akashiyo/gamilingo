"use client";

import {useEffect, useState} from "react";
import { useUser } from "@/contexts/UserContext";
import "./AvatarCustomizer.css";
import { useRouter } from "next/navigation";


const categories = [
    { key: "eyes", icon: "/images/avatar/menu/eyes.svg" },
    { key: "mouth", icon: "/images/avatar/menu/mouth.svg" },
    { key: "hair", icon: "/images/avatar/menu/hair.svg" },
    { key: "top", icon: "/images/avatar/menu/top.svg" },
    { key: "hat", icon: "/images/avatar/menu/hat.svg" },
    { key: "ears", icon: "/images/avatar/menu/ears.svg" },
];

const options: Record<string, string[]> = {
    eyes: ["eyes_1", "eyes_2", "eyes_3", "eyes_4", "eyes_5", "eyes_6", "eyes_7", "eyes_8", "eyes_9", "eyes_10"],
    mouth: ["mouth_1", "mouth_2", "mouth_3", "mouth_4", "mouth_5"],
    hair: ["hair_1", "hair_2"],
    top: ["top_1", "top_2", "top_3", "top_4"],
    hat: ["hat_1", "hat_2", "hat_3", "hat_4"],
    ears: ["ears_1", "ears_2", "ears_3", "ears_4"],
};

export default function AvatarCustomizer() {
    const { user } = useUser();   // <-- USER CONNECTÉ
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState("eyes");

    const [avatar, setAvatar] = useState({
        eyes: "eyes_1",
        mouth: "mouth_1",
        hair: "hair_1",
        hat: "none",
        top: "top_1",
        ears: "ears_1",
    });

    async function saveAvatar() {
        if (!user) {
            alert("Utilisateur non connecté !");
            return;
        }

        const res = await fetch("/api/avatar/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                ...avatar
            }),
        });

        if (res.ok) {
            alert("Avatar enregistré !");

            // 🔥 Redirection vers la page profil
            router.push("/profil");

        } else {
            alert("Erreur lors de l’enregistrement.");
        }
    }

    useEffect(() => {
        async function loadAvatar() {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;

            const userId = JSON.parse(storedUser).id;

            const res = await fetch(`/api/avatar/${userId}`);
            if (!res.ok) return; // pas encore d'avatar

            const data = await res.json();
            if (data.avatar) {
                setAvatar(data.avatar);
            }
        }

        loadAvatar();
    }, []);

    return (
        <div className="avatar-container">
            {/* Aperçu */}
            <div className="avatar-preview-bg">
                <div className="avatar-preview">
                    <img src={`/images/avatar/eyes/${avatar.eyes}.svg`} className="eyes"/>
                    <img src={`/images/avatar/mouth/${avatar.mouth}.svg`} className="mouth"/>
                    <img src={`/images/avatar/ears/${avatar.ears}.svg`} className="ears"/>
                    <img src={`/images/avatar/hair/${avatar.hair}.svg`} className="hair"/>

                    {avatar.hat !== "none" && (
                        <img
                            src={`/images/avatar/hat/${avatar.hat}.svg`}
                            className={`hat hat-${avatar.hat}`}
                        />
                    )}

                    <img
                        src={`/images/avatar/top/${avatar.top}.svg`}
                        className={`top top-${avatar.top}`}
                    />
                </div>
            </div>

            {/* Catégories */}
            <div className="category-bar">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        className={selectedCategory === cat.key ? "category-btn active" : "category-btn"}
                        onClick={() => setSelectedCategory(cat.key)}
                    >
                        <img src={cat.icon} className="category-icon"/>
                    </button>
                ))}
            </div>

            {/* Options */}
            <div className="options-grid">
                {options[selectedCategory].map((opt) => (
                    <button
                        key={opt}
                        className={
                            avatar[selectedCategory] === opt
                                ? "option-btn option-selected"
                                : "option-btn"
                        }
                        onClick={() =>
                            setAvatar((prev) => ({ ...prev, [selectedCategory]: opt }))
                        }
                    >
                        <img
                            src={`/images/avatar/${selectedCategory}/${opt}.svg`}
                            className="option-img"
                        />
                    </button>
                ))}
            </div>

            <button className="validate-btn" onClick={saveAvatar}>

                Valider mon avatar
            </button>

        </div>
    );
}
