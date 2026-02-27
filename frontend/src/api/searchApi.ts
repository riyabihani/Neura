export type SearchMode = "exact" | "semantic";

export type SearchResult = {
  id: string;
  title: string;
  summary?: string | null;
  tags?: string[] | null;
  createdAt?: string;
  snippet?: string | null;
  chunkIndex?: number;
  score?: number;
  matchPct?: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function globalSearch(q: string, mode: SearchMode): Promise<SearchResult[]> {
  const url = new URL(`${API_BASE_URL}/api/search`);
  url.searchParams.set("q", q);
  url.searchParams.set("mode", mode);

  const res = await fetch(url.toString(), {
    credentials: "include"
  });

  if(!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Search failed.");
  }

  const data = await res.json();
  return data.results || [];
};