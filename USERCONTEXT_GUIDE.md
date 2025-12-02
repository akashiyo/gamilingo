# UserContext Usage Guide

## Overview
The UserContext provides centralized state management for user information across the Gamilingo application. It replaces scattered localStorage usage with a unified React Context API solution.

## Features
- ✅ Centralized user state management
- ✅ Automatic persistence to localStorage
- ✅ API synchronization on mount and updates
- ✅ XP and level tracking
- ✅ Backward compatibility with existing event system
- ✅ TypeScript type safety

## Setup
The UserContext is already integrated into the root layout at `src/app/layout.tsx`:

```tsx
import { UserProvider } from "@/contexts/UserContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
```

## Usage in Components

### Basic Usage - Access User Data

```tsx
"use client";
import { useUser } from "@/contexts/UserContext";

export default function MyComponent() {
  const { user, isAuthenticated, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Level: {user.level} | XP: {user.xp}</p>
      {user.img && <img src={`data:image/png;base64,${user.img}`} alt="Profile" />}
    </div>
  );
}
```

### User Type Definition

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  img?: string; // base64 encoded image
}
```

### Available Context Values

```typescript
interface UserContextType {
  user: User | null;              // Current user data
  loading: boolean;               // Loading state during initial fetch
  isAuthenticated: boolean;       // Quick auth check
  setUser: (user: User | null) => void;  // Manually set user (e.g., after login)
  refreshUser: () => Promise<void>;      // Refresh user from API
  logout: () => Promise<void>;           // Logout and clear user
  updateXP: (xp: number, level: number) => void;  // Update XP without full refresh
}
```

## Common Use Cases

### 1. Login Flow

```tsx
"use client";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (username: string, pwd: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pwd }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);  // ✅ Updates context and localStorage
      router.push("/profil");
    }
  };

  return (/* login form */);
}
```

### 2. Logout

```tsx
"use client";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();  // ✅ Calls API, clears context and localStorage
    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 3. Protected Routes

```tsx
"use client";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

### 4. Update XP After Game Completion

```tsx
"use client";
import { useUser } from "@/contexts/UserContext";

export default function GameComponent() {
  const { user, updateXP } = useUser();

  const handleGameComplete = async () => {
    // Award XP via API
    const res = await fetch("/api/xp/award", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        game: "flashcards", 
        level: user?.level || 1, 
        theme: "Foods" 
      }),
    });

    if (res.ok) {
      const data = await res.json();
      // ✅ Update local state immediately
      updateXP(data.newXp, data.newLevel);
      
      // OR dispatch event for backward compatibility
      window.dispatchEvent(new Event("xp-updated"));
    }
  };

  return <button onClick={handleGameComplete}>Complete Game</button>;
}
```

### 5. Refresh User Data

```tsx
"use client";
import { useUser } from "@/contexts/UserContext";

export default function ProfilePage() {
  const { user, refreshUser } = useUser();

  const handleProfileUpdate = async (formData: FormData) => {
    const res = await fetch(`/api/users/${user?.id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      // ✅ Refresh user data from API
      await refreshUser();
    }
  };

  return (/* profile form */);
}
```

## Event System (Backward Compatibility)

The UserContext maintains compatibility with the existing event-driven system:

### Events Dispatched by UserContext
- `user-updated` - Fired when user data changes
- `xp-updated` - Fired when XP is updated

### Events Listened by UserContext
- `user-updated` - Triggers full user reload
- `xp-updated` - Triggers XP refresh from API

## Migration Guide

### Before (Old Pattern)
```tsx
// ❌ Old way - scattered localStorage usage
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;

// Manual event listening
useEffect(() => {
  const handler = () => {
    const userStr = localStorage.getItem("user");
    setUser(userStr ? JSON.parse(userStr) : null);
  };
  window.addEventListener("user-updated", handler);
  return () => window.removeEventListener("user-updated", handler);
}, []);
```

### After (New Pattern)
```tsx
// ✅ New way - use UserContext
import { useUser } from "@/contexts/UserContext";

const { user, isAuthenticated, loading } = useUser();
// No manual localStorage or event handling needed!
```

## Best Practices

1. **Always check loading state**: Prevents flickering and premature redirects
   ```tsx
   if (loading) return <LoadingSpinner />;
   ```

2. **Use isAuthenticated for quick checks**: More readable than `!!user`
   ```tsx
   if (!isAuthenticated) return <LoginPrompt />;
   ```

3. **Use updateXP for XP changes**: Faster than full refresh
   ```tsx
   updateXP(newXp, newLevel); // ✅ Fast
   await refreshUser();       // ⚠️ Slower but updates all fields
   ```

4. **Dispatch events for backward compatibility**: If other components still listen
   ```tsx
   window.dispatchEvent(new Event("xp-updated"));
   ```

## Components Already Updated

The following components have been migrated to use UserContext:
- ✅ `src/components/XPBar.tsx`
- ✅ `src/components/AuthHeader.tsx`
- ✅ `src/components/UserHeader.tsx`
- ✅ `src/components/LogoutButton.tsx`
- ✅ `src/app/login/page.tsx`
- ✅ `src/app/ai-chat/page.tsx`
- ✅ `src/app/homeboard/page.tsx`

## Files Still Using localStorage (To Migrate)

The following files still use localStorage directly and should be updated:
- `src/script/changePassword.js`
- `src/script/deleteAccount.js`
- `src/script/profil.js`

Example migration for these files: Convert to TypeScript and use `useUser()` hook instead of `localStorage.getItem("user")`.

## Troubleshooting

### User data not updating after login
- Ensure `setUser()` is called with the user object from the login response
- Check that the API returns the correct user structure

### XP not refreshing after game
- Dispatch the `xp-updated` event: `window.dispatchEvent(new Event("xp-updated"))`
- Or call `updateXP(newXp, newLevel)` directly

### Loading state stuck on true
- Check network requests in DevTools
- Verify `/api/xp` endpoint is accessible and returns proper data
- Check for errors in browser console
