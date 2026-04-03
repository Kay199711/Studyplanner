import { useState, useRef, useEffect } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import api from '../../api.js';

const to12Hr = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

const toDateStr = (raw) => {
  if (!raw) return '';
  return new Date(raw).toISOString().split('T')[0];
};

const toTimeStr = (raw) => {
  if (!raw) return '00:00';
  return new Date(raw).toISOString().split('T')[1].slice(0, 5);
};

const mapEvent = (e) => ({
  id: String(e.event_id),
  title: e.title,
  date: toDateStr(e.start_date),
  startTime: toTimeStr(e.start_date),
  endTime: toTimeStr(e.end_date),
  completed: false,
  allDay: e.all_day,
});

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarView, setCalendarView] = useState('month');
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '', endTime: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dayViewRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api.getEvents()
      .then(data => setEvents(data.map(mapEvent)))
      .catch(err => console.error('Failed to fetch events:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (calendarView !== 'day' || !dayViewRef.current) return;
    const dateStr = formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const incomplete = events
      .filter(e => e.date === dateStr && !e.completed)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    setTimeout(() => {
      if (!dayViewRef.current) return;
      const slotHeight = dayViewRef.current.scrollHeight / 24;
      const scrollHour = incomplete.length > 0
        ? Math.max(0, parseInt(incomplete[0].startTime.split(':')[0]) - 3)
        : 8;
      dayViewRef.current.scrollTop = scrollHour * slotHeight;
    }, 50);
  }, [calendarView, currentDate, events]);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDateStr = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const formatTimeDisplay = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    if (startTime === '00:00' && endTime === '23:59') return 'All day';
    return `${to12Hr(startTime)} - ${to12Hr(endTime)}`;
  };
  const getEventsForDay = (dateStr) => events.filter(e => e.date === dateStr);
  const getWeekDays = () => {
    const day = currentDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const prevPeriod = () => {
    if (calendarView === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else if (calendarView === 'week') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
  };

  const nextPeriod = () => {
    if (calendarView === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    else if (calendarView === 'week') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const startDateTime = `${newEvent.date}T${newEvent.startTime || '00:00'}:00`;
    const endDateTime = `${newEvent.date}T${newEvent.endTime || '23:59'}:00`;
    const isAllDay = !newEvent.startTime && !newEvent.endTime;
    api.createEvent(newEvent.title, startDateTime, endDateTime, isAllDay)
      .then(saved => {
        setEvents(prev => [...prev, mapEvent(saved)]);
        setNewEvent({ title: '', date: '', startTime: '', endTime: '' });
        setShowDropdown(false);
      })
      .catch(err => console.error('Failed to add event:', err));
  };

  const deleteEvent = (id) => {
    api.deleteEvent(id)
      .then(() => setEvents(prev => prev.filter(e => e.id !== id)))
      .catch(err => console.error('Failed to delete event:', err));
  };

  const toggleComplete = (id) => {
    setEvents(prev => prev.map(e =>
      e.id === id ? { ...e, completed: !e.completed } : e
    ));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => {
    const period = i >= 12 ? 'PM' : 'AM';
    const hour = i % 12 || 12;
    return { label: `${hour} ${period}`, value: String(i).padStart(2, '0') };
  });

  const renderDayInfo = () => {
    if (!selectedDay) return (
      <div className="mt-3 p-3 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark">
        <p className="text-xs opacity-40 text-center">Click a day to see details</p>
      </div>
    );
    const dateStr = formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    const dayEvents = getEventsForDay(dateStr);
    const weekday = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay)
      .toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = `${weekday}, ${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`;
    return (
      <div className="mt-3 p-3 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">{fullDate}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">
            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
          </span>
        </div>
        {dayEvents.length === 0 ? (
          <p className="text-xs opacity-50">No events this day</p>
        ) : (
          <div className="space-y-1 max-h-24 overflow-auto">
            {dayEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between text-xs p-1.5 rounded-md bg-primary dark:bg-primary-dark">
                <span className={`font-medium ${event.completed ? 'line-through opacity-50' : ''}`}>
                  {event.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="opacity-50">{formatTimeDisplay(event.startTime, event.endTime)}</span>
                  <button onClick={() => toggleComplete(event.id)} className="opacity-40 hover:opacity-100">✓</button>
                  <button onClick={() => deleteEvent(event.id)} className="opacity-40 hover:opacity-100 text-red-500">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 border border-brd-primary dark:border-brd-primary-dark rounded-t-lg overflow-hidden">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium py-2 bg-secondary dark:bg-secondary-dark border-r border-brd-primary dark:border-brd-primary-dark last:border-r-0 opacity-60">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-r border-b border-brd-primary dark:border-brd-primary-dark rounded-b-lg overflow-hidden">
        {Array.from({ length: (getFirstDayOfMonth(currentDate) + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square border-r border-b border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark" />
        ))}
        {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayEvents = getEventsForDay(dateStr);
          return (
            <div
              key={day}
              onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              className={`aspect-square border-r border-b border-brd-primary dark:border-brd-primary-dark p-1 cursor-pointer flex flex-col ${
                selectedDay === day
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-secondary dark:bg-secondary-dark hover:bg-blue-50 dark:hover:bg-blue-950'
              }`}
            >
              <span className="text-xs font-bold">{day}</span>
              {dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />}
            </div>
          );
        })}
      </div>
      {renderDayInfo()}
    </div>
  );

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    return (
      <div className="rounded-lg border border-brd-primary dark:border-brd-primary-dark overflow-hidden w-full flex flex-col flex-1">
        {weekDays.map((d, i) => {
          const dateStr = formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
          const dayEvents = getEventsForDay(dateStr);
          return (
            <div key={i} className="flex items-start gap-3 border-b border-brd-primary dark:border-brd-primary-dark last:border-b-0 px-3 py-2 bg-primary dark:bg-primary-dark flex-1">
              <div className="w-16 shrink-0">
                <span className="text-xs font-medium opacity-70 block">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-sm font-bold">{d.getDate()}</span>
              </div>
              <div className="flex-1 flex flex-wrap gap-1 items-center">
                {dayEvents.length === 0 ? (
                  <span className="text-xs font-medium opacity-60">No events</span>
                ) : (
                  dayEvents.map(event => (
                    <div key={event.id} className={`text-xs px-2 py-1 rounded bg-blue-500 text-white ${event.completed ? 'opacity-50' : ''}`}>
                      {event.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const sortedEvents = [...getEventsForDay(dateStr)].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return (
      <div ref={dayViewRef} className="rounded-lg border border-brd-primary dark:border-brd-primary-dark w-full flex-1 min-h-0 overflow-y-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 transparent' }}>
        {hours.map((hour) => {
          const event = sortedEvents.find(e => e.startTime?.startsWith(hour.value));
          return (
            <div key={hour.value} className="flex items-center gap-2 border-b border-brd-primary dark:border-brd-primary-dark last:border-b-0 px-3 h-10">
              <span className="text-xs opacity-50 w-14 shrink-0">{hour.label}</span>
              <div className="flex-1">
                {event && (
                  <div className={`text-xs px-2 py-1 rounded bg-blue-500 text-white truncate ${event.completed ? 'opacity-50' : ''}`}>
                    {event.title} · {formatTimeDisplay(event.startTime, event.endTime)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl h-full p-4 bg-primary dark:bg-primary-dark gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between w-full relative" ref={dropdownRef}>
        <p className="font-bold text-lg">
          {calendarView === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          {calendarView === 'week' && `Week of ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`}
          {calendarView === 'day' && `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={prevPeriod} className="px-2 py-1 rounded-md border border-brd-primary dark:border-brd-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark text-sm">←</button>
          <button onClick={nextPeriod} className="px-2 py-1 rounded-md border border-brd-primary dark:border-brd-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark text-sm">→</button>
          <IoIosAddCircleOutline className="w-6 h-6 cursor-pointer hover:text-blue-500" onClick={() => setShowDropdown(prev => !prev)} />
        </div>

        {/* Add Event Dropdown */}
        {showDropdown && (
          <div className="absolute top-10 right-0 z-50 w-72 bg-primary dark:bg-primary-dark border border-brd-primary dark:border-brd-primary-dark rounded-lg shadow-lg p-4 flex flex-col gap-3">
            <p className="text-sm font-semibold">Add Event</p>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark focus:outline-none"
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className="flex-1 px-3 py-2 text-sm rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark focus:outline-none"
              />
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className="flex-1 px-3 py-2 text-sm rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={addEvent} className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Add</button>
              <button onClick={() => setShowDropdown(false)} className="flex-1 px-3 py-2 text-sm bg-secondary dark:bg-secondary-dark rounded-md border border-brd-primary dark:border-brd-primary-dark">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* View Switcher */}
      <div className="flex gap-1">
        {['day', 'week', 'month'].map(view => (
          <button
            key={view}
            onClick={() => setCalendarView(view)}
            className={`flex-1 py-1 text-xs rounded-md capitalize border ${
              calendarView === view
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-transparent border-brd-primary dark:border-brd-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm opacity-50">Loading events...</p>
        </div>
      )}

      {!loading && calendarView === 'month' && renderMonthView()}
      {!loading && calendarView === 'week' && renderWeekView()}
      {!loading && calendarView === 'day' && renderDayView()}
    </div>
  );
}
