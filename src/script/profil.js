"use client";

import { useEffect, useState } from "react";
import "../app/profil/profil.css";

export default function Profil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
    });

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
                setFormData({
                    name: data.user.name || "",
                    username: data.user.username || "",
                    email: data.user.email || "",
                });
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur :", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    // 📌 Fonction pour envoyer les modifications à l'API
    async function handleSubmit() {
        if (!user) return;

        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("username", formData.username);
        payload.append("email", formData.email);

        if (selectedImage) {
            payload.append("img", selectedImage);
        }

        const response = await fetch(`/api/users/${user.id}`, {
            method: "PUT",
            body: payload,
        });

        if (response.ok) {
            alert("Profil mis à jour !");
            window.location.reload();
        } else {
            alert("Erreur lors de la mise à jour");
        }
    }

    if (loading) return <p>Chargement...</p>;
    if (!user) return <p>Erreur : utilisateur introuvable.</p>;

    return (
        <section className="profile-container">

            {/* Avatar cliquable pour changer l'image */}
            <div className="profile-header">
                <label htmlFor="avatar-upload">
                    <img
                        src={
                            selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : user.img && user.img.data
                                    ? `data:image/png;base64,${Buffer.from(user.img.data).toString("base64")}`
                                    : "/profil.svg"
                        }
                        alt="Profil"
                        className="profile-avatar cursor-pointer"
                    />
                </label>

                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                />

                <h2 className="profile-name">{formData.username}</h2>
            </div>
            <div className="profile-badges">
                <div className="badge level-badge">
                    <img src="/fire.svg" alt="Fire" className="badge-icon"/>
                    <p className="badge-text">Lv. {user.level}</p>
                </div>
                <div className="badge">
                    <img src="/language.svg" alt="English" className="badge-icon2"/>
                </div>
            </div>
            <div className="profile-form">
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nom"
                    className="form-input"
                />

                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Nom d'utilisateur"
                    className="form-input"
                />

                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Email"
                    className="form-input"
                />
            </div>

            <div className="profile-action">
                <button className="validate-btn" onClick={handleSubmit}>
                    Valider
                </button>
            </div>

            <div className="profile-links">
                <a href="/change-password" className="profile-link">
                    Changer mon mot de passe<span className="link-arrow">›</span>
                </a>

                <a href="/delete-account" className="profile-link">
                    Supprimer mon compte<span className="link-arrow">›</span>
                </a>
            </div>

            <button
                className="logout-btn profile-links"
                onClick={() => {
                    localStorage.removeItem("user");

                    // mettre à jour le header
                    window.dispatchEvent(new Event("user-updated"));

                    // redirection
                    window.location.href = "/login";
                }}
            >
                Se déconnecter
            </button>

        </section>
    );
}
