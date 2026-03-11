import { useEffect, useRef, useState } from 'react';
import { CgProfile } from "react-icons/cg";

export default function Profile({ onOpenSettings, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-md border border-brd-primary bg-primary p-1 shadow-lg dark:border-brd-primary-dark dark:bg-primary-dark z-20">
          <button
            onClick={() => {
              onOpenSettings();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
          >
            Settings
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer text-red-600 dark:text-red-400"
          >
            Logout
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full text-left block px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
      >
        <CgProfile className="inline w-6 h-6 text-icon dark:text-icon-dark" /> Profile
      </button>
    </div>
  );
}