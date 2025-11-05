"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pwd }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.msg || "Login failed");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          Log in
        </button>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
