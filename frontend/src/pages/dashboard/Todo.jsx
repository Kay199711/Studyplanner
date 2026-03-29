import { useState, useRef } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const uid = () => Math.random().toString(36).slice(2, 10);

const SEED_TODOS = [
  { id: uid(), title: "Review lecture notes for midterm", done: false },
  { id: uid(), title: "Submit assignment 3",              done: false },
  { id: uid(), title: "Read chapter 7",                   done: true  },
  { id: uid(), title: "Schedule study group",             done: false },
];

export default function Todo() {
  const [todos, setTodos]   = useState(SEED_TODOS);
  const [input, setInput]   = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef();

  const openAdd = () => {
    setAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const addTodo = () => {
    const t = input.trim();
    if (t) setTodos(prev => [{ id: uid(), title: t, done: false }, ...prev]);
    setInput("");
    setAdding(false);
  };

  const toggle = (id) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const remove = (id) =>
    setTodos(prev => prev.filter(t => t.id !== id));

  const remaining = todos.filter(t => !t.done).length;

  return (
    <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl  p-4 bg-primary dark:bg-primary-dark">

      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-brd-primary dark:border-brd-primary-dark">
        <div className="flex items-center gap-2">
          <p className="font-bold">To-Do List</p>
          {remaining > 0 && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-brd-primary dark:bg-brd-primary-dark text-gray-900 dark:text-white">
              {remaining}
            </span>
          )}
        </div>
        <button onClick={openAdd} className="hover:text-blue-500">
          <IoIosAddCircleOutline className="w-6 h-6" />
        </button>
      </div>

      {/* Quick-add input */}
      {adding && (
        <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-brd-primary dark:bg-brd-primary-dark">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") addTodo();
              if (e.key === "Escape") { setAdding(false); setInput(""); }
            }}
            onBlur={addTodo}
            placeholder="New task…"
            className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      )}

      {/* Task list */}
      <div className="flex-1 overflow-y-auto -mx-1 min-h-0">
        {todos.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-secondary dark:text-secondary-dark">No tasks yet</p>
          </div>
        )}
        {todos.map(todo => (
          <div
            key={todo.id}
            className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-brd-primary dark:hover:bg-brd-primary-dark transition-colors"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggle(todo.id)}
              className="flex-shrink-0 w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center transition-all"
              style={{
                borderColor: todo.done ? "#3B82F6" : "currentColor",
                opacity:     todo.done ? 1 : 0.3,
                background:  todo.done ? "#3B82F6" : "transparent",
              }}
            >
              {todo.done && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Title */}
            <span
              className="flex-1 text-sm leading-snug select-none"
              style={{
                opacity:        todo.done ? 0.35 : 1,
                textDecoration: todo.done ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>

            {/* Delete */}
            <button
              onClick={() => remove(todo.id)}
              className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity flex-shrink-0"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 1l9 9M10 1l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}