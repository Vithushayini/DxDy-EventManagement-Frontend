import { Link } from 'react-router-dom';
import { FaRegStar, FaStar } from 'react-icons/fa';

export function EventCard({ event, action, bookmarked = false, onToggleBookmark }) {
  const dateLabel = new Date(event.startDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-brand-400/50">
      <button
        type="button"
        onClick={onToggleBookmark}
        className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-slate-950/90 p-2 text-slate-300 shadow-lg shadow-black/20 transition hover:bg-brand-500 hover:text-white"
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
      >
        {bookmarked ? <FaStar className="text-yellow-300" /> : <FaRegStar className="text-slate-300" />}
      </button>

      <div className="mb-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-brand-300">
        <span>{event.category}</span>
        <span className='mr-10'>{dateLabel}</span>
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
