import StatCard from "../components/dashboard/layout/StatCard";
import { dashboardMock } from "../components/dashboard/dummyData";
import type { NoteItem, StatItem } from "../components/dashboard/types/dashboardTypes";
import { HiOutlineDocumentText, HiOutlineMicrophone, HiPlus } from "react-icons/hi";
import { PiBrain } from "react-icons/pi";
import { HiOutlineBolt } from "react-icons/hi2";
import NotesActivityGraph from "../components/dashboard/layout/NotesActivityGraph"
import TopTopics from "../components/dashboard/layout/TopTopics";
import NoteCard from "../components/notes/layout/NoteCard";
import { useState, useEffect } from "react";
import AddNote from "../components/common/AddNote";
import { NOTES_MOCK } from "../components/notes/notesDummyData";
import NoteGrid from "../components/notes/layout/NoteGrid";
import type { Note } from "../components/notes/types/noteTypes";
import { fetchNotes } from "../api/notesApi";

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
  // const notes = NOTES_MOCK;
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch(console.error);
  }, []);

  const recent = notes.slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Stats */}
        <div className="mt=6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.stats.map((s) => (
            <StatCard key={s.id} label={s.label} value={s.value} sub={s.sub} icon={statIcon(s.iconKey)} />
          ))}
        </div>

        {/* Recent Notes */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-slate-900">Recent Notes</h2>
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
            <NotesActivityGraph changeText={data.activity.changeText} data={data.activity.data} labels={data.activity.labels} />
          </div>
          <div className="lg:col-span-2">
            <TopTopics topics={data.topics} />
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