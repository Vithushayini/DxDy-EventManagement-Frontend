import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventForm } from '../components/EventForm.jsx';
import { fetchEventById, updateEvent } from '../Redux/Features/eventsSlice';
import { LoadingState } from '../components/StatusBlocks.jsx';
import { toast } from 'react-toastify';

function EditEventPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const event = useSelector((state) => state.events.event);
  const items = useSelector((state) => state.events.items);

  const categories = useMemo(() => Array.from(new Set(items.map((it) => it.category).filter(Boolean))).sort(), [items]);
  const countries = useMemo(() => Array.from(new Set(items.map((it) => it.location?.country).filter(Boolean))).sort(), [items]);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  // if (!event) {
  //   return <LoadingState label="Loading editor..." />;
  // }

  if (!event || event._id !== eventId) {
  return <LoadingState label="Loading editor..." />;
}

  const submit = async (payload) => {
    const result = await dispatch(updateEvent({ id: eventId, data: payload }));
    if (updateEvent.fulfilled.match(result)) {
      toast.success('Event updated successfully!');
      navigate(`/events/${result.payload._id}`);
    } else {
      toast.error(result.payload || 'Failed to update event');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Edit event</h1>
      <EventForm
        submitLabel="Update event"
        onSubmit={submit}
        initialValues={{
          title: event.title,
          description: event.description,
          category: event.category,
          organizer: event.organizer,
          startDate: event.startDate || '',
          startTime: event.startTime || '',
          endDate: event.endDate || '',
          endTime: event.endTime || '',
          imageUrl: event.imageUrl,
          tags: event.tags?.join(', '),
          locationName: event.location?.name,
          address: event.location?.address,
          city: event.location?.city,
          country: event.location?.country
        }}
        categories={categories}
        countries={countries}
        loadingOptions={items.length === 0}
      />
    </div>
  );
}
export default EditEventPage;
