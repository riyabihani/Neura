import { useEffect, useState } from 'react'
import { HiOutlineDocumentText, HiOutlineX, HiOutlineMicrophone } from 'react-icons/hi';

type AddNoteProps = {
  open: boolean;
  onClose: () => void;
}

const AddNote = ({ open, onClose }: AddNoteProps) => {
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* background */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* modal */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-10 animate-fadeIn max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Capture a thought</h2>
          <button onClick={onClose}>
            <HiOutlineX className="text-xl text-slate-500" />
          </button>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-medium text-slate-600 mb-2">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Give it a title...' className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>

        {/* text or voice */}
        <div className="mt-4 flex bg-slate-100 rounded-xl p-1">
          <button onClick={() => setMode("text")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${mode === "text" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
            <HiOutlineDocumentText />Text
          </button>
          <button onClick={() => setMode("voice")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${mode === "voice" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
            <HiOutlineMicrophone />Voice
          </button>
        </div>

        <div className="mt-4">
          {mode === "text" ? (
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What's on your mind?" className='w-full h-40 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500'></textarea>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <button className="h-20 w-20 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition">
                <HiOutlineMicrophone className='text-3xl' />
              </button>
              <p className="mt-3 text-sm text-slate-500">Tap to start recording</p>

              <div className="mt-6 w-full">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Transcript (editable)
                </label>

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your spoken words will appear here..."
                  className="w-full h-32 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>

            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="border border-slate-200 px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700">Cancel</button>
          <button className="border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-white bg-violet-600 hover:opacity-90 transition">Save Note</button>
        </div>
      </div>
    </div>
  )
}

export default AddNote;