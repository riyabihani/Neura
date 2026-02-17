import type { Topic, StatColors } from '../types/dashboardTypes'
import Card from './Card';

const colorClass: Record<StatColors, string> = {
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  sky: "bg-sky-50 text-sky-700 border-sky-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  slate: "bg-slate-50 text-slate-700 border-slate-100"
};

const TopTopics = ({ topics }: { topics: Topic[] }) => {
  return (
    <Card title="Top Topics" className="h-full">
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <span key={t.label} className={["inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium", colorClass[t.color ?? "slate"],].join(" ")}>
            <span className="font-semibold">#{t.label}</span>
            <span className="text-[11px] opacity-70">{t.count}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}

export default TopTopics;