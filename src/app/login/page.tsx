"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, refreshUser, isAuthenticated, loading } = useUser();
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pwd }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed");
        return;
      }

      // Set initial user data, then refresh to get complete data (including image)
      setUser(data.user);
      await refreshUser();
      
      router.push("/profil");

    } catch (err) {
      setError("Erreur réseau ou serveur.");
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/homeboard");
    }
  }, [loading, isAuthenticated]);

  return (
      <div className="min-h-screen flex items-center justify-center px-4" 
           style={{ backgroundColor: 'var(--medium-purple)' }}>
        <div className="w-full max-w-md">
          <form
              onSubmit={handleLogin}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl"
          >
            {/* Logo or Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2" 
                  style={{ color: 'var(--dark-purple)' }}>
                Gamilingo
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connectez-vous pour continuer
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Nom d'utilisateur
                </label>
                <input
                    id="username"
                    type="text"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                    style={{ 
                      '--tw-ring-color': 'var(--dark-purple)',
                      '--tw-ring-offset-color': 'white'
                    } as React.CSSProperties}
                    required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Mot de passe
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                    style={{ 
                      '--tw-ring-color': 'var(--dark-purple)',
                      '--tw-ring-offset-color': 'white'
                    } as React.CSSProperties}
                    required
                />
              </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white mt-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: 'var(--dark-purple)' }}
            >
              Se connecter
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{" "}
                <a 
                  href="/signup" 
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: 'var(--dark-purple)' }}
                >
                  Inscrivez-vous
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
}
