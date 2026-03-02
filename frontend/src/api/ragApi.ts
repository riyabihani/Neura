import type { RagAskResponse } from "../types/ragTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function ragAsk(question: string): Promise<RagAskResponse> {
  const res = await fetch(`${API_BASE_URL}/api/rag/ask`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({ question })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "RAG ask failed.");
  }
  return res.json();
}