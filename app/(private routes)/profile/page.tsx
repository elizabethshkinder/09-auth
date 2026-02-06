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
    if (user) return;

    async function load() {
      try {
        setIsLoading(true);
        const me = await getMe();
        setUser(me);
      } catch {
        
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [user, setUser]);

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
