import type { Note } from "../types/noteTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export type CreateNotePayload = {
  title: string;
  content: string;
  kind?: "text" | "voice";
}

// fetch all notes
export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API_BASE_URL}/api/notes`, {
    credentials: "include",
  });
  if(!res.ok) {
    throw new Error("Failed to fetch notes.");
  }
  return res.json();
};

// fetch note by ID
export async function fetchNoteById(id: string): Promise<Note> {
  const res = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch the note.");
  }
  return res.json();
};

// related ids
export async function fetchRelatedNotes(noteId: string): Promise<Note[]> {
  const res = await fetch(`${API_BASE_URL}/api/notes/${noteId}/related`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch related notes.");
  return res.json();
};

// delete note by ID
export async function deleteNoteById(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  
  if (!res.ok) throw new Error("Failed to delete the node.");
};

// create a note / save a note
export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const res = await fetch(`${API_BASE_URL}/api/notes`, {
    method: "POST",
    headers:  { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to create a note.");
  }

  return res.json();
}