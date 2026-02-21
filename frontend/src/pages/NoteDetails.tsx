import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import type { NoteTabKey } from '../components/notes/types/noteTypes';
import { NOTES_MOCK } from '../components/notes/notesDummyData';
import { HiArrowLeft, HiPlus } from 'react-icons/hi';
import NoteHeader from '../components/notes/layout/NoteHeader';
import NoteTabs from '../components/notes/layout/NoteTabs';
import NoteMetaPanel from '../components/notes/layout/NoteMetaPanel';
import type { Note } from '../components/notes/types/noteTypes';
import { deleteNoteById, fetchNoteById, fetchRelatedNotes } from '../api/notesApi';
import AddNote from '../components/common/AddNote';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<NoteTabKey>("summary");
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);

  // const note = useMemo(() => {
  //   return NOTES_MOCK.find((n) => n.id === id);
  // }, [id]);

  // const related = useMemo(() => {
  //   if (!note?.relatedIds?.length) return [];
  //   return NOTES_MOCK.filter((n) => note.relatedIds!.includes(n.id));
  // }, [note]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchNoteById(String(id));
        if (cancelled) return;
        setNote(data);

        const rel = await fetchRelatedNotes(data.id);
        if (cancelled) return;
        setRelated(rel);
      } catch (error) {
        console.error(error);
        if (cancelled) return;
        setNote(null);
        setRelated([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    }
  }, [id]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-slate-50">
  //       <div className="max-w-6xl mx-auto px-8 py-8">
  //         <button
  //           onClick={() => navigate(-1)}
  //           className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-500"
  //         >
  //           <HiArrowLeft /> Back
  //         </button>
  //         <div className="mt-6 rounded-2xl border bg-white p-6">Loading...</div>
  //       </div>
  //     </div>
  //   );
  // }

  // when note does not exist
  if (!note) {
    return(
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-500">
            <HiArrowLeft /> Back
          </button>
          <div className="mt-6 rounded-2xl border bg-white p-6">Note not found.</div>
        </div>
      </div>
    );
  };

  const handleDelete = async () => {
    if (!note) return;

    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    try {
      await deleteNoteById(note.id);
      navigate("/dashoboard");
    } catch (error) {
      console.error(error);
      alert("Failed to delete note.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-500">
            <HiArrowLeft />Back
          </button>

          <button onClick={handleDelete} className="text-sm text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200 rounded-md px-2 py-1 mr-3">Delete Note</button>
        </div>

        <div className="mt-4">
          <NoteHeader note={note} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <NoteTabs note={note} tab={tab} setTab={setTab} />
          <NoteMetaPanel note={note} related={related} />
        </div>
      </div>

      <button onClick={() => setOpen(true)} className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200">
        <HiPlus className="text-3xl" />
      </button>

      <AddNote open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default NoteDetails;