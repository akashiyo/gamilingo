"use client";

import { useState } from "react";
import "../app/change-password/changePassword.css";

export default function ChangePassword() {
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return setMessage("Utilisateur non connecté.");
        const userId = JSON.parse(storedUser).id;

        if (!currentPwd || !newPwd || !confirmPwd) return setMessage("Veuillez remplir tous les champs.");
        if (newPwd !== confirmPwd) return setMessage("Les mots de passe ne correspondent pas.");

        setLoading(true);
        try {
            const response = await fetch(`/api/users/${userId}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPwd, newPwd }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Erreur API");

            setMessage("Mot de passe mis à jour !");
            setTimeout(() => (window.location.href = "/profil"), 1500);
        } catch (err) {
            setMessage("Erreur : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-page">
            <div className="change-password-card">
                <h2>Changer mon mot de passe</h2>

                <div className="password-form">
                    <input
                        type="password"
                        placeholder="Mot de passe actuel"
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirmer le nouveau mot de passe"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                    />
                </div>

                {message && <p className="message">{message}</p>}

                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Mise à jour..." : "Valider"}
                </button>

                <p className="back-link">
                    <a href="/profil">← Retour au profil</a>
                </p>
            </div>
        </div>
    );
}
