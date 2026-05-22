export function LoadingState({ label = 'Loading...' }) {
  return <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">{label}</div>;
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-slate-400">{description}</p>
    </div>
  );
}
