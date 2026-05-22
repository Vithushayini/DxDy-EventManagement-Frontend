import { useMemo, useState } from 'react';

const defaultForm = {
  title: '',
  description: '',
  category: '',
  organizer: '',
  startDate: '',
  endDate: '',
  imageUrl: '',
  tags: '',
  locationName: '',
  address: '',
  city: '',
  country: ''
};

export function EventForm({ initialValues, onSubmit, submitLabel, categories = [], countries = [], loadingOptions = false }) {
  const mergedValues = useMemo(() => ({ ...defaultForm, ...initialValues }), [initialValues]);
  const [form, setForm] = useState(mergedValues);

  const defaultCategories = ['Conference', 'Meetup', 'Workshop', 'Webinar', 'Hackathon'];
  const defaultCountries = ['Sri Lanka', 'India', 'Pakistan', 'Bangladesh', 'Nepal'];
  const mergedCategories = Array.from(new Set([...(categories || []), ...defaultCategories]));
  const mergedCountries = Array.from(new Set([...(countries || []), ...defaultCountries]));

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      title: form.title,
      description: form.description,
      category: form.category,
      organizer: form.organizer,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      imageUrl: form.imageUrl || undefined,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      location: {
        name: form.locationName,
        address: form.address,
        city: form.city,
        country: form.country
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.title} onChange={update('title')} placeholder="Event title" className="input" />
        <select value={form.category} onChange={update('category')} className="input" disabled={loadingOptions}>
          <option value="">Select category</option>
          {loadingOptions ? <option>Loading...</option> : mergedCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <textarea value={form.description} onChange={update('description')} placeholder="Description" className="input min-h-40" />
      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.organizer} onChange={update('organizer')} placeholder="Organizer" className="input" />
        <input value={form.imageUrl} onChange={update('imageUrl')} placeholder="Image URL" className="input" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input type="datetime-local" value={form.startDate} onChange={update('startDate')} className="input" />
        <input type="datetime-local" value={form.endDate} onChange={update('endDate')} className="input" />
      </div>
      <input value={form.tags} onChange={update('tags')} placeholder="Tags separated by commas" className="input" />
      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.locationName} onChange={update('locationName')} placeholder="Venue name" className="input" />
        <input value={form.address} onChange={update('address')} placeholder="Address" className="input" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.city} onChange={update('city')} placeholder="City" className="input" />
        <select value={form.country} onChange={update('country')} className="input" disabled={loadingOptions}>
          <option value="">Select country</option>
          {loadingOptions ? <option>Loading...</option> : mergedCountries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button type="submit" className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-400">
        {submitLabel}
      </button>
    </form>
  );
}
