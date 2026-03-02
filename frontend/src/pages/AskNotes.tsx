import React, { useMemo, useState } from 'react'
import type { ChatMessage } from '../types/ragTypes';
import EmptyRag from '../components/rag/EmptyRag';
import ChatComposer from '../components/rag/ChatComposer';
import { ragAsk } from '../api/ragApi';

function withTimeout<T>(p: Promise<T>, ms = 20000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timed out")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
  });
}

const AskNotes = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const suggestions = useMemo(() => [
    "What are my insights about productivity?",
    "Summarize my notes from this week.",
    "What ideas have I captured about AI?"
  ], []);

  async function handleSend(text: string) {
    const q = text.trim();
    if (!q) return;

    setError(null);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(), 
      role: "user", 
      content: q, 
      createdAt: Date.now()
    }

    const assistantId = crypto.randomUUID();

    const loadingMsg: ChatMessage = {
      id: assistantId,
      role: "assistant", 
      content: "", 
      createdAt: Date.now(),
      loading: true
    }

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");

    try {
      const out = await withTimeout(ragAsk(q), 20000);
      setMessages((prev) => prev.map((m) => 
        m.id === assistantId ? {...m, loading: false, content: out.answer || "No answer returned.", citations: out.citations || []} : m));
    } catch (error: any) {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setError(error?.message || "RAG failed.")
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold mb-2">Ask your notes</h1>
        <p className="text-gray-500 mb-6">Chat with your knowledge base using AI</p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
          <div className="min-h-[520px] px-6 py-10">
            {isEmpty ? (
              <EmptyRag title="Your knowledge, one question away." subtitle="Ask anything about your notes and get AI-powered ansers with references" suggestions={suggestions} onPickSuggestion={(s) => setInput(s)} />
            ) : (
              <div className="space-y-6">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                      {m.loading ? (
                        <span className="text-gray-500">Thinking...</span>
                        ) : (
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      )}

                      {m.role === "assistant" && !m.loading && m.citations?.length && (
                        <div className="mt-3 text-xs text-gray-600">
                          <div className="font-semibold mb-1">Sources</div>
                          <div className="space-y-1">
                            {m.citations.map((c) => (
                              <div key={c.ref} className="flex gap-2">
                                <span className="text-gray-400">[{c.ref}]</span>
                                <a href={`/notes/${c.noteId}`} className="underline hover:text-gray-900">{c.fromLabel}</a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white px-4 py-4">
            <ChatComposer value={input} onChange={setInput} onSend={() => handleSend(input)} placeholder="Ask anything about your notes..." />
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default AskNotes