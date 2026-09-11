import { useEffect, useState } from "react";
import type { User } from "../types";
import { authStore } from "../services/authStore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(authStore.get());
  useEffect(() => {
    const sync = () => setUser(authStore.get());
    window.addEventListener("storage", sync);
    window.addEventListener("kortex:auth", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("kortex:auth", sync); };
  }, []);
  return {
    user,
    isAuthenticated: !!user,
    login(next: User) { authStore.set(next); setUser(next); },
    logout() { authStore.clear(); localStorage.removeItem("kortex_token"); setUser(null); }
  };
}