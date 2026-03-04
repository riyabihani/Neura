import StatCard from "../components/dashboard/StatCard";
import { dashboardMock } from "../components/dashboard/dummyData";
import type { NoteItem, StatItem } from "../types/dashboardTypes";
import { HiOutlineDocumentText, HiOutlineMicrophone, HiPlus } from "react-icons/hi";
import { PiBrain } from "react-icons/pi";
import { HiOutlineBolt } from "react-icons/hi2";
import NotesActivityGraph from "../components/dashboard/NotesActivityGraph"
import TopTopics from "../components/dashboard/TopTopics";
import NoteCard from "../components/notes/NoteCard";
import { useState, useEffect, useMemo } from "react";
import AddNote from "../components/common/AddNote";
import { NOTES_MOCK } from "../components/notes/notesDummyData";
import NoteGrid from "../components/notes/NoteGrid";
import type { Note } from "../types/noteTypes";
import { fetchNotes } from "../api/notesApi";
import { Link } from "react-router-dom";

function statIcon(iconKey: StatItem["iconKey"]) {
  switch(iconKey) {
    case "notes":
      return <HiOutlineDocumentText className="text-xl" />;
    case "voice":
      return <HiOutlineMicrophone className="text-xl" />;
    case "words":
      return <PiBrain className="text-xl" />;
    case "ai":
      return <HiOutlineBolt className="text-xl" />;
    default:
      return <HiOutlineDocumentText className="text-xl" />;
  }
};

function noteIcon(iconKey?: NoteItem["iconKey"]) {
  switch(iconKey) {
    case "voice":
      return <HiOutlineMicrophone className="text-lg" />;
    case "doc":
      return <HiOutlineDocumentText className="text-lg" />;
    case "brain":
      return <PiBrain className="text-lg" />;
    default:
      return <HiOutlineDocumentText className="text-lg" />;
  }
}

const Dashboard = () => {
  const data = dashboardMock;
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch(console.error);
  }, []);

  const recent = notes.slice(0, 8);

  const totalNotes = notes.length;
  const voiceNotes = notes.filter(vn => vn.kind === 'voice').length;
  const totalWords = notes.reduce((acc, n) => {
    const text = (n.content ?? "").toString();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    acc += words;
    return acc;
  }, 0);
  const aiProcessed = notes.filter(n => n.status === "Completed").length;
  const topics = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of notes) {
      const tags = n.tags ?? [];
      for (const t of tags) {
        if (!map[t]) map[t] = 0;
        map[t] += 1
      }
    }
    return Object.entries(map).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 20);
  }, [notes]);

  const stats: StatItem[] = [
    {id: "total-notes", label: "Total Notes", value: totalNotes, iconKey: "notes"},
    {id: "voice-notes", label: "Voice Notes", value: voiceNotes, iconKey: "voice"},
    {id: "words", label: "Words Captured", value: totalWords, iconKey: "words"},
    {id: "ai", label: "AI Processed", value: aiProcessed, sub: `${((aiProcessed / totalNotes) * 100).toFixed()}% complete`, iconKey: "ai"},
  ];

  const activity = useMemo(() => {
    const DAYS = 14;

    const labels: string[] = [];
    const countsMap: Record<string, number> = {};

    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);

      const key = d.toISOString().slice(0, 10);
      labels.push(key);
      countsMap[key] = 0;
    }

    for (const n of notes) {
      const raw = (n.createdAtISO ?? "") as string | undefined; 
      if (!raw) continue;

      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) continue;

      const key = d.toISOString().slice(0, 10);
      if (key in countsMap) countsMap[key] += 1;
    }

    const data = labels.map(k => countsMap[k]);

    // optional: prettier labels like "Mar 4"
    const prettyLabels = labels.map(k => {
      const d = new Date(k);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    });

    return { labels: prettyLabels, data };
  }, [notes]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Stats */}
        <div className="mt=6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.id} label={s.label} value={s.value} sub={s.sub} icon={statIcon(s.iconKey)} />
          ))}
        </div>

        {/* Recent Notes */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Notes</h2>
            <Link to="/notes" className="text-blue-600 underline">See all notes</Link>
          </div>
          <div className="mt-4">
            {/* {notes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))} */}
            <NoteGrid notes={recent} />
          </div>
        </div>

        {/* Graph + Topics */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <NotesActivityGraph changeText={`Last 14 days`} data={activity.data} labels={activity.labels} />
          </div>
          <div className="lg:col-span-2">
            <TopTopics topics={topics} />
          </div>
        </div>
      </div>

      <button onClick={() => setOpen(true)} className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200">
        <HiPlus className="text-3xl" />
      </button>

      <AddNote open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default Dashboard