import React from 'react'
import { PiBrain } from 'react-icons/pi';
import SuggestionList from './SuggestionList';

const EmptyRag = ({ title, subtitle, suggestions, onPickSuggestion }: {title: string; subtitle: string; suggestions: string[]; onPickSuggestion: (s: string) => void }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
        <PiBrain className="h-9 w-9 text-purple-600" />
      </div>

      <h2 className="text-base font-semibold text-slate-600">{title}</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md">{subtitle}</p>

      <div className="mt-6 w-full max-w-md">
        <SuggestionList items={suggestions} onPick={onPickSuggestion} />
      </div>

    </div>
  )
}

export default EmptyRag