import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteEvent, fetchEventById } from '../store/slices/eventsSlice.js';
import { toggleBookmark } from '../store/slices/bookmarksSlice.js';
import { LoadingState } from '../components/StatusBlocks.jsx';

export function EventDetailsPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEvent } = useSelector((state) => state.events);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  if (!currentEvent) {
    return <LoadingState label="Loading event details..." />;
  }

  const createdById = currentEvent.createdBy?._id || currentEvent.createdBy;
  const isOwner = user && createdById && createdById === user.id;

  const handleDelete = async () => {
    const result = await dispatch(deleteEvent(eventId));
    if (deleteEvent.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">{currentEvent.category}</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{currentEvent.title}</h1>
        <p className="mt-4 text-slate-300">{currentEvent.description}</p>
        <dl className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Organizer</dt>
            <dd>{currentEvent.organizer}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Location</dt>
            <dd>{currentEvent.location?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">City</dt>
            <dd>{currentEvent.location?.city || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Country</dt>
            <dd>{currentEvent.location?.country || 'N/A'}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          {token ? (
            <button
              type="button"
              onClick={() => dispatch(toggleBookmark(currentEvent._id))}
              className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white"
            >
              Bookmark event
            </button>
          ) : null}
          {currentEvent.location?.mapUrl ? (
            <a href={currentEvent.location.mapUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/15 px-5 py-3 text-white">
              View map
            </a>
          ) : null}
          {isOwner ? <Link to={`/events/${currentEvent._id}/edit`} className="rounded-2xl border border-white/15 px-5 py-3 text-white">Edit</Link> : null}
          {isOwner ? (
            <button type="button" onClick={handleDelete} className="rounded-2xl border border-red-400/40 px-5 py-3 text-red-200">
              Delete
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
