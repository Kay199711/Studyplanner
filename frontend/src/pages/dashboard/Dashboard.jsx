import { useState } from 'react';

const initialTodos = [
  { id: 1, title: 'Read 20 pages', completed: false, date: '2026-01-01', startTime: '14:00', endTime: '15:00' },
  { id: 2, title: 'Complete project intent form', completed: false, date: '2026-01-01', startTime: '15:00', endTime: '16:00' },
  { id: 3, title: 'Finish research paper outline', completed: false, date: '2026-01-02', startTime: '10:00', endTime: '11:00' },
];

const to12Hr = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

export default function Dashboard() {

  // ---- STATE ----
  const [todos, setTodos] = useState(initialTodos);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', date: '', startTime: '', endTime: '' });
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarView, setCalendarView] = useState('month');

  // ---- TODO FUNCTIONS ----
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addTodo = () => {
    if (!newTask.title || !newTask.date) return;
    const todo = {
      id: Date.now(),
      title: newTask.title,
      completed: false,
      date: newTask.date,
      startTime: newTask.startTime || '00:00',
      endTime: newTask.endTime || '23:59',
    };
    setTodos([...todos, todo]);
    setNewTask({ title: '', date: '', startTime: '', endTime: '' });
    setShowPopup(false);
  };

  // ---- NOTES FUNCTIONS ----
  const saveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  // ---- CALENDAR FUNCTIONS ----
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
    }
  };

  const nextPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
  };

  const getEventsForDay = (dateStr) => {
    return todos.filter(todo => todo.date === dateStr);
  };

  const formatDateStr = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const formatTimeDisplay = (startTime, endTime) => {
    if (startTime === '00:00' && endTime === '23:59') return 'All day';
    return `${to12Hr(startTime)} - ${to12Hr(endTime)}`;
  };

  const getWeekDays = () => {
    const dayOfWeek = currentDate.getDay();
    const diffToMonday = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + diffToMonday);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const hours = Array.from({ length: 18 }, (_, i) => {
    const raw = i + 6;
    const period = raw >= 12 ? 'PM' : 'AM';
    const hour = raw % 12 || 12;
    return { label: `${hour} ${period}`, value: String(raw).padStart(2, '0') };
  });

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ---- SELECTED DAY INFO PANEL ----
  const renderDayInfo = () => {
    if (!selectedDay) return (
      <div className="mt-3 p-3 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark">
        <p className="text-xs opacity-40 text-center">Click a day to see details</p>
      </div>
    );

    const dateStr = formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    const events = getEventsForDay(dateStr);
    const fullDate = `${dayNames[new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).getDay()]}, ${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`;

    return (
      <div className="mt-3 p-3 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">{fullDate}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">
            {events.length} {events.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        {events.length === 0 ? (
          <p className="text-xs opacity-50">No tasks this day</p>
        ) : (
          <div className="space-y-1 max-h-24 overflow-auto">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between text-xs p-1.5 rounded-md bg-primary dark:bg-primary-dark">
                <span className="font-medium">{event.title}</span>
                <span className="opacity-50">{formatTimeDisplay(event.startTime, event.endTime)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---- RENDER CALENDAR VIEWS ----
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
        {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square border-r border-b border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark" />
        ))}
        {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDateStr(currentDate.getFullYear(), currentDate.getMonth(), day);
          const events = getEventsForDay(dateStr);
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
              {events.length > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />
              )}
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
      <div className="flex flex-col gap-2 flex-1">
        {weekDays.map((d, i) => {
          const dateStr = formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
          const events = getEventsForDay(dateStr);
          return (
            <div
              key={i}
              className="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark"
            >
              <div className="w-20 shrink-0">
                <span className="text-sm font-bold block">{fullDayNames[i]}</span>
                <span className="text-xs opacity-50">{monthNames[d.getMonth()].slice(0, 3)} {d.getDate()}</span>
              </div>
              <div className="flex-1 flex flex-wrap gap-1 items-center">
                {events.length === 0 ? (
                  <span className="text-xs opacity-30">No tasks</span>
                ) : (
                  events.map(event => (
                    <div key={event.id} className="text-xs px-2 py-1 rounded-md bg-blue-500 text-white">
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
    const events = getEventsForDay(dateStr);
    return (
      <div className="rounded-lg border border-brd-primary dark:border-brd-primary-dark overflow-hidden w-full">
        {hours.map((hour) => {
          const hourEvents = events.filter(e => e.startTime && e.startTime.startsWith(hour.value));
          return (
            <div
              key={hour.value}
              className="flex items-start gap-2 border-b border-brd-primary dark:border-brd-primary-dark last:border-b-0 px-3 py-2"
            >
              <span className="text-xs opacity-50 w-14 shrink-0 pt-0.5">{hour.label}</span>
              <div className="flex-1 space-y-1">
                {hourEvents.map(event => (
                  <div key={event.id} className="text-xs p-1 rounded bg-blue-500 text-white">
                    {event.title} · {formatTimeDisplay(event.startTime, event.endTime)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ---- RENDER ----
  return (
    <div className="p-6 h-full grid grid-cols-3 gap-4 overflow-hidden">

      {/* Todo Widget */}
      <div className="bg-primary dark:bg-primary-dark rounded-lg border border-brd-primary dark:border-brd-primary-dark p-4 flex flex-col overflow-hidden">
        <h2 className="font-semibold text-lg mb-3">Todo</h2>
        <div className="mb-3">
          <button
            onClick={() => setShowPopup(true)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Task
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-auto">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-start gap-3 p-3 rounded-md bg-secondary dark:bg-secondary-dark">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${
                  todo.completed
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-400 dark:border-gray-500 bg-transparent'
                }`}
              />
              <div className="flex-1">
                <p className={`font-semibold text-sm ${todo.completed ? 'line-through opacity-50' : ''}`}>
                  {todo.title}
                </p>
                <p className="text-xs opacity-50 mt-0.5">
                  {todo.date} · {formatTimeDisplay(todo.startTime, todo.endTime)}
                </p>
              </div>
              <button onClick={() => removeTodo(todo.id)} className="text-red-500 hover:text-red-700 text-sm mt-0.5">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Widget */}
      <div className="bg-primary dark:bg-primary-dark rounded-lg border border-brd-primary dark:border-brd-primary-dark p-4 flex flex-col overflow-hidden">
        <h2 className="font-semibold text-lg mb-3">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes here..."
          className="flex-1 w-full p-3 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark resize-none focus:outline-none"
        />
        <button
          onClick={saveNotes}
          className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {notesSaved ? 'Saved!' : 'Save Notes'}
        </button>
      </div>

      {/* Calendar Widget */}
      <div className="bg-primary dark:bg-primary-dark rounded-lg border border-brd-primary dark:border-brd-primary-dark p-4 flex flex-col gap-3 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-lg">
            {calendarView === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {calendarView === 'week' && `Week of ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`}
            {calendarView === 'day' && `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
          </span>
          <div className="flex gap-1">
            <button onClick={prevPeriod} className="px-2 py-1 rounded-md border border-brd-primary dark:border-brd-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark text-sm">←</button>
            <button onClick={nextPeriod} className="px-2 py-1 rounded-md border border-brd-primary dark:border-brd-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark text-sm">→</button>
          </div>
        </div>

        {/* View switcher */}
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

        {/* Calendar View */}
        {calendarView === 'month' && renderMonthView()}
        {calendarView === 'week' && renderWeekView()}
        {calendarView === 'day' && renderDayView()}
      </div>

      {/* Task Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary dark:bg-primary-dark rounded-lg border border-brd-primary dark:border-brd-primary-dark p-6 w-96 flex flex-col gap-3">
            <h2 className="font-semibold text-lg">Add Task</h2>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm opacity-70">Date</label>
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm opacity-70">Start Time</label>
                <input
                  type="time"
                  value={newTask.startTime}
                  onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm opacity-70">End Time (optional)</label>
                <input
                  type="time"
                  value={newTask.endTime}
                  onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={addTodo} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add to Calendar
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 px-3 py-2 bg-secondary dark:bg-secondary-dark rounded-md border border-brd-primary dark:border-brd-primary-dark"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}