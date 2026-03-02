export type RagCitation = {
  ref: number;
  noteId: string;
  title: string;
  createdAt: string;
  chunkIndex: number;
  score: number;
  fromLabel: string;
}

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  loading?: boolean;
  citations?: RagCitation[];
}

export type RagAskResponse = {
  question: string;
  answer: string;
  citations: RagCitation[];
}