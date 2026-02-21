import type { Note } from '../types/noteTypes'
import { HiOutlineDocumentText, HiOutlineMicrophone } from 'react-icons/hi'

// colors for the different note statuses
const statusStyles: Record<Note["status"], string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-slate-50 text-slate-700 border-slate-100",
  Queued: "bg-slate-50 text-slate-700 border-slate-100",
};

const NoteHeader = ({ note } : { note: Note}) => {
  // icon depending on the type of note
  const icon = note.kind === "voice" ? <HiOutlineMicrophone className="text-2xl" /> : <HiOutlineDocumentText className="text-2xl" />
  
  const wordCount = note.content ? note.content.trim().split(/\s+/).length : 0;

  const dateLabel = new Date(note.createdAtISO).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">{icon}</div>

          {/* title + date + number of words */}
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{note.title}</h1>
            <div className="mt-1 text-sm text-slate-500">
              {dateLabel}{wordCount > 0 ? ` • ${wordCount} words` : ""}
            </div>
          </div>
        </div>

        {/* note status */}
        <span className={`text-sm font-semibold px-2.5 py-1 rounded-full border ${statusStyles[note.status]}`}>{note.status}</span>
      </div>
    </div>
  );
}

export default NoteHeader;