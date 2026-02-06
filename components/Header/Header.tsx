"use client";

import Link from "next/link";
import css from "./Header.module.css";

import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {user ? (
            <li>
              <Link href="/notes/filter/all">Notes</Link>
            </li>
          ) : null}
          
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
