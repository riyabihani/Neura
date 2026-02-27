import React from 'react'
import type { Mode } from '../../types/searchTypes';

const SearchBar = ({q, setQ, mode, setMode}: {q: string; setQ: (v: string) => void; mode: Mode; setMode: (m: Mode) => void}) => {
  return (
    <div className="flex gap-2 mb-6 border border-slate-300 bg-white p-2 rounded-lg">
      <input value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={mode === "exact" ? "Search by keyword..." : "Search by meaning..."}
        className="flex-1 rounded-lg px-2 py-1 outline-none focus:outline-none focus:ring-0" />

      <div className="flex py-1 px-2 bg-slate-100 rounded-lg overflow-hidden">
        <button onClick={() => setMode("exact")}
          className={`px-2 py-1 text-sm rounded-lg ${mode === "exact" ? "bg-white text-gray-700" : "bg-slate-100 text-gray-700"}`}>
            Exact
        </button>
        <button onClick={() => setMode("semantic")}
          className={`px-2 py-1 text-sm rounded-lg ${mode === "semantic" ? "bg-white text-gray-700" : "bg-slate-100 text-gray-700"}`}>
            Semantic
        </button>
      </div>
    </div>
  )
}

export default SearchBar