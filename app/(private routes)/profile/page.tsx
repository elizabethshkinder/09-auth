"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import css from "./ProfilePage.module.css"; 
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      setIsLoading(true);
      const me = await getMe();
      if (!cancelled) setUser(me);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      if (!cancelled) {
        useAuthStore.getState().clearIsAuthenticated()
        window.location.href = "/sign-in";
      }
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  }

  load();

  return () => {
    cancelled = true;
  };
}, [setUser]);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? (isLoading ? "Loading..." : "—")}</p>
          <p>Email: {user?.email ?? (isLoading ? "Loading..." : "—")}</p>
        </div>
      </div>
    </main>
  );
}
