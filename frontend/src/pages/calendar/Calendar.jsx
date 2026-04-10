import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRef, useState, useEffect } from 'react';
import apiClient from '../../api';

export default function Calendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    all_day: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getEvents();
      const formattedEvents = data.map(event => ({
        id: event.event_id,
        title: event.title,
        start: event.start_date,
        end: event.end_date,
        allDay: event.all_day,
        extendedProps: {
          description: event.description,
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo);
    setFormData({
      title: '',
      description: '',
      all_day: selectInfo.allDay,
    });
    setShowModal(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    try {
      const start = new Date(selectedDate.startStr);
      const end = new Date(selectedDate.endStr);
      
      // If all-day event and end is same as start, add 1 day
      if (formData.all_day && start.toDateString() === end.toDateString()) {
        end.setDate(end.getDate() + 1);
      }

      await apiClient.createEvent(
        formData.title,
        start.toISOString(),
        end.toISOString(),
        formData.all_day,
        formData.description || null
      );

      setShowModal(false);
      setFormData({ title: '', description: '', all_day: false });
      await fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ title: '', description: '', all_day: false });
  };

  return (
    <div className="p-4 md:p-2 bg-[#edede8ff] dark:bg-primary-dark">
      <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl p-4 bg-primary dark:bg-primary-dark">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 dark:text-gray-400">Loading calendar...</p>
          </div>
        ) : (
          <div className="fullcalendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
              editable={true}
              selectable={true}
              select={handleDateSelect}
              height="auto"
            />
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary dark:bg-primary-dark border-2 border-brd-primary dark:border-brd-primary-dark rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Event</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter event title"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter event description (optional)"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.all_day}
                    onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All day event</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
