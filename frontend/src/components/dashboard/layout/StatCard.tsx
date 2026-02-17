type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
};

const StatCard = ({ label, value, sub, icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md px-6 py-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 leading-none">{value}</p>
          {sub && <p className="mt-2 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">{icon}</div>
      </div>
    </div>
  )
}

export default StatCard