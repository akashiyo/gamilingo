"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Profil from "@/script/profil.js";
import { useUser } from "@/contexts/UserContext";

export default function Page() {
    const { isAuthenticated, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) return null;
    if (!isAuthenticated) return null;

    return <Profil />;
}
