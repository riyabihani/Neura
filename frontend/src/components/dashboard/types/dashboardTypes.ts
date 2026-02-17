export type StatColors = "violet" | "emerald" | "sky" | "amber" | "rose" | "slate";

export type StatItem = {
  id: string;
  label: string;
  value: string | number;
  sub?: string;
  iconKey: "notes" | "voice" | "words" | "ai";
};

export type Topic = {
  label: string;
  count: number;
  color?: StatColors;
};

export type NoteStatus = "Queued" | "Completed";

export type NoteItem = {
  id: string;
  status: NoteStatus;
  title: string;
  description: string;
  date: string;
  meta?: string;
  tags?: string[];
  iconKey?: "voice" | "doc" | "brain";
};

export type DashboardData = {
  header: {
    title: string;
    subtitle: string;
  };
  stats: StatItem[];
  topics: Topic[];
  notes: NoteItem[];
  activity: {
    changeText: string;
    data: number[];
    labels:string[];
  };
};