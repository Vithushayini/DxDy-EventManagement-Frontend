import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchEvents } from '../store/slices/eventsSlice.js';
import { EventFilters } from '../components/EventFilters.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { EmptyState, LoadingState } from '../components/StatusBlocks.jsx';

function HomePage() {
  // const dispatch = useDispatch();
  // const { items, status } = useSelector((state) => state.events);
  const items = [];
  const status = 'idle';

  // useEffect(() => {
  //   dispatch(fetchEvents());
  // }, [dispatch]);

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

      <EventFilters />

      {status === 'loading' ? <LoadingState /> : null}

      {status !== 'loading' && items.length === 0 ? (
        <EmptyState title="No events found" description="Try a different filter or add your own event." />
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
export default HomePage;
