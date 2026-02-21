import type { Note } from "../components/notes/types/noteTypes";

// fetch all notes
export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch("http://localhost:5000/api/notes", {
    credentials: "include",
  });
  if(!res.ok) {
    throw new Error("Failed to fetch notes.");
  }
  return res.json();
}

// fetch note by ID
export async function fetchNoteById(id: String): Promise<Note> {
  const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch the note.");
  }
  return res.json();
}

// related ids
export async function fetchRelatedNotes(noteId: string): Promise<Note[]> {
  const res = await fetch(`http://localhost:5000/api/notes/${noteId}/related`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch related notes.");
  return res.json();
} 

// delete note by ID
export async function deleteNoteById(id: string): Promise<void> {
  const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  
  if (!res.ok) throw new Error("Failed to delete the node.");
}