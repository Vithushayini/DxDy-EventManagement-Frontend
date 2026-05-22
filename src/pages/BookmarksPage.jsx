import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks, toggleBookmark } from '../Redux/Features/bookmarksSlice.js';
import { EventCard } from '../components/EventCard.jsx';
import { EmptyState } from '../components/StatusBlocks.jsx';
import { toast } from 'react-toastify';

function BookmarksPage() {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks.items);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Your bookmarks</h1>
      {bookmarks.length === 0 ? <EmptyState title="No bookmarks yet" description="Save events from the event list or detail page." /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {bookmarks.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            bookmarked={true}
            onToggleBookmark={async () => {
              const result = await dispatch(toggleBookmark(event._id));
              if (toggleBookmark.fulfilled.match(result)) {
                toast.success('Bookmark removed');
              } else {
                toast.error(result.payload || 'Unable to update bookmark');
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default BookmarksPage;
