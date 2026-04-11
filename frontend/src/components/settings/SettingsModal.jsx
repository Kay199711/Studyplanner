import { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import ProfileTab from './ProfileTab.jsx';
import PreferencesTab from './PreferencesTab.jsx';

export default function SettingsModal({ isOpen, onClose, isDark, setIsDark }) {
  const [activeTab, setActiveTab] = useState('Profile');
  
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const tabs = ['Profile', 'Preferences'];
  const isActive = (tab) => activeTab === tab;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-fade-in w-full max-w-2xl h-[70vh] rounded-lg border border-brd-primary bg-primary p-5 shadow-xl dark:border-brd-primary-dark dark:bg-primary-dark flex flex-col"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="relative">
          <button
            className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover dark:hover:bg-hover-dark"
            onClick={onClose}
            aria-label="Close settings"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="flex flex-1 gap-4">
          <aside className="flex flex-col rounded-lg w-40 bg-secondary dark:bg-secondary-dark gap-2 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`w-full rounded-md px-3 py-2 text-left transition-colors cursor-pointer ${
                  isActive(tab)
                    ? 'bg-hover dark:bg-hover-dark font-medium'
                    : 'hover:bg-hover dark:hover:bg-hover-dark'
                }`}
                onClick={() => setActiveTab(tab)}
                aria-pressed={isActive(tab)}
              >
                {tab}
              </button>
            ))}
          </aside>
  
          <div className="space-y-2 text-center">
            {activeTab === 'Profile' && <ProfileTab />}
            {activeTab === 'Preferences' && <PreferencesTab isDark={isDark} setIsDark={setIsDark}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
