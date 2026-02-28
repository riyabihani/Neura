import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar.tsx';
import { globalSearch } from '../../api/searchApi.ts';
import SearchResults from './SearchResults.tsx';
import type { Mode } from '../../types/searchTypes.ts';

const SearchPage = () => {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<Mode>("exact");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if(!debouncedQ.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const r = await globalSearch(debouncedQ.trim(), mode);
        if(!cancelled) setResults(r);
      } catch(e: any) {
        if(!cancelled) setError(e?.message || "Search failed");
      } finally {
        if(!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, mode]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold mb-2">Search your Knowledge</h1>
        <p className="text-gray-500 mb-6">Find any thought, idea or insight from your notes</p>

        <SearchBar q={q} setQ={setQ} mode={mode} setMode={setMode} />

        {mode === "semantic" && !q && (
          <p className="text-sm flex justify-center text-gray-700 mb-6">Semantic search finds notes by meaning, not just exact words.</p>
        )} 

        {mode === "exact" && !q && (
          <p className="text-sm flex justify-center text-gray-700 mb-6">Exact search matches your exact keywords.</p>
        )} 

        {loading && (
          <p className="text-gray-500">Searching...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && q && results.length === 0 && (
          <p className="text-gray-500">No results found for "{q}".</p>
        )}

        <SearchResults results={results} mode={mode} onOpen={(id) => { window.location.href = `notes/${id}` }} />

      </div>
    </div>
  )
}

export default SearchPage