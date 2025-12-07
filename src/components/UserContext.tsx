"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const stored = localStorage.getItem("user");
                if (!stored) {
                    setLoading(false);
                    return;
                }

                const parsed = JSON.parse(stored);

                // 🎯 Charger le user complet (incl avatar)
                const res = await fetch(`/api/users/${parsed.id}`);
                if (!res.ok) throw new Error("Unauthorized");

                const data = await res.json();

                setUser(data.user);
                setIsAuthenticated(true);
            } catch (e) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, isAuthenticated, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
