import { useState } from 'react';
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

  const saveNotes = () => {
    localStorage.setItem('studyplanner-notes', notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };
  const [calendarView, setCalendarView] = useState('month');
  const [calendarMonth, setCalendarMonth] = useState(new Date(2023, 7, 1));

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
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
        <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#e8e8e8] dark:bg-[#4b4b4b] text-[#373737] dark:text-[#ffffff] hover:bg-[#e0e0e0] dark:hover:bg-[#555]">
          Customize
        </button>
      </header>

      {/* Main Content - 3 Columns */}
      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1400px] mx-auto h-full">
          {/* Column 1 - Todo List */}
          <div className="rounded-xl bg-white dark:bg-[#212121] border border-[#ededed] dark:border-[#2b2b2b] p-4 shadow-sm flex flex-col">
            <h3 className="font-semibold text-[#373737] dark:text-[#ffffff] mb-4">Todo</h3>
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
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Notes */}
          <div className="rounded-xl bg-white dark:bg-[#212121] border border-[#ededed] dark:border-[#2b2b2b] p-4 shadow-sm flex flex-col">
            <h3 className="font-semibold text-[#373737] dark:text-[#ffffff] mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes here..."
              className="flex-1 min-h-[200px] w-full p-3 rounded-lg bg-[#f2f2f2] dark:bg-[#2b2b2b] text-[#373737] dark:text-[#ffffff] placeholder:text-[#7e7e7e] dark:placeholder:text-[#aeaeae] outline-none resize-none border border-transparent focus:border-blue-500"
            />
            <button
              type="button"
              onClick={saveNotes}
              className="mt-3 px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {notesSaved ? 'Saved!' : 'Save notes'}
            </button>
          </div>

          {/* Column 3 - Calendar */}
          <div className="rounded-xl border border-[#ededed] dark:border-[#2b2b2b] bg-white dark:bg-[#212121] p-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h4 className="font-medium text-[#373737] dark:text-[#ffffff]">Calendar</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#7e7e7e] dark:text-[#aeaeae]">
                  {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
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
                    onClick={() =>
                      setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))
                    }
                    className="p-1 rounded hover:bg-[#e8e8e8] dark:hover:bg-[#4b4b4b] text-[#373737] dark:text-[#ffffff]"
                  >
                    <IoChevronBackOutline className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))
                    }
                    className="p-1 rounded hover:bg-[#e8e8e8] dark:hover:bg-[#4b4b4b] text-[#373737] dark:text-[#ffffff]"
                  >
                    <IoChevronForwardOutline className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {CALENDAR_EVENTS.map((event, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${event.color} dark:opacity-90`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${event.dotColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
