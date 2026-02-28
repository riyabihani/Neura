
import type { Mode, SearchResult } from '../../types/searchTypes';
import { HiOutlineDocumentText, HiOutlineMicrophone } from 'react-icons/hi';
import { IoIosArrowRoundForward } from "react-icons/io";

export const formatDate = (date: string) => {
  const d = new Date(date)

  const day = d.toLocaleDateString("en-GB", { day: "2-digit" })
  const month = d.toLocaleDateString("en-GB", { month: "short" })
  const year = d.getFullYear()

  return `${day} ${month}, ${year}`
}

const SearchResults = ({ results, mode, onOpen }: { results: SearchResult[]; mode: Mode; onOpen: (id: string) => void; }) => {
  return (
    <div className="space-y-4 bg-white">
      {results.map((r) => (
        <div onClick={() => onOpen(r.id)} className="border border-slate-300 rounded-lg p-4 hover:shadow-md cursor-pointer transition">
          <div className="flex gap-5">
            <p className="h-8 w-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              {r.kind === 'voice' ? <HiOutlineMicrophone className='text-xl' /> : <HiOutlineDocumentText className='text-xl' />}
            </p>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium">{r.title}</h2>
                {mode === 'semantic' && (
                  <div className="text-sm text-gray-500 bg-slate-50 px-2 py-1 rounded-xl">{r.matchPct ?? 0}% match</div>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1">{r.snippet}...</p>

              {r.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 mt-2">{formatDate(r.createdAt)}</p>
                <IoIosArrowRoundForward className="text-xl text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchResults