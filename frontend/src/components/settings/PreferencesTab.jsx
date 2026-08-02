import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

export default function PreferencesTab({ isDark, setIsDark }) {
  return (
    <div>
      <h2 className="text-xl font-bold">Preferences</h2>
      <h1 className="flex text-lg">Theme</h1>
      <button
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-hover"
        onClick={() => setIsDark(prev => !prev)}
      >
        {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
}
