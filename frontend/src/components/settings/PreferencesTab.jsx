import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

const WIDGET_IDS = ['todo', 'note', 'calendar', 'shelf'];

export default function PreferencesTab({ isDark, setIsDark, visible, setVisible }) {
  const toggleWidget = (id) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 text-left">
      <h2 className="text-lg font-semibold">Preferences</h2>

      <button
        onClick={() => setIsDark(!isDark)}
        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer transition-colors"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {isDark ? (
          <HiOutlineSun className="w-5 h-5 text-icon dark:text-icon-dark" />
        ) : (
          <HiOutlineMoon className="w-5 h-5 text-icon dark:text-icon-dark" />
        )}
        <span className="text-sm text-txt-primary dark:text-txt-primary-dark">
          {isDark ? 'Light mode' : 'Dark mode'}
        </span>
      </button>

      <div className="space-y-2">
        <p className="text-sm font-medium text-txt-primary dark:text-txt-primary-dark">
          Visible Dashboard widgets
        </p>
        <div className="rounded-md overflow-hidden">
          {WIDGET_IDS.map((id) => (
            <button
              key={id}
              onClick={() => toggleWidget(id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-hover hover:dark:bg-hover-dark transition-colors cursor-pointer"
            >
              <span className="text-txt-primary dark:text-txt-primary-dark">{id}</span>
              <span
                className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: visible[id] ? '#e53e3e' : 'currentColor',
                  background: visible[id] ? '#e53e3e' : 'transparent',
                  opacity: visible[id] ? 1 : 0.3,
                }}
              >
                {visible[id] && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
