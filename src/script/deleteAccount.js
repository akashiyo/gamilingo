"use client";

import { useState, useEffect } from "react";
import "../app/delete-account/deleteAccount.css";

export default function DeleteAccount() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) throw new Error("Aucun utilisateur connecté.");
                const userId = JSON.parse(storedUser).id;

                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) throw new Error("Erreur API utilisateur");
                const data = await response.json();
                setUser(data.user || data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger l'utilisateur connecté.");
            }
        }
        fetchUser();
    }, []);

    async function handleDelete() {
        if (!user) return alert("Utilisateur non chargé.");

        const confirm = window.confirm(`Voulez-vous vraiment supprimer votre compte (${user.username}) ?`);
        if (!confirm) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression");

            setSuccess(true);
            localStorage.removeItem("user");
            setTimeout(() => (window.location.href = "/"), 2000);
        } catch (err) {
            setError("Une erreur est survenue lors de la suppression du compte.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="delete-page">
                <div className="delete-card">
                    <h2>Compte supprimé avec succès</h2>
                    <p>Vous allez être redirigé vers la page d’accueil.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="delete-page">
            <div className="delete-card">
                <h2>Supprimer mon compte</h2>

                {!user ? (
                    <p>Chargement des informations...</p>
                ) : (
                    <p>
                        Voulez-vous vraiment supprimer le compte <strong>{user.username}</strong> ?
                        <br />
                        <span className="danger-text">Cette action est irréversible.</span>
                    </p>
                )}

                {error && <p className="error-text">{error}</p>}

                <div className="delete-actions">
                    <button className="btn-danger" onClick={handleDelete} disabled={loading}>
                        {loading ? "Suppression..." : "Oui, je suis sûr"}
                    </button>

                    <button className="btn-cancel" onClick={() => (window.location.href = "/profil")}>
                        Non, annuler
                    </button>
                </div>
            </div>
        </div>
    );
}
