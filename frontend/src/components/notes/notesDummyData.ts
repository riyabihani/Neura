import type { Note } from "./types/noteTypes";

export const NOTES_MOCK: Note[] = [
  {
    id: "1",
    title: "Ideas for improving team productivity",
    description:
      "Discussion of async standups, centralized documentation, and focus blocks.",
    status: "Completed",
    dateLabel: "Feb 15, 2026",
    createdAtISO: "2026-02-15T10:00:00",
    words: 78,
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
    entities: [{ label: "Notion", type: "tool" }],
    relatedIds: ["2", "3"]
  },
  {
    id: "2",
    title: "Machine Learning course notes - Week 3",
    description:
      "Neural networks, forward/backpropagation, activation functions.",
    status: "Completed",
    dateLabel: "Feb 14, 2026",
    createdAtISO: "2026-02-14T09:00:00",
    words: 52,
    kind: "voice",
    tags: ["machine-learning", "neural-networks"],
    summary: "Covered forward pass and backprop.",
    content: "Full ML notes...",
    keyPoints: ["Forward pass", "Backpropagation"],
    entities: [{ label: "TensorFlow", type: "tool" }],
    relatedIds: ["1"]
  },
  {
    id: "3",
    title: "Book notes: Atomic Habits",
    description:
      "Key takeaways on building better habits.",
    status: "Completed",
    dateLabel: "Feb 13, 2026",
    createdAtISO: "2026-02-13T08:00:00",
    words: 67,
    kind: "text",
    tags: ["books", "habits"],
    summary: "Small improvements compound over time.",
    content: "Detailed book notes...",
    keyPoints: ["Make it obvious", "Track habits"],
    entities: [],
    relatedIds: ["1"]
  },
  {
    id: "4",
    title: "Quick thought on project architecture",
    description:
      "Considering microservices for scalability.",
    status: "Processing",
    dateLabel: "Feb 12, 2026",
    createdAtISO: "2026-02-12T07:00:00",
    kind: "text",
    tags: ["architecture", "microservices"],
    summary: "Still processing...",
    content: "",
    keyPoints: [],
    entities: [],
    relatedIds: []
  },
  {
    id: "5",
    title: "Q4 Planning Meeting",
    description:
      "Discussed roadmap and priorities.",
    status: "Completed",
    dateLabel: "Feb 11, 2026",
    createdAtISO: "2026-02-11T10:00:00",
    words: 90,
    kind: "voice",
    tags: ["planning", "roadmap"],
    summary: "Defined milestones and responsibilities.",
    content: "Meeting notes...",
    keyPoints: ["Launch timeline", "Assign owners"],
    entities: [],
    relatedIds: []
  },
  {
    id: "6",
    title: "React Performance Notes",
    description:
      "Improving re-renders and memoization strategy.",
    status: "Completed",
    dateLabel: "Feb 10, 2026",
    createdAtISO: "2026-02-10T09:00:00",
    words: 45,
    kind: "text",
    tags: ["react", "performance"],
    summary: "Use memo and avoid unnecessary state.",
    content: "Performance details...",
    keyPoints: ["Memoization", "Avoid prop drilling"],
    entities: [],
    relatedIds: []
  },
  {
    id: "7",
    title: "Backend API Structure",
    description:
      "Designing clean REST endpoints.",
    status: "Queued",
    dateLabel: "Feb 9, 2026",
    createdAtISO: "2026-02-09T09:00:00",
    kind: "text",
    tags: ["backend", "api"],
    summary: "",
    content: "",
    keyPoints: [],
    entities: [],
    relatedIds: []
  },
  {
    id: "8",
    title: "Deep Learning pruning thoughts",
    description:
      "Importance of correlated filters in CNN pruning.",
    status: "Completed",
    dateLabel: "Feb 8, 2026",
    createdAtISO: "2026-02-08T09:00:00",
    words: 80,
    kind: "text",
    tags: ["deep-learning", "cnn", "pruning"],
    summary: "Filter correlation affects pruning validity.",
    content: "Research reflections...",
    keyPoints: ["Filter importance", "Correlation risk"],
    entities: [],
    relatedIds: []
  },
];
