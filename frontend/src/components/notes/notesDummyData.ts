import type { Note } from "./types/noteTypes";

export const NOTES_MOCK: Note[] = [
  {
    id: "1",
    title: "Ideas for improving team productivity",
    status: "Completed",
    createdAtISO: "2026-02-15T10:00:00",
    kind: "text",
    tags: ["productivity", "teamwork", "meetings"],
    summary:
      "Brainstormed async standups, Notion documentation, and 2-hour focus blocks.",
    content: "Full detailed note content here...",
    keyPoints: [
      "Async standups",
      "Centralized documentation",
      "Dedicated focus blocks"
    ],
    entities: [{ label: "Notion", type: "tool" }]
  },
  {
    id: "2",
    title: "Machine Learning course notes - Week 3",
    status: "Completed",
    createdAtISO: "2026-02-14T09:00:00",
    kind: "voice",
    tags: ["machine-learning", "neural-networks"],
    summary: "Covered forward pass and backprop.",
    content: "Full ML notes...",
    keyPoints: ["Forward pass", "Backpropagation"],
    entities: [{ label: "TensorFlow", type: "tool" }]
  },
  {
    id: "3",
    title: "Book notes: Atomic Habits",
    status: "Completed",
    createdAtISO: "2026-02-13T08:00:00",
    kind: "text",
    tags: ["books", "habits"],
    summary: "Small improvements compound over time.",
    content: "Detailed book notes...",
    keyPoints: ["Make it obvious", "Track habits"],
    entities: []
  },
  {
    id: "4",
    title: "Quick thought on project architecture",
    status: "Processing",
    createdAtISO: "2026-02-12T07:00:00",
    kind: "text",
    tags: ["architecture", "microservices"],
    summary: "Still processing...",
    content: "",
    keyPoints: [],
    entities: []
  },
  {
    id: "5",
    title: "Q4 Planning Meeting",
    status: "Completed",
    createdAtISO: "2026-02-11T10:00:00",
    kind: "voice",
    tags: ["planning", "roadmap"],
    summary: "Defined milestones and responsibilities.",
    content: "Meeting notes...",
    keyPoints: ["Launch timeline", "Assign owners"],
    entities: []
  },
  {
    id: "6",
    title: "React Performance Notes",
    status: "Completed",
    createdAtISO: "2026-02-10T09:00:00",
    kind: "text",
    tags: ["react", "performance"],
    summary: "Use memo and avoid unnecessary state.",
    content: "Performance details...",
    keyPoints: ["Memoization", "Avoid prop drilling"],
    entities: []
  },
  {
    id: "7",
    title: "Backend API Structure",
    status: "Queued",
    createdAtISO: "2026-02-09T09:00:00",
    kind: "text",
    tags: ["backend", "api"],
    summary: "",
    content: "",
    keyPoints: [],
    entities: []
  },
  {
    id: "8",
    title: "Deep Learning pruning thoughts",
    status: "Completed",
    createdAtISO: "2026-02-08T09:00:00",
    kind: "text",
    tags: ["deep-learning", "cnn", "pruning"],
    summary: "Filter correlation affects pruning validity.",
    content: "Research reflections...",
    keyPoints: ["Filter importance", "Correlation risk"],
    entities: []
  },
];
