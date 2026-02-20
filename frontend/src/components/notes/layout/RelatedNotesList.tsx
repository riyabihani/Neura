import { useNavigate } from 'react-router-dom'
import type { Note } from '../types/noteTypes';
import { HiChevronRight } from 'react-icons/hi';
import { BiNetworkChart } from 'react-icons/bi';

const RelatedNotesList = ({ notes }: { notes: Note[] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-1 text-sm font-semibold test-slate-900">
        <div className="h-5 w-5 rounded-md bg-violet-100 flex items-center justify-center">
          <BiNetworkChart className="h-3 w-3 text-violet-700" />
        </div>
        <span>Related Notes</span>
        </div>
      <div className="mt-3 divide-y divide-slate-100">
        {/* mapping through all related notes */}
        {notes.map((n) => (
          <button key={n.id} onClick={() => navigate(`/notes/${n.id}`)} className="w-full flex items-center justify-between py-3 text-left bg-slate-50 px-2 rounded-xl transition mb-2 hover:bg-slate-100">
            <div className="text-left">
              <div className="text-sm font-medium text-slate-900 line-clamp-1">{n.title}</div>
              <div className="text-xs text-slate-500 mt-1">{n.dateLabel}</div>
            </div>

            <HiChevronRight className="text-slate-400 text-lg flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>  
  )
}

export default RelatedNotesList