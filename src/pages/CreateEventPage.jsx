import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../Redux/Features/eventsSlice';
import { EventForm } from '../components/EventForm.jsx';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function CreateEventPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (payload) => {
    const result = await dispatch(createEvent(payload));
    if (createEvent.fulfilled.match(result)) {
      toast.success('Event created successfully!');
      navigate(`/events/${result.payload._id}`);
    } else {
      toast.error(result.payload || 'Failed to create event');
    }
  };

  const items = useSelector((state) => state.events.items);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Create event</h1>
      <EventForm submitLabel="Save event" onSubmit={submit} />
    </div>
  );
}
export default CreateEventPage;
