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
  description: string;
  status: NoteStatus;

  dateLabel: string;
  createdAtISO: string;
  words?: number;
  kind?: "text" | "voice";

  tags: string[];

  summary?: string;
  content?: string;
  keyPoints?: string[];
  entities?: NoteEntity[];
  relatedIds?: string[];
};