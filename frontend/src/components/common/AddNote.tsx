import { useEffect, useState, useRef } from 'react'
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

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const[isTranscribing, setIsTranscribing] = useState(false);
  const[transcribeError, setTranscribeError] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    const ok = !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";
    setMicSupported(ok);
  }, []);

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

  const startAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      isStoppingRef.current = false;
      setIsRecording(false);
      const blob = new Blob(chunksRef.current, {type: recorder.mimeType || "audio/webm" });
      setAudioBlob(blob);

      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;

      await transcribeWithWhisper(blob);
    };

    recorder.start();
  };

  const stopAudioRecording = () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || isStoppingRef.current) return;
    isStoppingRef.current = true;
    try {
      recorder.stop()
    } catch {}
    mediaRecorderRef.current = null
  }

  const toggleVoice = async () => {
    if (!micSupported || isTranscribing) return;

    if (!isRecording) {
      setTranscribeError(null);
      await startAudioRecording();
      setIsRecording(true);
    } else {
      stopAudioRecording();
    }
  };

  const transcribeWithWhisper = async (blob: Blob) => {
    setIsTranscribing(true);
    setTranscribeError(null);

    try {
      const form = new FormData();
      form.append("file", blob, "note.webm");

      const res = await fetch("http://localhost:8000/api/transcribe", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || "Transcription failed.");
      }

      const data = await res.json();
      // setTranscript(data.text || "");
      const newText = (data.text || "").trim();
      if (newText) {
        setTranscript(prev => (prev ? `${prev}\n${newText}` : newText));
      }
    } catch (error: any) {
      setTranscribeError(error.message || "Transcription failed");
    } finally {
      setIsTranscribing(false);
    }
  }

  useEffect(() => {
    if (!open || mode !== "voice") {
      try { mediaRecorderRef.current?.stop(); } catch {}
      mediaRecorderRef.current = null;

      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;

      chunksRef.current = [];
      isStoppingRef.current = false;

      setIsRecording(false);
    }

    if (!open) {
      setTitle("");
      setText("");
      setTranscript("");
      setAudioBlob(null);
      setIsTranscribing(false);
      setTranscribeError(null);
    }
  }, [open, mode])

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
              {!micSupported && (
                <p className="text-sm text-red-600 text-center">Mic is not supported in this browser.</p>
              )}
              <button type="button" onClick={toggleVoice} disabled={!micSupported || isTranscribing} className={`h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition ${(!micSupported || isTranscribing) ? "bg-slate-300 cursor-not-allowed" : "bg-violet-600 text-white hover:scale-105"}`}>
                <HiOutlineMicrophone className='text-3xl' />
              </button>
              <p className="mt-3 text-sm text-slate-500">{isRecording ? "Recording... Tap to stop." : "Tap to start recording"}{isTranscribing ? "- Transcribing..." : ""}</p>

              {transcribeError && (
                <p className="mt-2 text-sm text-red-600 text-center">{transcribeError}</p>
              )}

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