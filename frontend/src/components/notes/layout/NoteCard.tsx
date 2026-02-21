import type { Note } from '../types/noteTypes';
import { HiOutlineDocumentText, HiOutlineMicrophone } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const statusStyles: Record<Note["status"], string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-slate-50 text-slate-700 border-slate-100",
  Queued: "bg-slate-50 text-slate-700 border-slate-100",
};

const NoteCard = ({ note }: { note: Note }) => {
  const icon = note.kind === "voice" ? <HiOutlineMicrophone className='text-lg' /> : <HiOutlineDocumentText className='text-lg' />

  const wordCount = note.content ? note.content.trim().split(/\s+/).length : 0;

  const dateLabel = new Date(note.createdAtISO).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <Link to={`/notes/${note.id}`}>
      <article className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              {icon ?? <span className="text-xs font-bold">N</span>}
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[note.status]}`}>{note.status}</span>
          </div>
        </div>

        <h4 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-1">{note.title}</h4>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{note.summary}</p>

        {note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {note.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">#{t}</span>
            ))}
            {note.tags.length > 3 && <span className="text-xs text-slate-500">+{note.tags.length - 3}</span>}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{dateLabel}</span>
          {wordCount > 0 && <span>{wordCount} words</span>}
        </div>
      </article>
    </Link>
  )
}

export default NoteCard