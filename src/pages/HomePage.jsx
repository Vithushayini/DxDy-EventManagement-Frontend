import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../Redux/Features/eventsSlice';
import { fetchBookmarks, toggleBookmark } from '../Redux/Features/bookmarksSlice';
import { EventFilters } from '../components/EventFilters.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { EmptyState, LoadingState } from '../components/StatusBlocks.jsx';
import { toast } from 'react-toastify';

function HomePage() {
  const dispatch = useDispatch();
  const { items, loading: status } = useSelector((state) => state.events);
  const { token } = useSelector((state) => state.auth);
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const bookmarkIds = useMemo(
    () => new Set(bookmarks.map((event) => event._id)),
    [bookmarks]
  );

  useEffect(() => {
    // initial load
    dispatch(fetchEvents());
  }, [dispatch]);

  // filters state and debounced fetch
  const [filters, setFilters] = useState({ search: '', category: '', city: '', country: '' });
  const debounceRef = useRef(null);

  const applyFilters = useCallback((nextFilters) => {
    // build query with only present values
    const query = Object.entries(nextFilters || {}).reduce((acc, [k, v]) => {
      if (v && v.toString().trim() !== '') acc[k] = v;
      return acc;
    }, {});
    dispatch(fetchEvents(query));
  }, [dispatch]);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
    // debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyFilters(nextFilters), 400);
  }, [applyFilters]);

  useEffect(() => {
    if (token) {
      dispatch(fetchBookmarks());
    }
  }, [dispatch, token]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 p-8 shadow-glow">
        <p className="text-sm uppercase tracking-[0.4em] text-brand-300">Tech events, organized</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Discover, bookmark, and manage tech events in one place.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Search events, enrich venue data, keep a personal shortlist, and publish your own custom events when you are signed in.
        </p>
      </section>

      <EventFilters initialFilters={filters} onChange={handleFiltersChange} />

      {status === 'loading' ? <LoadingState /> : null}

      {status !== 'loading' && items.length === 0 ? (
        <EmptyState title="No events found" description="Try a different filter or add your own event." />
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((event) => (
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
          />
        ))}
      </div>
    </div>
  );
}
export default HomePage;
