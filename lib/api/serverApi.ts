import { cookies } from "next/headers";
import { api } from "./api";

import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";

type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export async function fetchNotes(
  page = 1,
  search = "",
  tag?: string
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
      tag,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

export async function serverCheckSession(): Promise<
  AxiosResponse<{ success: boolean }>
> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const res = await api.get<{ success: boolean }>("/auth/session", {
    headers: { Cookie: cookieHeader },
  });

  return res;
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
