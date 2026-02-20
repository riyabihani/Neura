import React from 'react'
import type { Note, NoteTabKey } from '../types/noteTypes'
import { LuSparkles } from 'react-icons/lu';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { PiListBulletsBold } from 'react-icons/pi';

// button for each tab
const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => {
  return (
    <button onClick={onClick} className={`text-sm font-semibold px-3 py-1.5 transition ${active ? "text-slate-900 bg-white border-slate-900 border-b border-violet-600 scale-115" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>{children}</button>
  );
}

const NoteTabs = ({ note, tab, setTab }: { note: Note; tab: NoteTabKey; setTab: (t: NoteTabKey) => void; }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-200 px-4 py-3">
        {/* tabs */}
        <TabButton active={tab === "summary"} onClick={() => setTab("summary")}>
          <span className="flex gap-2 items-center"><LuSparkles /> Summary</span>
        </TabButton>
        <TabButton active={tab === "content"} onClick={() => setTab("content")}>
          <span className="flex gap-2 items-center"><HiOutlineDocumentText />Content</span>
        </TabButton>
        <TabButton active={tab === "keyPoints"} onClick={() => setTab("keyPoints")}>
          <span className="flex gap-2 items-center"><PiListBulletsBold /> Key Points</span>
        </TabButton>
      </div>

      {/* content */}
      <div className="p-5 text-md text-slate-700 leading-relaxed">
        {tab === "summary" && <p>{note.summary ?? "No summary yet."}</p>}
        {tab === "content" && <p>{note.content ?? "No content yet."}</p>}
        {tab === "keyPoints" && (
          <ul className="list-disc pl-6 space-y-2">
            {(note.keyPoints ?? ["No key points yet."]).map((k) => <li key={k}>{k}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NoteTabs