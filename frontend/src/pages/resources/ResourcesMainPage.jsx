import { IoIosAdd } from "react-icons/io";
import { useState } from "react";

export default function Resources() {
  const [classes, setClasses] = useState(["class"]);

  const addClass = () => {
    if (classes.length < 6) {
      setClasses(prev => [...prev, "class"]);
    }
  };

  return (
    <div className="p-4">
      {/* search + button */}
      <div className="flex items-center gap-2">
        <form>
          <input
            className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark pl-5 w-88.5 h-12.75 rounded-md outline-none"
            type="search"
            placeholder="Search"
          />
        </form>

        <button
          onClick={addClass}
          className="flex-col border-2 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark w-12.5 h-11.75 rounded-full bg-[#C9C9C9] font-bold"
        >
          <IoIosAdd className="p-1 w-11.5 h-11.5 hover:text-blue-500" />
        </button>
      </div>

      {/* class grid */}
      <div className="border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark grid grid-cols-3 gap-12.5 mt-7.5">
        {classes.map((item, index) => (
          <button
            key={index}
            className="mt-3 p-3 rounded-lg border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark w-full h-62 bg-[#D9D9D9] border-0"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}