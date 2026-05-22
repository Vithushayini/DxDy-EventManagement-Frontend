import { useEffect, useState } from 'react';

// EventFilters is a controlled component that accepts `initialFilters` and `onChange`.
// - `initialFilters` should be an object: { search, category, city, country }
// - `onChange(filters)` is called whenever filters change (debounced by parent)
export function EventFilters({ initialFilters = {}, onChange, categories = [], countries = [], loading = false }) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    city: initialFilters.city || '',
    country: initialFilters.country || ''
  });

  // sensible defaults when nothing is provided
  const defaultCategories = ['Conference', 'Meetup', 'Workshop', 'Webinar', 'Hackathon'];
  const defaultCountries = ['Sri Lanka', 'India', 'Pakistan', 'Bangladesh', 'Nepal'];

  // merge provided lists with defaults and remove duplicates
  const mergedCategories = Array.from(new Set([...(categories || []), ...defaultCategories]));
  const mergedCountries = Array.from(new Set([...(countries || []), ...defaultCountries]));

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
      <div className="relative">
        <select
          value={filters.category}
          onChange={handleChange('category')}
          className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 text-slate-300 w-full"
          disabled={loading}
        >
          <option value="">All categories</option>
          {(loading ? [] : mergedCategories).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {loading ? (
          <div className="absolute right-3 top-3">
            <svg className="h-4 w-4 animate-spin text-slate-300" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : null}
      </div>
      <input
        value={filters.city}
        onChange={handleChange('city')}
        placeholder="City"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
      />
      <div className="relative">
        <select
          value={filters.country}
          onChange={handleChange('country')}
          className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 text-slate-300 w-full"
          disabled={loading}
        >
          <option value="">All countries</option>
          {(loading ? [] : mergedCountries).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {loading ? (
          <div className="absolute right-3 top-3">
            <svg className="h-4 w-4 animate-spin text-slate-300" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : null}
      </div>
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
