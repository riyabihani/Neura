import React from 'react'
import { IoSend } from 'react-icons/io5';

const ChatComposer = ({ value, onChange, onSend, placeholder }: { value: string; onChange: (v: string) => void; onSend: () => void; placeholder?: string }) => {
  const disabled = !value.trim()

  return (
    <div className="flex items-center gap-3">
      <input value={value} onChange={(e) => onChange(e.target.value)} 
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) onSend();
        }}
        placeholder={placeholder || "Ask..."}
        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500" />

        <button onClick={onSend} disabled={disabled} className="h-10 w-10 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 transition flex items-center justify-center" aria-label="Send">
          <IoSend className="h-4 w-4 text-gray-700" />
        </button>
    </div>
  )
}

export default ChatComposer