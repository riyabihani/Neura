import RelatedNotesList from './RelatedNotesList'
import type { Note } from '../types/noteTypes';
import { LuTags } from 'react-icons/lu';
import { GoPeople } from 'react-icons/go';

// to display the entity in the form of rows
function EntityRow({ label, type }: { label: string; type: string }) {
  return(
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-800">{label}</span>
      <span className="text-xs font-semibold uppercase tracking-wide bg-white border border-slate-200 text-slate-600 rounded-full px-2 py=0.5">{type}</span>
    </div>
  )
}

const NoteMetaPanel = ({ note, related }: { note: Note; related: Note[]}) => {
  return (
    <div className="space-y-4">
      {/* tags */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
          <div className="h-5 w-5 rounded-md bg-violet-100 flex items-center justify-center">
            <LuTags className="h-3 w-3 text-violet-700" />
          </div>
          <span>Tags</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {note.tags.length ? (
            note.tags.map((n) => (
              <span key={n} className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-full px-2.5 py-1">#{n}</span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No tags yet.</span>
          )}
        </div>
      </div>

      {/* entities */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
          <div className=" h-5 w-5 rounded-md bg-violet-100 flex items-center justify-center">
            <GoPeople className="h-3 w-3 text-violet-700" />
          </div>
          <span>Entities</span>
        </div>
        <div className="mt-3 space-y-2">
          {(note.entities ?? []).length ? (
            note.entities!.map((e) => <EntityRow key={`${e.type}:${e.label}`} label={e.label} type={e.type} />)
          ) : (
            <span className="text-xs text-slate-500">No entities yet</span>
          )}
        </div>
      </div>

      {/* related notes */}
      <RelatedNotesList notes={related} />
    </div>
  )
}

export default NoteMetaPanel