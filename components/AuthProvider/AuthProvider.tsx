"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const { setUser, clearIsAuthenticated } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  const isPrivateRoute = useMemo(
    () => PRIVATE_PREFIXES.some((p) => pathname.startsWith(p)),
    [pathname]
  );

  const isAuthRoute = useMemo(
    () => AUTH_PREFIXES.some((p) => pathname.startsWith(p)),
    [pathname]
  );

  useEffect(() => {
    async function run() {
      try {
        setIsChecking(true);

        const user = await checkSession();

        if (user) {
          setUser(user);

          if (isAuthRoute) router.replace("/profile");
        } else {
          
          clearIsAuthenticated();

          if (isPrivateRoute) {
            try {
              await logout();
            } catch {

            }
            router.replace("/sign-in");
          }
        }
      } finally {
        setIsChecking(false);
      }
    }

    run();
  }, [isAuthRoute, isPrivateRoute, router, setUser, clearIsAuthenticated]);

  if (isChecking) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (isPrivateRoute && !useAuthStore.getState().isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
