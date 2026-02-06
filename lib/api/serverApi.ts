import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";


export async function serverCheckSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const res = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

export async function serverGetMe(): Promise<User> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const res = await api.get<User>("/users/me", {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}
