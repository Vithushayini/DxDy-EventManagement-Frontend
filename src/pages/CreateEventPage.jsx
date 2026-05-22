import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../store/slices/eventsSlice.js';
import { EventForm } from '../components/EventForm.jsx';

export function CreateEventPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (payload) => {
    const result = await dispatch(createEvent(payload));
    if (createEvent.fulfilled.match(result)) {
      navigate(`/events/${result.payload._id}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Create event</h1>
      <EventForm submitLabel="Save event" onSubmit={submit} />
    </div>
  );
}
