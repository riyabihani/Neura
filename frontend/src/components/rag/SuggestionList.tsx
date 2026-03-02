import React from 'react'
import { TiMessage } from 'react-icons/ti'

const SuggestionList = ({items, onPick}: {items: string[], onPick: (s: string) => void}) => {
  return (
    <div className="space-y-3">
      {items.map((s) => (
        <button key={s} onClick={() => onPick(s)} className="w-full flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-50 transition">
          <TiMessage className="h-4 w-4 text-purple-600 shrink-0" />
          <span className="truncate">{s}</span>
        </button>
      ))}
    </div>
  )
}

export default SuggestionList