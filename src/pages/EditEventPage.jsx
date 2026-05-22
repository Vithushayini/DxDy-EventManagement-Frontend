import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { EventForm } from '../components/EventForm.jsx';
import { fetchEventById, updateEvent } from '../Redux/Features/eventsSlice';
import { LoadingState } from '../components/StatusBlocks.jsx';

function EditEventPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const event = useSelector((state) => state.events.event);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  if (!event) {
    return <LoadingState label="Loading editor..." />;
  }

  const submit = async (payload) => {
    const result = await dispatch(updateEvent({ id: eventId, data: payload }));
    if (updateEvent.fulfilled.match(result)) {
      navigate(`/events/${result.payload._id}`);
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
          startDate: event.startDate?.slice(0, 16),
          endDate: event.endDate?.slice(0, 16),
          imageUrl: event.imageUrl,
          tags: event.tags?.join(', '),
          locationName: event.location?.name,
          address: event.location?.address,
          city: event.location?.city,
          country: event.location?.country
        }}
      />
    </div>
  );
}
export default EditEventPage;
