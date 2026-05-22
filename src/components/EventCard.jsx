import { Link } from 'react-router-dom';

export function EventCard({ event, action }) {
  const dateLabel = new Date(event.startDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-brand-400/50">
      <div className="mb-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-brand-300">
        <span>{event.category}</span>
        <span>{dateLabel}</span>
      </div>
      <h3 className="text-xl font-semibold text-white">{event.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{event.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>{event.location?.city || event.location?.name}</span>
        <Link to={`/events/${event._id}`} className="text-brand-300 transition hover:text-brand-200">
          View details
        </Link>
      </div>
      {action ? <div className="mt-4">{action}</div> : null}
    </article>
  );
}
