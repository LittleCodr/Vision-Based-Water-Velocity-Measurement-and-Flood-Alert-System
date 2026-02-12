interface Props {
  title: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'success' | 'danger' | 'warning';
}

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  default: 'bg-slate-100 text-slate-800',
  success: 'bg-emerald-100 text-emerald-800',
  danger: 'bg-rose-100 text-rose-800',
  warning: 'bg-amber-100 text-amber-800'
};

const StatCard = ({ title, value, hint, tone = 'default' }: Props) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="text-sm text-slate-500 mb-1">{title}</div>
    <div className="text-2xl font-semibold text-slate-900">{value}</div>
    {hint && <div className={`mt-2 inline-flex px-2 py-1 rounded-md text-xs ${toneClass[tone]}`}>{hint}</div>}
  </div>
);

export default StatCard;
