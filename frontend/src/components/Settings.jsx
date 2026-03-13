import { useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { Panel } from 'react-resizable-panels';

export default function Settings({ isOpen, onClose, isDark, setIsDark }) {

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

  return (
   
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-fade-in w-full max-w-2xl h-[70vh] rounded-lg border border-brd-primary bg-primary p-5 shadow-xl dark:border-brd-primary-dark dark:bg-primary-dark"
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
<div 
className="flex h-[calc(100%-3rem)] gap-4"
>
  <aside
  style={{
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  borderRadius: "0.5rem",
  width: "10rem",
  backgroundColor: isDark ? "var(--color-secondary-dark)" : "var(--color-secondary)",
} 
}>

<button
className="w-full rounded-md px-3 py-2 text-left hover:bg-hover dark:hover:bg-hover-dark">
  General
</button>

<button className="w-full rounded-md px-3 py-2 text-left hover:bg-hover dark:hover:bg-hover-dark">
  Profile
</button>

<button className="w-full rounded-md px-3 py-2 text-left hover:bg-hover dark:hover:bg-hover-dark">
  Preferences
</button>



</aside>
  
               <div className="justify left space-y-2 text-center">
          <button
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
    

</div>




    
  );
}
