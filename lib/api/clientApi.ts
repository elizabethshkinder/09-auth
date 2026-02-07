import { api } from "./api";
import type { User } from "@/types/user";

import type { Note, NoteFormValues } from "@/types/note";

export type AuthCredentials = {
  email: string;
  password: string;
};

type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export async function register(data: AuthCredentials): Promise<User> {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
}

export async function login(data: AuthCredentials): Promise<User> {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<boolean> {
  try {
    const res = await api.get<{ success: boolean }>("/auth/session");
    return Boolean(res.data?.success);
  } catch {
    return false;
  }
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export type UpdateMePayload = {
  username: string;
};

export async function updateMe(data: UpdateMePayload): Promise<User> {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
}

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNote: NoteFormValues): Promise<Note> {
  const { data } = await api.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}