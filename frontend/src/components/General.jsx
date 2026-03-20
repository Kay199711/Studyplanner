import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';   

export default function General({ isDark, setIsDark }) {


    return (

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
  );
}
