import { useDispatch, useSelector } from 'react-redux';
// import { fetchEvents, setFilter } from '../store/slices/eventsSlice.js';

export function EventFilters() {
  // const dispatch = useDispatch();
  // const filters = useSelector((state) => state.events.filters);
const filters = {
  search: '',
  category: '',
};


  const updateFilter = (field) => (event) => {
    // dispatch(setFilter({ [field]: event.target.value }));
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 lg:grid-cols-5">
      <input
        value={filters.search}
        // onChange={updateFilter('search')}
        placeholder="Search events"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <input
        value={filters.category}
        // onChange={updateFilter('category')}
        placeholder="Category"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <input
        value={filters.city}
        // onChange={updateFilter('city')}
        placeholder="City"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <input
        value={filters.country}
        // onChange={updateFilter('country')}
        placeholder="Country"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <button
        type="button"
        // onClick={() => dispatch(fetchEvents())}
        className="rounded-2xl bg-brand-500 px-4 py-3 font-medium text-white transition hover:bg-brand-400"
      >
        Apply filters
      </button>
    </div>
  );
}
