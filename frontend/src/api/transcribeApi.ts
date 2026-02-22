export type TranscribeResponse = {
  text: string;
  language?: string;
  duration?: number;
}

const WHISPER_BASE_URL = import.meta.env.VITE_WHISPER_BASE_URL || "http://localhost:8000";

export async function transcribeAudio(blob: Blob): Promise<TranscribeResponse> {
  const form = new FormData();
  form.append("file", blob, "note.webm");

  const res = await fetch(`${WHISPER_BASE_URL}/api/transcribe`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Transcription failed.");
  }

  return res.json();
}