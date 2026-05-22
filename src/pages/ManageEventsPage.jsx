import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyEvents, deleteEvent } from '../store/slices/eventsSlice.js';
import { EventCard } from '../components/EventCard.jsx';
import { EmptyState, LoadingState } from '../components/StatusBlocks.jsx';

export function ManageEventsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const handleDelete = async (eventId) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    const result = await dispatch(deleteEvent(eventId));
    if (deleteEvent.fulfilled.match(result)) {
      // refresh list
      dispatch(fetchMyEvents());
    }
  };

  if (status === 'loading') return <LoadingState />;

  if (items.length === 0) {
    return <EmptyState title="No events" description="You have not created any events yet." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage events</h1>
        <Link to="/events/new" className="rounded-2xl bg-brand-500 px-4 py-2 text-white">
          Create event
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            action={
              <div className="flex gap-2">
                <Link to={`/events/${event._id}/edit`} className="rounded-2xl border border-white/15 px-4 py-2 text-white">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(event._id)}
                  className="rounded-2xl border border-red-400/40 px-4 py-2 text-red-200"
                >
                  Delete
                </button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
