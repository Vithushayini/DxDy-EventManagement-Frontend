import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchEvents, deleteEvent } from '../Redux/Features/eventsSlice';
import { fetchBookmarks, toggleBookmark } from '../Redux/Features/bookmarksSlice';
import { EventCard } from '../components/EventCard.jsx';
import { EmptyState, LoadingState } from '../components/StatusBlocks.jsx';
import { toast } from 'react-toastify';

function ManageEventsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading: status } = useSelector((state) => state.events);
  const { user, token } = useSelector((state) => state.auth);
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const bookmarkIds = useMemo(() => new Set(bookmarks.map((event) => event._id)), [bookmarks]);

  const [deleteId, setDeleteId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter items to only show events created by the current user (safety check)
  const userEvents = useMemo(() => {
    return items.filter((event) => event.createdBy === user?.id);
  }, [items, user?.id]);

  const selectedEvent = userEvents.find((e) => e._id === deleteId);

  useEffect(() => {
    if (user?.id) {
      setIsInitialLoad(true);
      dispatch(fetchEvents({ createdBy: user.id }));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (token) {
      dispatch(fetchBookmarks());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isInitialLoad && status !== 'loading') {
      setIsInitialLoad(false);
    }
  }, [status, isInitialLoad]);

  const handleDelete = async (eventId) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    const result = await dispatch(deleteEvent(eventId));
    if (deleteEvent.fulfilled.match(result)) {
      if (user?.id) {
        dispatch(fetchEvents({ createdBy: user.id }));
      }
    }
  };

  if (isInitialLoad || status === 'loading') return <LoadingState />;

  if (userEvents.length === 0) {
    return <EmptyState title="No events" description="You have not created any events yet." />;
  }

  const confirmDelete = async () => {
    const result = await dispatch(deleteEvent(deleteId));

    if (deleteEvent.fulfilled.match(result)) {
      toast.success('Event deleted successfully');

      if (user?.id) {
        dispatch(fetchEvents({ createdBy: user.id }));
      }
    } else {
      toast.error(result.payload || 'Failed to delete event');
    }

    setDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage events</h1>
        <Link to="/events/new" className="rounded-2xl bg-brand-500 px-4 py-2 text-white">
          Create event
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {userEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            bookmarked={bookmarkIds.has(event._id)}
            onToggleBookmark={async () => {
              const bookmarked = bookmarkIds.has(event._id);
              const result = await dispatch(toggleBookmark(event._id));
              if (toggleBookmark.fulfilled.match(result)) {
                toast.success(bookmarked ? 'Bookmark removed' : 'Bookmarked event');
              } else {
                toast.error(result.payload || 'Unable to update bookmark');
              }
            }}
            action={
              <div className="flex gap-2">
                <Link to={`/events/${event._id}/edit`} className="rounded-2xl border border-white/15 px-4 py-2 text-white">
                  Edit
                </Link>
                <button
                  type="button"
                  // onClick={() => handleDelete(event._id)}
                  onClick={() => setDeleteId(event._id)}
                  className="rounded-2xl border border-red-400/40 px-4 py-2 text-red-200"
                >
                  Delete
                </button>
              </div>
            }
          />
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl border border-white/10">

            <h2 className="text-xl font-bold text-white">
              Delete Event
            </h2>

            <p className="mt-2 text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">
                "{selectedEvent?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEventsPage;