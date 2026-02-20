import type { Note } from '../types/noteTypes'
import NoteCard from './NoteCard'

const NoteGrid = ({ notes }: {notes: Note[]}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {notes.map((n) => <NoteCard key={n.id} note={n} />)}
    </div>
  )
}

export default NoteGrid