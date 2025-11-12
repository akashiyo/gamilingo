"use client";

import { useEffect, useState } from "react";
import "../app/profil/profil.css";

export default function Profil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                // Exemple d’appel : adapte selon ton backend
                const response = await fetch("/api/users");
                if (!response.ok) throw new Error("Erreur API");
                const data = await response.json();
                setUser(data);
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
            {/* En-tête avec avatar et username */}
            <div className="profile-header">
                <img src={user.profileImage || "/profil.svg"} alt="Profil"/>
                <h2 className="profile-name">{user.username}</h2>
            </div>

            {/* Badges niveau et rôle */}
            <div className="profile-badges">
                <div className="badge level-badge">
                    <img src="/fire.svg" alt="Fire" className="badge-icon" />
                    <p className="badge-text">Lv. {user.level}</p>
                </div>
                <div className="badge">
                    <img src="/language.svg" alt="English" className="badge-icon2"/>
                </div>
            </div>

            {/* Champs de formulaire */}
            <div className="profile-form">
                <input
                    type="text"
                    value={user.name}
                    placeholder="Nom"
                    className="form-input"
                    readOnly
                />
                <input
                    type="text"
                    value={user.username}
                    placeholder="Nom d'utilisateur"
                    className="form-input"
                    readOnly
                />
                <input
                    type="text"
                    value={`Email : ${user.mail}`}
                    className="form-input"
                    readOnly
                />
            </div>

            {/* Bouton valider */}
            <div className="profile-action">
                <button className="validate-btn">Valider</button>
            </div>

            {/* Liens */}
            <div className="profile-links">
                <a href="/change-password" className="profile-link">
                    Changer mon mot de passe
                    <span className="link-arrow">›</span>
                </a>
                <a href="/delete-account" className="profile-link">
                    Supprimer mon compte
                    <span className="link-arrow">›</span>
                </a>
            </div>
        </section>
    );
}
