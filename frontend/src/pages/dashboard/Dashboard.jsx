import { useState, useEffect } from 'react';
import {
  IoAddOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from 'react-icons/io5';

const TODO_ITEMS = [
  { id: 1, text: 'Read 20 pages', done: false },
  { id: 2, text: 'Complete project intent form', done: false },
  { id: 3, text: 'Finish research paper outline', done: false },
  { id: 4, text: 'Buy a gift from the mall for friend', done: false },
];

const CALENDAR_EVENTS = [
  { title: 'Ask landlord about rent', time: 'All day', color: 'bg-blue-50 dark:bg-blue-900/30', dotColor: 'bg-blue-500' },
  { title: 'Finish laundry', time: '12:30 PM', color: 'bg-slate-50 dark:bg-slate-800/50', dotColor: 'bg-slate-500' },
  { title: 'Complete project intent form', time: '1PM', color: 'bg-slate-50 dark:bg-slate-800/50', dotColor: 'bg-slate-500' },
  { title: 'Finish research paper outline', time: '3-4:30PM', color: 'bg-indigo-50 dark:bg-indigo-900/30', dotColor: 'bg-indigo-500' },
  { title: 'Read 20 pages', time: '5:30-7 PM', color: 'bg-blue-50 dark:bg-blue-900/30', dotColor: 'bg-blue-500' },
  { title: 'Dinner with friends', time: '7 PM', color: 'bg-slate-50 dark:bg-slate-800/50', dotColor: 'bg-slate-500' },

 
];

export default function Dashboard() {
  const [todos, setTodos] = useState(TODO_ITEMS);
  const [newTodo, setNewTodo] = useState('');
  const [notes, setNotes] = useState(() => localStorage.getItem('studyplanner-notes') || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('studyplanner-calendar-events');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore parse errors and fall back to defaults
    }
    return [];
  });
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDate, setNewEventDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [showCustomizeMenu, setShowCustomizeMenu] = useState(false);
  const [visibleSections, setVisibleSections] = useState(() => {
    try {
      const saved = localStorage.getItem('studyplanner-visible-sections');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore parse errors and fall back to defaults
    }
    return {
      todo: true,
      notes: true,
      calendar: true,
    };
  });
  const [calendarView, setCalendarView] = useState('month');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [todoDeleteMode, setTodoDeleteMode] = useState(false);
  const [todoDeleteSelection, setTodoDeleteSelection] = useState([]);
  const [calendarDeleteMode, setCalendarDeleteMode] = useState(false);
  const [calendarDeleteSelection, setCalendarDeleteSelection] = useState([]);

  const saveNotes = () => {
    localStorage.setItem('studyplanner-notes', notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const exportNotes = () => {
    try {
      const blob = new Blob([notes || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'study-notes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // best-effort export; ignore errors
    }
  };
  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const toggleTodoDeleteSelection = (id) => {
    setTodoDeleteSelection((prev) =>
      prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]
    );
  };

  const handleTodoDeleteButton = () => {
    if (!todoDeleteMode) {
      setTodoDeleteMode(true);
      setTodoDeleteSelection([]);
      return;
    }

    if (todoDeleteSelection.length > 0) {
      setTodos((prev) => prev.filter((t) => !todoDeleteSelection.includes(t.id)));
    }
    setTodoDeleteMode(false);
    setTodoDeleteSelection([]);
  };

  useEffect(() => {
    localStorage.setItem('studyplanner-visible-sections', JSON.stringify(visibleSections));
  }, [visibleSections]);

  const toggleSectionVisibility = (sectionKey) => {
    setVisibleSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const showSection = (sectionKey) => {
    setVisibleSections((prev) => ({
      ...prev,
      [sectionKey]: true,
    }));
    setShowCustomizeMenu(false);
  };

  const hideSection = (sectionKey) => {
    setVisibleSections((prev) => ({
      ...prev,
      [sectionKey]: false,
    }));
  };

  useEffect(() => {
    localStorage.setItem('studyplanner-calendar-events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  const addCalendarEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const palette = [
      { color: 'bg-blue-50 dark:bg-blue-900/30', dotColor: 'bg-blue-500' },
      { color: 'bg-slate-50 dark:bg-slate-800/50', dotColor: 'bg-slate-500' },
      { color: 'bg-indigo-50 dark:bg-indigo-900/30', dotColor: 'bg-indigo-500' },
    ];

    const theme = palette[calendarEvents.length % palette.length];
    const dateToUse = newEventDate || new Date().toISOString().slice(0, 10);

    setCalendarEvents([
      ...calendarEvents,
      {
        title: newEventTitle.trim(),
        time: newEventTime.trim() || 'All day',
        color: theme.color,
        dotColor: theme.dotColor,
        date: dateToUse,
      },
    ]);
    setNewEventTitle('');
    setNewEventTime('');
  };

  const toggleCalendarDeleteSelection = (eventToToggle) => {
    setCalendarDeleteSelection((prev) =>
      prev.includes(eventToToggle)
        ? prev.filter((event) => event !== eventToToggle)
        : [...prev, eventToToggle]
    );
  };

  const handleCalendarDeleteButton = () => {
    if (!calendarDeleteMode) {
      setCalendarDeleteMode(true);
      setCalendarDeleteSelection([]);
      return;
    }

    if (calendarDeleteSelection.length > 0) {
      setCalendarEvents((events) =>
        events.filter((event) => !calendarDeleteSelection.includes(event))
      );
    }
    setCalendarDeleteMode(false);
    setCalendarDeleteSelection([]);
  };

  const visibleCount = Object.values(visibleSections).filter(Boolean).length;
  const gridColsClass =
    visibleCount <= 1 ? 'md:grid-cols-1' : visibleCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = d.getDate() - day; // start on Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const isSameDay = (a, b) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const filteredEvents = calendarEvents.filter((event) => {
    if (!event.date) return true;
    const eventDate = parseDateString(event.date);
    if (!eventDate) return true;
    const current = new Date(calendarDate);

    if (calendarView === 'day') {
      return isSameDay(eventDate, current);
    }

    if (calendarView === 'week') {
      const start = startOfWeek(current);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return eventDate >= start && eventDate <= end;
    }

    if (calendarView === 'month') {
      return (
        eventDate.getFullYear() === current.getFullYear() &&
        eventDate.getMonth() === current.getMonth()
      );
    }

    return true;
  });

  const formatCalendarLabel = () => {
    const current = new Date(calendarDate);

    if (calendarView === 'day') {
      return current.toLocaleDateString('default', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (calendarView === 'week') {
      const start = startOfWeek(current);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const startStr = start.toLocaleDateString('default', {
        month: 'short',
        day: 'numeric',
      });
      const endStr = end.toLocaleDateString('default', {
        month: 'short',
        day: 'numeric',
        year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined,
      });

      return `Week of ${startStr} – ${endStr}`;
    }

    // month view
    return current.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const changeCalendarDate = (direction) => {
    const delta = direction === 'prev' ? -1 : 1;
    setCalendarDate((d) => {
      const next = new Date(d);
      if (calendarView === 'day') {
        next.setDate(next.getDate() + delta);
      } else if (calendarView === 'week') {
        next.setDate(next.getDate() + 7 * delta);
      } else {
        next.setMonth(next.getMonth() + delta);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f2f2f2] dark:bg-[#171717]">
      {/* Top Header */}
      <header className="flex items-center justify-between h-12 px-6 bg-white dark:bg-[#212121] border-b border-[#ededed] dark:border-[#2b2b2b]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border-2 border-[#373737] dark:border-[#aeaeae] flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-[#373737] dark:bg-[#aeaeae]" />
          </div>
          <span className="font-medium text-[#373737] dark:text-[#ffffff]">Study planner</span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCustomizeMenu((open) => !open)}
            className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#e8e8e8] dark:bg-[#4b4b4b] text-[#373737] dark:text-[#ffffff] hover:bg-[#e0e0e0] dark:hover:bg-[#555] flex items-center gap-1"
          >
            Customize
            <span className="text-xs text-[#7e7e7e] dark:text-[#aeaeae]">
              ▼
            </span>
          </button>
          {showCustomizeMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-[#2b2b2b] shadow-lg border border-[#ededed] dark:border-[#3a3a3a] z-20">
              <div className="px-3 py-2 border-b border-[#ededed] dark:border-[#3a3a3a]">
                <p className="text-xs font-semibold tracking-wide uppercase text-[#7e7e7e] dark:text-[#aeaeae]">
                  Add sections
                </p>
              </div>
              <div className="py-1">
                {!visibleSections.todo && (
                  <button
                    type="button"
                    onClick={() => showSection('todo')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-[#f5f5f5] dark:hover:bg-[#3a3a3a] text-[#373737] dark:text-[#ffffff]"
                  >
                    <span>Todo</span>
                  </button>
                )}
                {!visibleSections.notes && (
                  <button
                    type="button"
                    onClick={() => showSection('notes')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-[#f5f5f5] dark:hover:bg-[#3a3a3a] text-[#373737] dark:text-[#ffffff]"
                  >
                    <span>Notes</span>
                  </button>
                )}
                {!visibleSections.calendar && (
                  <button
                    type="button"
                    onClick={() => showSection('calendar')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-[#f5f5f5] dark:hover:bg-[#3a3a3a] text-[#373737] dark:text-[#ffffff]"
                  >
                    <span>Calendar</span>
                  </button>
                )}
                {visibleSections.todo && visibleSections.notes && visibleSections.calendar && (
                  <p className="px-3 py-2 text-xs text-[#7e7e7e] dark:text-[#aeaeae]">
                    All sections are added.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setVisibleSections({
                    todo: true,
                    notes: true,
                    calendar: true,
                  })
                }
                className="w-full px-3 py-2 text-xs text-left text-blue-600 dark:text-blue-400 hover:bg-[#f5f5f5] dark:hover:bg-[#3a3a3a] border-t border-[#ededed] dark:border-[#3a3a3a]"
              >
                Reset to defaults
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - 3 Columns */}
      <main className="flex-1 overflow-auto p-6">
        <div className={`grid grid-cols-1 ${gridColsClass} gap-6 max-w-[1400px] mx-auto h-full`}>
          {/* Column 1 - Todo List */}
          {visibleSections.todo && (
            <div className="rounded-xl bg-white dark:bg-[#212121] border border-[#ededed] dark:border-[#2b2b2b] p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#373737] dark:text-[#ffffff]">Todo</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTodoDeleteButton}
                    className={`text-xs ${
                      todoDeleteMode
                        ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
                        : 'text-[#7e7e7e] hover:text-[#373737] dark:text-[#aeaeae] dark:hover:text-[#ffffff]'
                    }`}
                  >
                    {todoDeleteMode
                      ? todoDeleteSelection.length > 0
                        ? 'Delete selected'
                        : 'Cancel'
                      : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => hideSection('todo')}
                    className="text-xs text-[#7e7e7e] dark:text-[#aeaeae] hover:text-[#373737] dark:hover:text-[#ffffff]"
                  >
                    Hide
                  </button>
                </div>
              </div>
              <form onSubmit={addTodo} className="flex items-center gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f2f2f2] dark:bg-[#2b2b2b]">
                  <IoAddOutline className="w-4 h-4 text-[#7e7e7e] dark:text-[#aeaeae] shrink-0" />
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add task..."
                    className="flex-1 bg-transparent text-sm text-[#373737] dark:text-[#ffffff] placeholder:text-[#7e7e7e] dark:placeholder:text-[#aeaeae] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </form>
              <ul className="space-y-2 flex-1 overflow-y-auto">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        todo.done ? 'bg-green-500 border-green-500' : 'border-[#7e7e7e] dark:border-[#aeaeae]'
                      }`}
                    >
                      {todo.done && <span className="text-white text-xs">✓</span>}
                    </button>
                    <span
                      className={`text-sm flex-1 ${
                        todo.done ? 'line-through text-[#7e7e7e] dark:text-[#aeaeae]' : 'text-[#373737] dark:text-[#ffffff]'
                      }`}
                    >
                      {todo.text}
                    </span>
                    {todoDeleteMode && (
                      <input
                        type="checkbox"
                        checked={todoDeleteSelection.includes(todo.id)}
                        onChange={() => toggleTodoDeleteSelection(todo.id)}
                        className="w-4 h-4 accent-red-500"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Column 2 - Notes */}
          {visibleSections.notes && (
            <div className="rounded-xl bg-white dark:bg-[#212121] border border-[#ededed] dark:border-[#2b2b2b] p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#373737] dark:text-[#ffffff]">Notes</h3>
                <button
                  type="button"
                  onClick={() => hideSection('notes')}
                  className="text-xs text-[#7e7e7e] dark:text-[#aeaeae] hover:text-[#373737] dark:hover:text-[#ffffff]"
                >
                  Hide
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes here..."
                className="flex-1 min-h-[200px] w-full p-3 rounded-lg bg-[#f2f2f2] dark:bg-[#2b2b2b] text-[#373737] dark:text-[#ffffff] placeholder:text-[#7e7e7e] dark:placeholder:text-[#aeaeae] outline-none resize-none border border-transparent focus:border-blue-500"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={saveNotes}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  {notesSaved ? 'Saved!' : 'Save notes'}
                </button>
                <button
                  type="button"
                  onClick={exportNotes}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[#d0d0d0] dark:border-[#3a3a3a] text-[#373737] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#333]"
                >
                  Download notes
                </button>
              </div>
            </div>
          )}

          {/* Column 3 - Calendar */}
          {visibleSections.calendar && (
            <div className="rounded-xl border border-[#ededed] dark:border-[#2b2b2b] bg-white dark:bg-[#212121] p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-[#373737] dark:text-[#ffffff]">Calendar</h4>
                  <button
                    type="button"
                    onClick={handleCalendarDeleteButton}
                    className={`text-xs ${
                      calendarDeleteMode
                        ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
                        : 'text-[#7e7e7e] hover:text-[#373737] dark:text-[#aeaeae] dark:hover:text-[#ffffff]'
                    }`}
                  >
                    {calendarDeleteMode
                      ? calendarDeleteSelection.length > 0
                        ? 'Delete selected'
                        : 'Cancel'
                      : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => hideSection('calendar')}
                    className="text-xs text-[#7e7e7e] dark:text-[#aeaeae] hover:text-[#373737] dark:hover:text-[#ffffff]"
                  >
                    Hide
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#7e7e7e] dark:text-[#aeaeae]">
                    {formatCalendarLabel()}
                  </span>
                  {['day', 'week', 'month'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setCalendarView(view)}
                      className={`px-3 py-1 text-sm rounded capitalize ${
                        calendarView === view
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#e8e8e8] dark:bg-[#4b4b4b] text-[#373737] dark:text-[#ffffff]'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => changeCalendarDate('prev')}
                      className="p-1 rounded hover:bg-[#e8e8e8] dark:hover:bg-[#4b4b4b] text-[#373737] dark:text-[#ffffff]"
                    >
                      <IoChevronBackOutline className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => changeCalendarDate('next')}
                      className="p-1 rounded hover:bg-[#e8e8e8] dark:hover:bg-[#4b4b4b] text-[#373737] dark:text-[#ffffff]"
                    >
                      <IoChevronForwardOutline className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <form onSubmit={addCalendarEvent} className="mb-3 flex flex-col gap-2">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Event title"
                  className="w-full px-3 py-2 rounded-lg bg-[#f2f2f2] dark:bg-[#2b2b2b] text-sm text-[#373737] dark:text-[#ffffff] placeholder:text-[#7e7e7e] dark:placeholder:text-[#aeaeae] outline-none"
                />
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="Time (e.g. 3 PM)"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#f2f2f2] dark:bg-[#2b2b2b] text-sm text-[#373737] dark:text-[#ffffff] placeholder:text-[#7e7e7e] dark:placeholder:text-[#aeaeae] outline-none"
                  />
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#f2f2f2] dark:bg-[#2b2b2b] text-sm text-[#373737] dark:text-[#ffffff] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 whitespace-nowrap"
                  >
                    Add event
                  </button>
                </div>
              </form>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {filteredEvents.map((event, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${event.color} dark:opacity-90`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${event.dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {event.time}
                        {event.date && (
                          <span className="ml-2 text-[11px] text-gray-500 dark:text-gray-400">
                            {(parseDateString(event.date) || new Date(event.date)).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                    {calendarDeleteMode && (
                      <input
                        type="checkbox"
                        checked={calendarDeleteSelection.includes(event)}
                        onChange={() => toggleCalendarDeleteSelection(event)}
                        className="w-4 h-4 accent-red-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
