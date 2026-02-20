import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import type { NoteTabKey } from '../components/notes/types/noteTypes';
import { NOTES_MOCK } from '../components/notes/notesDummyData';
import { HiArrowLeft } from 'react-icons/hi';
import NoteHeader from '../components/notes/layout/NoteHeader';
import NoteTabs from '../components/notes/layout/NoteTabs';
import NoteMetaPanel from '../components/notes/layout/NoteMetaPanel';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<NoteTabKey>("summary");

  const note = useMemo(() => {
    return NOTES_MOCK.find((n) => n.id === id);
  }, [id]);

  const related = useMemo(() => {
    if (!note?.relatedIds?.length) return [];
    return NOTES_MOCK.filter((n) => note.relatedIds!.includes(n.id));
  }, [note]);

  // when note does not exist
  if (!note) {
    return(
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-500">
            <HiArrowLeft /> Back
          </button>
          <div className="mt - 6 rounded-2xl border bg-white p-6">Note not found.</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-500">
          <HiArrowLeft />Back
        </button>

        <div className="mt-4">
          <NoteHeader note={note} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <NoteTabs note={note} tab={tab} setTab={setTab} />
          <NoteMetaPanel note={note} related={related} />
        </div>
      </div>
    </div>
  )
}

export default NoteDetails;