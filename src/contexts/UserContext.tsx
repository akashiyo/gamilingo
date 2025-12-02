"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// User type matching Prisma schema
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  img?: string; // base64 encoded image
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateXP: (xp: number, level: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API
  const fetchUserData = useCallback(async (): Promise<User | null> => {
    try {
      // First check if authenticated via XP endpoint
      const xpRes = await fetch("/api/xp", { credentials: "include" });
      if (!xpRes.ok) {
        return null;
      }

      const xpData = await xpRes.json();
      const userId = xpData.id;

      // Fetch full user details
      const userRes = await fetch(`/api/users/${userId}`, { credentials: "include" });
      if (!userRes.ok) {
        return null;
      }

      const userData = await userRes.json();
      const fullUser = userData.user;

      // Convert image buffer to base64 if exists
      let imgBase64: string | undefined;
      if (fullUser.img && fullUser.img.data) {
        if (typeof Buffer !== "undefined") {
          imgBase64 = Buffer.from(fullUser.img.data).toString("base64");
        } else {
          // Browser environment fallback
          const bytes = new Uint8Array(fullUser.img.data);
          let binary = "";
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgBase64 = btoa(binary);
        }
      }

      return {
        id: fullUser.id,
        name: fullUser.name,
        username: fullUser.username,
        email: fullUser.email,
        role: fullUser.role,
        level: xpData.level || fullUser.level || 1,
        xp: xpData.xp || fullUser.xp || 0,
        img: imgBase64,
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }, []);

  // Load user from localStorage and sync with API
  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      // Try to get from localStorage first for instant load
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserState(parsed);
      }

      // Then fetch fresh data from API
      const freshUser = await fetchUserData();
      if (freshUser) {
        setUserState(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      } else {
        // Not authenticated, clear state
        setUserState(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUserState(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, [fetchUserData]);

  // Set user and persist to localStorage
  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
    // Dispatch events for backward compatibility
    window.dispatchEvent(new Event("user-updated"));
    window.dispatchEvent(new Event("xp-updated"));
  }, []);

  // Refresh user data from API
  const refreshUser = useCallback(async () => {
    const freshUser = await fetchUserData();
    setUser(freshUser);
  }, [fetchUserData, setUser]);

  // Update XP values without full refresh
  const updateXP = useCallback((xp: number, level: number) => {
    setUserState((prev) => {
      if (!prev) return null;
      const updated = { ...prev, xp, level };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new Event("xp-updated"));
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  }, [setUser]);

  // Initial load
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Listen for user update events (for backward compatibility)
  useEffect(() => {
    const handleUserUpdate = () => {
      loadUser();
    };

    const handleXPUpdate = async () => {
      // When XP is updated, fetch fresh XP data and update user
      try {
        const res = await fetch("/api/xp", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          updateXP(data.xp, data.level);
        }
      } catch (error) {
        console.error("Error updating XP:", error);
      }
    };
    
    window.addEventListener("user-updated", handleUserUpdate);
    window.addEventListener("xp-updated", handleXPUpdate);
    
    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
      window.removeEventListener("xp-updated", handleXPUpdate);
    };
  }, [loadUser, updateXP]);

  const value: UserContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    setUser,
    refreshUser,
    logout,
    updateXP,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
