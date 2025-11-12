"use client";

import { useState } from "react";
import "../app/profil/profil.css"; // tu peux réutiliser ton CSS existant pour la mise en forme

export default function DeleteAccount() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    async function handleDelete() {
        const confirm = window.confirm("Voulez-vous vraiment supprimer votre compte ?");
        if (!confirm) return;

        setLoading(true);
        setError(null);

        try {
            // Exemple d'appel : adapte selon ton backend
            const response = await fetch("http://localhost:3000/api/user/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    // inclure le token si nécessaire :
                    // Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression");

            setSuccess(true);

            // (optionnel) déconnexion après suppression :
            localStorage.removeItem("token");
            setTimeout(() => {
                window.location.href = "/"; // redirection page d'accueil
            }, 2000);

        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de la suppression du compte.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <section className="profile-container">
                <h2>Compte supprimé avec succès.</h2>
                <p>Vous allez être redirigé vers la page d'accueil.</p>
            </section>
        );
    }

    return (
        <section className="profile-container">
            <h2>Supprimer mon compte</h2>
            <p>Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="profile-action">
                <button
                    className="validate-btn"
                    onClick={handleDelete}
                    disabled={loading}
                    style={{ backgroundColor: "#d9534f", color: "white", borderColor: "#d9534f" }}
                >
                    {loading ? "Suppression..." : "Oui, je suis sûr"}
                </button>
            </div>

            <div className="profile-action">
                <button
                    className="validate-btn"
                    onClick={() => (window.location.href = "/profile")}
                >
                    Non, annuler
                </button>
            </div>
        </section>
    );
}
