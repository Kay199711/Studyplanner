import { useEffect, useRef, useState } from 'react';
import { CgProfile } from "react-icons/cg";

export default function ProfileButton({ onOpenSettings, onLogout, iconOnly = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ bottom: 0, left: 0 });

  useEffect(() => {
    if (!isOpen) return;

    // Calculate position for fixed positioning
    if (iconOnly && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        bottom: window.innerHeight - rect.bottom,
        left: rect.right + 8
      });
    }

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
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
  }, [isOpen, iconOnly]);

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className={iconOnly 
            ? "p-1.5 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
            : "w-full text-left block px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
          }
          title={iconOnly ? "Profile" : undefined}
        >
          <CgProfile className={iconOnly ? "w-6 h-6 text-icon dark:text-icon-dark" : "inline w-6 h-6 text-icon dark:text-icon-dark"} />
          {!iconOnly && " Profile"}
        </button>

        {isOpen && !iconOnly && (
          <div ref={menuRef} className="absolute bottom-full left-0 mb-2 w-full rounded-md border border-brd-primary bg-primary p-1 shadow-lg dark:border-brd-primary-dark dark:bg-primary-dark z-20">
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
      </div>

      {isOpen && iconOnly && (
        <div 
          ref={menuRef}
          className="fixed w-40 rounded-md border border-brd-primary bg-primary p-1 shadow-lg dark:border-brd-primary-dark dark:bg-primary-dark z-50"
          style={{
            bottom: `${menuPosition.bottom}px`,
            left: `${menuPosition.left}px`
          }}
        >
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
    </>
  );
}