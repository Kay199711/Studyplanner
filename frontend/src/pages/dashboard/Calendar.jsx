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
    const hour = i;
    const label = to12Hr(`${String(hour).padStart(2, '0')}:00`);
    return { hour, label };
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
            <div
              key={i}
              className="flex items-start gap-3 border-b border-brd-primary dark:border-brd-primary-dark last:border-b-0 px-3 py-2 bg-primary dark:bg-primary-dark flex-1"
            >
              <div className="w-16 shrink-0">
                <span className="text-xs font-medium opacity-70 block">
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
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
          const event = sortedEvents.find(e => e.startTime?.startsWith(String(hour.hour).padStart(2, '0')));
          return (
            <div key={hour.hour} className="flex items-center gap-2 border-b border-brd-primary dark:border-brd-primary-dark last:border-b-0 px-3 h-10">
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
    <div className="p-4 md:p-2 bg-secondary dark:bg-primary-dark">
      <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl p-4 bg-primary dark:bg-primary-dark">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevPeriod} className="px-3 py-1 bg-secondary dark:bg-secondary-dark rounded hover:bg-blue-100 dark:hover:bg-blue-900">&lt;</button>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {calendarView === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              {calendarView === 'week' && `Week of ${formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())}`}
              {calendarView === 'day' && formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())}
            </h2>
            <div className="flex gap-1">
              <button onClick={() => setCalendarView('month')} className={`px-2 py-1 text-xs rounded ${calendarView === 'month' ? 'bg-blue-500 text-white' : 'bg-secondary dark:bg-secondary-dark'}`}>Month</button>
              <button onClick={() => setCalendarView('week')} className={`px-2 py-1 text-xs rounded ${calendarView === 'week' ? 'bg-blue-500 text-white' : 'bg-secondary dark:bg-secondary-dark'}`}>Week</button>
              <button onClick={() => setCalendarView('day')} className={`px-2 py-1 text-xs rounded ${calendarView === 'day' ? 'bg-blue-500 text-white' : 'bg-secondary dark:bg-secondary-dark'}`}>Day</button>
            </div>
          </div>
          <button onClick={nextPeriod} className="px-3 py-1 bg-secondary dark:bg-secondary-dark rounded hover:bg-blue-100 dark:hover:bg-blue-900">&gt;</button>
        </div>
        {calendarView === 'month' && renderMonthView()}
        {calendarView === 'week' && renderWeekView()}
        {calendarView === 'day' && renderDayView()}
        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <IoIosAddCircleOutline />
            Add Event
          </button>
          {showDropdown && (
            <div ref={dropdownRef} className="absolute mt-2 p-3 bg-primary dark:bg-primary-dark border border-brd-primary dark:border-brd-primary-dark rounded shadow-lg z-10">
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 mb-2 border border-brd-primary dark:border-brd-primary-dark rounded bg-secondary dark:bg-secondary-dark"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2 mb-2 border border-brd-primary dark:border-brd-primary-dark rounded bg-secondary dark:bg-secondary-dark"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="time"
                  placeholder="Start time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                  className="flex-1 p-2 border border-brd-primary dark:border-brd-primary-dark rounded bg-secondary dark:bg-secondary-dark"
                />
                <input
                  type="time"
                  placeholder="End time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                  className="flex-1 p-2 border border-brd-primary dark:border-brd-primary-dark rounded bg-secondary dark:bg-secondary-dark"
                />
              </div>
              <button onClick={addEvent} className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
