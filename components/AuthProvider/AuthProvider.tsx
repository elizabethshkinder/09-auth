"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const ok = await checkSession();
        if (!ok) {
          if (!cancelled) clearIsAuthenticated();
          return;
        }

        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearIsAuthenticated();
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
