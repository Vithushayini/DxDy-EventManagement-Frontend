import { useMemo, useState } from 'react';
import { combineDateTime } from '../utils/dateUtils.js';
import LocationSearch from './LocationSearch.jsx';

const defaultForm = {
  title: '',
  description: '',
  category: '',
  organizer: '',
  startDate: '', // YYYY-MM-DD
  startTime: '', // HH:MM
  endDate: '', // YYYY-MM-DD
  endTime: '', // HH:MM
  imageUrl: '',
  tags: '',
  locationName: '',
  address: '',
  city: '',
  country: ''
};

const defaultErrors = {
  title: '',
  description: '',
  category: '',
  organizer: '',
  startDate: '',
  startTime: '',
  locationName: '',
  country: ''
};

export function EventForm({ initialValues, onSubmit, submitLabel }) {
  const mergedValues = useMemo(() => ({ ...defaultForm, ...initialValues }), [initialValues]);
  const [form, setForm] = useState(mergedValues);
  const [errors, setErrors] = useState(defaultErrors);

  const defaultCategories = ['Conference', 'Meetup', 'Workshop', 'Webinar', 'Seminar', 'Hackathon'];
  const defaultCountries = ['Sri Lanka', 'India', 'Pakistan', 'Bangladesh', 'Nepal'];
  // const mergedCategories = Array.from(new Set([...(categories || []), ...defaultCategories]));
  // const mergedCountries = Array.from(new Set([...(countries || []), ...defaultCountries]));

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);

    if (!form.title.trim()) newErrors.title = 'Event title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.organizer.trim()) newErrors.organizer = 'Organizer is required';
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.startTime) newErrors.startTime = 'Start time is required';
    if (!form.locationName.trim()) newErrors.locationName = 'Venue name is required';
    if (!form.country) newErrors.country = 'Country is required';

    // ❌ Past date check
    if (form.startDate && startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    // ❌ End date before start date
    if (form.endDate) {
      if (endDate < startDate) {
        newErrors.endDate = 'End date must be after start date';
      }

      // ❌ Same day time validation
      if (form.startDate === form.endDate) {
        if (form.endTime && form.startTime) {
          if (form.endTime <= form.startTime) {
            newErrors.endTime = 'End time must be after start time';
          }
        }
      }
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Combine date and time for start and end
    const startDateTime = combineDateTime(form.startDate, form.startTime);
    const endDateTime = form.endDate && form.endTime ? combineDateTime(form.endDate, form.endTime) : undefined;

    if (!startDateTime) {
      setErrors((current) => ({ ...current, startDate: 'Invalid start date/time' }));
      return;
    }

    onSubmit({
      title: form.title,
      description: form.description,
      category: form.category,
      organizer: form.organizer,
      startDate: form.startDate,
      startTime: form.startTime,
      endDate: form.endDate || undefined,
      endTime: form.endTime || undefined,
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
        <div>
          <input
            value={form.title}
            onChange={update('title')}
            placeholder="Event title"
            className={`input ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>
        <div>
          <select
            value={form.category}
            onChange={update('category')}
            className={`input ${errors.category ? 'border-red-500' : ''}`}
          // disabled={loadingOptions}
          >
            <option value="">Select category</option>
            {defaultCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            {/* {loadingOptions ? <option>Loading...</option> : mergedCategories.map((c) => <option key={c} value={c}>{c}</option>)} */}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
        </div>
      </div>

      <div>
        <textarea
          value={form.description}
          onChange={update('description')}
          placeholder="Description"
          className={`input min-h-40 ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <input
            value={form.organizer}
            onChange={update('organizer')}
            placeholder="Organizer"
            className={`input ${errors.organizer ? 'border-red-500' : ''}`}
          />
          {errors.organizer && <p className="mt-1 text-sm text-red-400">{errors.organizer}</p>}
        </div>
        <input
          value={form.imageUrl}
          onChange={update('imageUrl')}
          placeholder="Image URL"
          className="input"
        />
      </div>

      {/* Start Date and Time */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-300">Event Start</label>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <input
              type="date"
              value={form.startDate}
              onChange={update('startDate')}
              min={form.startDate || new Date().toISOString().split('T')[0]}
              className={`input ${errors.startDate ? 'border-red-500' : ''}`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>}
          </div>
          <div>
            <input
              type="time"
              value={form.startTime}
              onChange={update('startTime')}
              className={`input ${errors.startTime ? 'border-red-500' : ''}`}
            />
            {errors.startTime && <p className="mt-1 text-sm text-red-400">{errors.startTime}</p>}
          </div>
        </div>
      </div>

      {/* End Date and Time */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-300">Event End (Optional)</label>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="date"
            value={form.endDate}
            onChange={update('endDate')}
            min={form.startDate}
            className="input"
          />
          <input
            type="time"
            value={form.endTime}
            onChange={update('endTime')}
            className="input"
          />
        </div>
        {errors.endDate && (
          <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
        )}
        {errors.endTime && (
          <p className="mt-1 text-sm text-red-400">{errors.endTime}</p>
        )}
      </div>

      <input
        value={form.tags}
        onChange={update('tags')}
        placeholder="Tags separated by commas"
        className="input"
      />

      {/* <LocationSearch
        value={form.locationName} 
        onChange={update('locationName')}/> */}

      <LocationSearch
        onSelect={(location) => {
          setForm((prev) => ({
            ...prev,
            locationName: location.name,
            address: location.address,
            city: location.city,
            country: location.country
          }));
        }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <input
            value={form.locationName}
            onChange={update('locationName')}
            placeholder="Venue name"
            className={`input ${errors.locationName ? 'border-red-500' : ''}`}
          />
          {errors.locationName && <p className="mt-1 text-sm text-red-400">{errors.locationName}</p>}
        </div>
        <input
          value={form.address}
          onChange={update('address')}
          placeholder="Address"
          className="input"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.city}
          onChange={update('city')}
          placeholder="City"
          className="input"
        />
        <div>
          <select
            value={form.country}
            onChange={update('country')}
            className={`input ${errors.country ? 'border-red-500' : ''}`}
          // disabled={loadingOptions}
          >
            <option value="">Select country</option>
            {defaultCountries.map((c) => <option key={c} value={c}>{c}</option>)}
            {/* {loadingOptions ? <option>Loading...</option> : mergedCountries.map((c) => <option key={c} value={c}>{c}</option>)} */}
          </select>
          {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country}</p>}
        </div>
      </div>

      <button type="submit" className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-400">
        {submitLabel}
      </button>
    </form>
  );
}
