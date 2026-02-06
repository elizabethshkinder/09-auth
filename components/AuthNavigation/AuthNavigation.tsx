"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import css from "./AuthNavigation.module.css";

import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

export default function AuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
      router.refresh(); 
    }
  }

  if (isAuthPage || !user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" className={css.navigationLink} prefetch={false}>
            Login
          </Link>
        </li>

        <li className={css.navigationItem}>
          <Link href="/sign-up" className={css.navigationLink} prefetch={false}>
            Sign up
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link
          href="/notes/filter/all"
          className={css.navigationLink}
          prefetch={false}
        >
          Notes
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/profile" className={css.navigationLink} prefetch={false}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user.email}</p>
        <button
          type="button"
          className={css.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </li>
    </>
  );
}
