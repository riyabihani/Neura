import React from 'react'
import type { Mode, SearchResult } from '../../types/searchTypes';

const SearchResults = ({ results, mode, onOpen }: { results: SearchResult[]; mode: Mode; onOpen: (id: string) => void; }) => {
  return (
    <div className="space-y-4">
      {results.map((r) => (
        <div onClick={() => onOpen(r.id)} className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium">{r.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{r.snippet}</p>
            </div>

            {mode === "semantic" && (
              <div className="text-sm text-gray-500">{r.matchPct ?? 0}% match</div>
            )}
          </div>

          {r.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {r.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          ) : null}

          <p className="text-sm text-gray-400 mt-2">{r.createdAt}</p>
        </div>
      ))}
    </div>
  )
}

export default SearchResults