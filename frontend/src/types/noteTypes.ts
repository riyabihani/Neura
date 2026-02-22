export type NoteStatus = "Queued" | "Processing" | "Completed";

export type NoteTabKey = "summary" | "content" | "keyPoints";

export type NoteEntityType = "tool" | "group" | "person" | "org" | "topic";

export type NoteEntity = {
  label: string;
  type: NoteEntityType;
};

export type Note = {
  id: string;
  title: string;
  status: NoteStatus;

  createdAtISO: string;
  kind?: "text" | "voice";

  tags: string[];

  summary?: string;
  content?: string;
  keyPoints?: string[];
  entities?: NoteEntity[];
  // relatedIds?: string[];
};

export type RelatedNotesResponse = Note[]; // returned by GET /api/notes/:id/related