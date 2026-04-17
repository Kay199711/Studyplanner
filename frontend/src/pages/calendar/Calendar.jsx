import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useRef, useState } from 'react';
import apiClient from '../../api';
import './Calendar.css';

const COLORS = [
  { id: 'blue', label: 'Blue', bg: 'rgba(59,130,246,0.25)', text: '#1d4ed8', darkText: '#93c5fd' },
  { id: 'violet', label: 'Violet', bg: 'rgba(139,92,246,0.25)', text: '#6d28d9', darkText: '#c4b5fd' },
  { id: 'red', label: 'Red', bg: 'rgba(239,68,68,0.25)', text: '#b91c1c', darkText: '#fca5a5' },
  { id: 'green', label: 'Green', bg: 'rgba(34,197,94,0.25)', text: '#15803d', darkText: '#86efac' },
  { id: 'yellow', label: 'Yellow', bg: 'rgba(234,179,8,0.25)', text: '#854d0e', darkText: '#fde047' },
];

const EMPTY_FORM = { title: '', description: '', date: '', time: '', color: 'blue' };

const getEventColor = (eventId) => {
  const source = String(eventId ?? '');
  const hash = [...source].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
};

const mapEvent = (event) => ({
  id: event.event_id,
  title: event.title,
  start: event.start_date,
  end: event.end_date,
  allDay: event.all_day,
  extendedProps: {
    description: event.description,
    color: getEventColor(event.event_id),
  },
});

export default function Calendar() {
  const calendarRef = useRef(null);
  const [monthYear, setMonthYear] = useState('');
  const [activeView, setActiveView] = useState('dayGridMonth');
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getEvents();
      setEvents(data.map(mapEvent));
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatesSet = (dateInfo) => {
    const date = dateInfo.view.currentStart;
    setMonthYear(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
    setActiveView(dateInfo.view.type);
  };

  const handleToday = () => {
    calendarRef.current?.getApi().today();
  };

  const handleViewChange = (view) => {
    calendarRef.current?.getApi().changeView(view);
    setActiveView(view);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;

    const isTimedEvent = Boolean(form.time);
    const start = isTimedEvent ? new Date(`${form.date}T${form.time}`) : new Date(`${form.date}T00:00`);
    const end = new Date(start);

    if (isTimedEvent) {
      end.setHours(end.getHours() + 1);
    } else {
      end.setDate(end.getDate() + 1);
    }

    try {
      await apiClient.createEvent(
        form.title.trim(),
        start.toISOString(),
        end.toISOString(),
        !isTimedEvent,
        form.description.trim() || null
      );

      setForm(EMPTY_FORM);
      setShowModal(false);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const renderEvent = (info) => {
    const color = info.event.extendedProps.color ?? COLORS[0];
    return (
      <div
        style={{ backgroundColor: color.bg, color: color.text }}
        className="fc-custom-event dark:!text-inherit"
      >
        {info.event.title}
      </div>
    );
  };

  const views = [
    { key: 'timeGridDay', label: 'Day' },
    { key: 'timeGridWeek', label: 'Week' },
    { key: 'dayGridMonth', label: 'Month' },
  ];

  return (
    <div className="p-4 md:p-2 bg-secondary dark:bg-primary-dark">
      <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl p-4 bg-primary dark:bg-primary-dark">
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-txt-primary dark:text-txt-primary-dark">
                Calendar
                {monthYear && (
                  <span className="font-normal text-icon dark:text-icon-dark"> - {monthYear}</span>
                )}
              </h1>
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm border border-brd-primary dark:border-brd-primary-dark rounded-full text-txt-primary dark:text-txt-primary-dark hover:bg-secondary dark:hover:bg-brd-primary-dark transition-colors"
              >
                Today
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
            >
              <span className="text-lg leading-none">+</span> Add Task
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary dark:bg-brd-primary-dark rounded-full p-1 gap-1">
              {views.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleViewChange(key)}
                  className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
                    activeView === key
                      ? 'bg-primary dark:bg-hover-dark text-txt-primary dark:text-txt-primary-dark shadow-sm'
                      : 'text-icon dark:text-icon-dark hover:text-txt-primary dark:hover:text-txt-primary-dark'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => calendarRef.current?.getApi().prev()}
                className="p-1.5 rounded-full text-icon dark:text-icon-dark hover:bg-secondary dark:hover:bg-brd-primary-dark transition-colors"
              >
                &#8249;
              </button>
              <button
                onClick={() => calendarRef.current?.getApi().next()}
                className="p-1.5 rounded-full text-icon dark:text-icon-dark hover:bg-secondary dark:hover:bg-brd-primary-dark transition-colors"
              >
                &#8250;
              </button>
            </div>
          </div>
        </div>

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
              headerToolbar={{ left: '', center: '', right: '' }}
              events={events}
              eventContent={renderEvent}
              datesSet={handleDatesSet}
              editable={true}
              selectable={true}
              height="calc(100vh - 220px)"
            />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl border-2 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-txt-primary dark:text-txt-primary-dark">New Task</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(EMPTY_FORM);
                }}
                className="text-icon dark:text-icon-dark hover:text-txt-primary dark:hover:text-txt-primary-dark transition-colors text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-txt-primary dark:text-txt-primary-dark">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  placeholder="Task title"
                  className="px-3 py-2 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-brd-primary-dark text-txt-primary dark:text-txt-primary-dark placeholder:text-icon dark:placeholder:text-icon-dark outline-none focus:border-blue-400 transition-colors text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-txt-primary dark:text-txt-primary-dark">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={3}
                  className="px-3 py-2 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-brd-primary-dark text-txt-primary dark:text-txt-primary-dark placeholder:text-icon dark:placeholder:text-icon-dark outline-none focus:border-blue-400 transition-colors text-sm resize-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-txt-primary dark:text-txt-primary-dark">Color</label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, color: color.id }))}
                      title={color.label}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color.bg,
                        outline: form.color === color.id ? `2px solid ${color.text}` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-txt-primary dark:text-txt-primary-dark">
                    Due Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                    className="px-3 py-2 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-brd-primary-dark text-txt-primary dark:text-txt-primary-dark outline-none focus:border-blue-400 transition-colors text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-txt-primary dark:text-txt-primary-dark">
                    Time <span className="text-icon dark:text-icon-dark font-normal">(optional)</span>
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((current) => ({ ...current, time: e.target.value }))}
                    className="px-3 py-2 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-brd-primary-dark text-txt-primary dark:text-txt-primary-dark outline-none focus:border-blue-400 transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm(EMPTY_FORM);
                  }}
                  className="px-4 py-2 text-sm rounded-full border border-brd-primary dark:border-brd-primary-dark text-txt-primary dark:text-txt-primary-dark hover:bg-secondary dark:hover:bg-brd-primary-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
