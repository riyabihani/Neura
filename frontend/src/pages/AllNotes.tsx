import React, { Children, useEffect, useMemo, useState } from 'react'
import type { Note } from "../types/noteTypes"
import { fetchNotes } from '../api/notesApi';
import NoteGrid from '../components/notes/NoteGrid';
import { HiOutlineSearch } from 'react-icons/hi';

type NoteKindFilter = "all" | "text" | "voice";
type StatusFilter = "any" | "processing" | "queued" | "completed";

const AllNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<NoteKindFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("any");

  useEffect(() => {
    const loadNotes = async () => {
      const data = await fetchNotes();
      setNotes(data);
    };
    loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();

    return notes.filter((n) => {
      const haystack = [n.title ?? "", n.content ?? "", (n.tags ?? []).join(" ")].join(" ").toLowerCase();

      if (q && !haystack.includes(q)) return false;

      if (kindFilter !== "all") {
        const k = (n.kind ?? "").toLowerCase();
        if (kindFilter === "voice" && k !== "voice") return false;
        if (kindFilter === "text" && k !== "text") return false;
      }

      if (statusFilter !== "any") {
        const s = (n.status ?? "").toLowerCase();
        const isProcessing = s === "processing";
        const isQueued = s === "queued";
        const isCompleted = s === "completed";

        if (statusFilter === "processing" && !isProcessing) return false;
        if (statusFilter === "queued" && !isQueued) return false;
        if (statusFilter === "completed" && !isCompleted) return false;
      }

      return true;
    });
  }, [notes, query, kindFilter, statusFilter]);

  const Tab = ({active, onClick, children}: {active: boolean; onClick: () => void; children: React.ReactNode}) => (
    <button onClick={onClick} className={["rounded-xl border px-4 py-2 text-sm font-semibold transition-colors", active ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",].join(" ")}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">All Notes</h1>
          <p className="text-gray-500 mb-6">{filteredNotes.length} notes in your knowledge base</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter notes..." className="w-full rounded-xl border corder-slate-200 bg-white pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-violet-800" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Tab active={kindFilter === "all"} onClick={() => setKindFilter("all")}>All</Tab>
            <Tab active={kindFilter === "voice"} onClick={() => setKindFilter("voice")}>Voice</Tab>
            <Tab active={kindFilter === "text"} onClick={() => setKindFilter("text")}>Text</Tab>

            <div className="w-3" />

            <Tab active={statusFilter === "any"} onClick={() => setStatusFilter("any")}>Any</Tab>
            <Tab active={statusFilter === "queued"} onClick={() => setStatusFilter("queued")}>Queued</Tab>
            <Tab active={statusFilter === "processing"} onClick={() => setStatusFilter("processing")}>Processing</Tab>
            <Tab active={statusFilter === "completed"} onClick={() => setStatusFilter("completed")}>Completed</Tab>
          </div>
        </div>

        <div className="mt-8">
          <NoteGrid notes={filteredNotes} />
        </div>
      </div>
    </div>
  )
}

export default AllNotes