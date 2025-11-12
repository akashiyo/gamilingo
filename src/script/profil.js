"use client";

import { useEffect, useState } from "react";
import "../app/profil/profil.css";

export default function Profil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) throw new Error("Aucun utilisateur connecté.");
                const userId = JSON.parse(storedUser).id;

                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) throw new Error("Erreur API");
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur :", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (!user) return <p>Erreur : utilisateur introuvable.</p>;

    return (
        <section className="profile-container">
            <div className="profile-header">
                <img
                    src={
                        user.img && user.img.data
                            ? `data:image/png;base64,${Buffer.from(user.img.data).toString("base64")}`
                            : "/profil.svg"
                    }
                    alt="Profil"
                    className="profile-avatar"
                />
                <h2 className="profile-name">{user.username}</h2>
            </div>

            <div className="profile-badges">
                <div className="badge level-badge">
                    <img src="/fire.svg" alt="Fire" className="badge-icon" />
                    <p className="badge-text">Lv. {user.level}</p>
                </div>
                <div className="badge">
                    <img src="/language.svg" alt="English" className="badge-icon2" />
                </div>
            </div>

            <div className="profile-form">
                <input type="text" value={user?.name || ""} placeholder="Nom" className="form-input" />
                <input type="text" value={user?.username || ""} placeholder="Nom d'utilisateur" className="form-input" />
                <input type="text" value={user?.email || ""} placeholder="Email" className="form-input" />
            </div>

            <div className="profile-action">
                <button className="validate-btn">Valider</button>
            </div>

            <div className="profile-links">
                <a href="/change-password" className="profile-link">
                    Changer mon mot de passe<span className="link-arrow">›</span>
                </a>
                <a href="/delete-account" className="profile-link">
                    Supprimer mon compte<span className="link-arrow">›</span>
                </a>
            </div>
        </section>
    );
}
