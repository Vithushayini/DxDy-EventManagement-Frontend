import { useEffect, useState } from 'react';

// EventFilters is a controlled component that accepts `initialFilters` and `onChange`.
// - `initialFilters` should be an object: { search, category, city, country }
// - `onChange(filters)` is called whenever filters change (debounced by parent)
export function EventFilters({ initialFilters = {}, onChange }) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    city: initialFilters.city || '',
    country: initialFilters.country || ''
  });

  useEffect(() => {
    // Keep local state in sync if parent changes initialFilters
    setFilters((prev) => ({ ...prev, ...initialFilters }));
  }, [initialFilters.search, initialFilters.category, initialFilters.city, initialFilters.country]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const next = { ...filters, [field]: value };
    setFilters(next);
    if (typeof onChange === 'function') onChange(next);
  };

  const handleClear = () => {
    const next = { search: '', category: '', city: '', country: '' };
    setFilters(next);
    if (typeof onChange === 'function') onChange(next);
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 lg:grid-cols-5">
      <input
        value={filters.search}
        onChange={handleChange('search')}
        placeholder="Search events"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <input
        value={filters.category}
        onChange={handleChange('category')}
        placeholder="Category"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <input
        value={filters.city}
        onChange={handleChange('city')}
        placeholder="City"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <input
        value={filters.country}
        onChange={handleChange('country')}
        placeholder="Country"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange && onChange(filters)}
          className="flex-1 rounded-2xl bg-brand-500 px-4 py-3 font-medium text-white transition hover:bg-brand-400"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-2xl border border-white/10 px-4 py-3 text-slate-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
