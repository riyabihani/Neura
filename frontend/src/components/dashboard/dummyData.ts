import type { DashboardData } from './types/dashboardTypes'
import { NOTES_MOCK } from '../notes/notesDummyData';

export const dashboardMock: DashboardData = {
  header: {
    title: "Neura",
    subtitle: "Your second brain at a glance",
  },
  stats: [
    { id: "total-notes", label: "Total Notes", value: 9, sub: "↑ 12% from last week", iconKey: "notes" },
    { id: "voice-notes", label: "Voice Notes", value: 4, iconKey: "voice" },
    { id: "words", label: "Words Captured", value: 400, iconKey: "words" },
    { id: "ai", label: "AI Processed", value: 7, sub: "78% complete", iconKey: "ai" },
  ],
  activity: {
      changeText: "+12%",
      data: [0, 1, 2, 1, 3, 2, 4, 3, 2, 3, 4, 5, 4, 6],
      labels: [
        "Feb 1", "Feb 2", "Feb 3", "Feb 4",
        "Feb 5", "Feb 6", "Feb 7", "Feb 8",
        "Feb 9", "Feb 10", "Feb 11", "Feb 12",
        "Feb 13", "Feb 14"
      ]
    },
  topics: [
    { label: "productivity", count: 2, color: "emerald" },
    { label: "documentation", count: 2, color: "sky" },
    { label: "teamwork", count: 1, color: "slate" },
    { label: "meetings", count: 1, color: "violet" },
    { label: "machine-learning", count: 1, color: "rose" },
    { label: "neural-networks", count: 1, color: "amber" },
    { label: "coursework", count: 1, color: "violet" },
    { label: "tensorflow", count: 1, color: "sky" },
    { label: "books", count: 1, color: "emerald" },
    { label: "habits", count: 1, color: "amber" },
    { label: "self-improvement", count: 1, color: "rose" },
    { label: "architecture", count: 1, color: "slate" },
  ],
  notes: NOTES_MOCK.slice(0, 8).map(note => ({
    id: note.id,
    status: note.status,
    title: note.title,
    description: note.description,
    date: note.dateLabel,
    meta: note.words ? `${note.words} words` : undefined,
    tags: note.tags,
    iconKey: note.kind === "voice" ? "voice" : "doc",
  })),
};
