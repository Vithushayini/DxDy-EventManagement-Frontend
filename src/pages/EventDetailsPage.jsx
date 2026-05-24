import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteEvent, fetchEventById } from '../Redux/Features/eventsSlice';
import { fetchBookmarks, toggleBookmark } from '../Redux/Features/bookmarksSlice';
import { LoadingState } from '../components/StatusBlocks.jsx';
import { toast } from 'react-toastify';
import { formatDateForDisplay, formatTimeForDisplay } from '../utils/dateUtils.js';

function EventDetailsPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { event: currentEvent } = useSelector((state) => state.events);
  const { token, user } = useSelector((state) => state.auth);
  const bookmarks = useSelector((state) => state.bookmarks.items);

  const [deleteId, setDeleteId] = useState(null);

  const bookmarkIds = useMemo(
    () => new Set(bookmarks.map((item) => item._id)),
    [bookmarks]
  );

  const isBookmarked = bookmarkIds.has(currentEvent?._id);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    if (token) {
      dispatch(fetchBookmarks());
    }
  }, [dispatch, token]);

  if (!currentEvent) {
    return <LoadingState label="Loading event details..." />;
  }

  const createdById = currentEvent.createdBy?._id || currentEvent.createdBy;
  const isOwner = user && createdById && createdById === user.id;

  // ✅ Confirm delete
  const confirmDelete = async () => {
    const result = await dispatch(deleteEvent(eventId));

    if (deleteEvent.fulfilled.match(result)) {
      toast.success('Event deleted successfully');
      navigate('/');
    } else {
      toast.error(result.payload || 'Failed to delete event');
    }

    setDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* MAIN CARD */}
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">
          {currentEvent.category}
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white">
          {currentEvent.title}
        </h1>

        <p className="mt-4 text-slate-300">
          {currentEvent.description}
        </p>

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

          <div>
            <dt className="text-slate-500">Start Date & Time</dt>
            <dd>
              {formatDateForDisplay(currentEvent.startDate)} at{' '}
              {formatTimeForDisplay(currentEvent.startTime)}
            </dd>
          </div>

          {currentEvent.endDate && currentEvent.endTime && (
            <div>
              <dt className="text-slate-500">End Date & Time</dt>
              <dd>
                {formatDateForDisplay(currentEvent.endDate)} at{' '}
                {formatTimeForDisplay(currentEvent.endTime)}
              </dd>
            </div>
          )}
        </dl>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-wrap gap-3">

          {token && (
            <button
              type="button"
              onClick={async () => {
                const result = await dispatch(toggleBookmark(currentEvent._id));

                if (toggleBookmark.fulfilled.match(result)) {
                  toast.success(
                    isBookmarked ? 'Bookmark removed' : 'Event bookmarked'
                  );
                } else {
                  toast.error(result.payload || 'Unable to update bookmark');
                }
              }}
              className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white"
            >
              {isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
            </button>
          )}

          {currentEvent.location?.mapUrl && (
            <a
              href={currentEvent.location.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/15 px-5 py-3 text-white"
            >
              View map
            </a>
          )}

          {isOwner && (
            <Link
              to={`/events/${currentEvent._id}/edit`}
              className="rounded-2xl border border-white/15 px-5 py-3 text-white"
            >
              Edit
            </Link>
          )}

          {isOwner && (
            <button
              type="button"
              onClick={() => setDeleteId(currentEvent._id)}
              className="rounded-2xl border border-red-400/40 px-5 py-3 text-red-200"
            >
              Delete
            </button>
          )}
        </div>
      </section>

      {/* 🔥 DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl border border-white/10">

            <h2 className="text-xl font-bold text-white">
              Delete Event
            </h2>

            <p className="mt-2 text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">
                "{currentEvent?.title}"
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

export default EventDetailsPage;