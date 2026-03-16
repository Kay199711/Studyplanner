import { useEffect } from 'react';
<<<<<<< HEAD
import {useNavigate} from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineMoon, HiOutlineSun, HiOutlineUser } from 'react-icons/hi';

export default function Settings({ isOpen, onClose, isDark, setIsDark }) {
    const navigate = useNavigate();

=======
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

export default function Settings({ isOpen, onClose, isDark, setIsDark }) {
>>>>>>> 63d28243464c681bd62870e527834b520c0355da
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

  if (!isOpen) return null;

<<<<<<< HEAD
  const handleProfileClick = () => {
    onClose();
    navigate('/profile');
  }

=======
>>>>>>> 63d28243464c681bd62870e527834b520c0355da
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
<<<<<<< HEAD
        className="animate-fade-in w-full max-w-md rounded-lg border border-brd-primary bg-primary p-5 shadow-xl dark:border-brd-primary-dark dark:bg-primary-dark"
=======
        className="animate-fade-in w-full max-w-2xl h-[70vh]  rounded-lg border border-brd-primary bg-primary p-5 shadow-xl dark:border-brd-primary-dark dark:bg-primary-dark"
>>>>>>> 63d28243464c681bd62870e527834b520c0355da
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="relative mb-4 flex items-center justify-center">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover dark:hover:bg-hover-dark"
            onClick={onClose}
            aria-label="Close settings"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="space-y-2 text-center">
          <button
<<<<<<< HEAD
            onClick={handleProfileClick}
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 hover:bg-hover dark:hover:bg-hover-dark"
          >
            <HiOutlineUser />
            Profile
            </button>
          <button
=======
>>>>>>> 63d28243464c681bd62870e527834b520c0355da
            onClick={() => setIsDark(!isDark)}
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 hover:bg-hover dark:hover:bg-hover-dark"
          >
            {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <p className="text-sm text-icon dark:text-icon-dark">
            More to come
          </p>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 63d28243464c681bd62870e527834b520c0355da
