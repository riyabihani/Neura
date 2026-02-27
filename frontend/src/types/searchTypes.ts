export type Mode = "exact" | "semantic";

export type SearchResult = {
  id: string;
  title: string;
  summary?: string;
  tags?: string[];
  createdAt: string;
  snippet: string;
  score?: number;
  matchPct?: number;
};