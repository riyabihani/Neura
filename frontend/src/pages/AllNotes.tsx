import React, { useEffect, useState } from 'react'
import type { Note } from "../types/noteTypes"
import { fetchNotes } from '../api/notesApi';
import NoteGrid from '../components/notes/NoteGrid';

const AllNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    const loadNotes = async () => {
      const data = await fetchNotes();
      setNotes(data);
    };
    loadNotes();
  }, []);

  return (
    <div className="m-2">
      <NoteGrid notes={notes} />
    </div>
  )
}

export default AllNotes