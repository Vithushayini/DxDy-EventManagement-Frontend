import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../Redux/Features/eventsSlice';
import { EventForm } from '../components/EventForm.jsx';
import { useSelector } from 'react-redux';

function CreateEventPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (payload) => {
    const result = await dispatch(createEvent(payload));
    if (createEvent.fulfilled.match(result)) {
      navigate(`/events/${result.payload._id}`);
    }
  };

  const items = useSelector((state) => state.events.items);
  const categories = useMemo(() => Array.from(new Set(items.map((it) => it.category).filter(Boolean))).sort(), [items]);
  const countries = useMemo(() => Array.from(new Set(items.map((it) => it.location?.country).filter(Boolean))).sort(), [items]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Create event</h1>
      <EventForm submitLabel="Save event" onSubmit={submit} categories={categories} countries={countries} loadingOptions={items.length === 0} />
    </div>
  );
}
export default CreateEventPage;
