import { useState, useRef, useEffect } from 'react';

const ALL_WIDGETS = [
  { id: "todo",     label: "To-Do List" },
  { id: "note",     label: "Sticky Note" },
  { id: "shelf",    label: "Shelf" },
  { id: "calendar", label: "Calendar" },
];

export default function CustomizeDashboard({ visible, setVisible }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleWidget = (id) =>
    setVisible(prev => ({ ...prev, [id]: !prev[id] }));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        title="Customize Dashboard"
        className='px-3 py-1 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer'
        onClick={() => setDropdownOpen(v => !v)}
      >
        Customize
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark shadow-lg z-50 overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-wider px-4 pt-3 pb-1 opacity-40">
            Widgets
          </p>
          {ALL_WIDGETS.map(w => (
            <button
              key={w.id}
              onClick={() => toggleWidget(w.id)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-hover hover:dark:bg-hover-dark transition-colors"
            >
              <span>{w.label}</span>
              <span
                className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: visible[w.id] ? "#e53e3e" : "currentColor",
                  background:  visible[w.id] ? "#e53e3e" : "transparent",
                  opacity:     visible[w.id] ? 1 : 0.3,
                }}
              >
                {visible[w.id] && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}