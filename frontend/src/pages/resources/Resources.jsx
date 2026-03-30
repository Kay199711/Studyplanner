import { IoIosAdd } from "react-icons/io";

export default function Resources() {
   const classes = ["class", "class", "class", "class", "class", "class"];
  return (
    <div>
      {/* Search + button */}
      <div className="flex items-center gap-2">
        <form>
          <input
            className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4  bg-primary dark:bg-primary-darkbg-[#C6C3C3] pl-5 w-88.5 h-12.75 rounded-md outline-none"
            type="search"
            placeholder="Search"
          />
        </form>

        <button 
          className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark  bg-primary dark:bg-primary-darkbg-[#C6C3C3] w-12.5 h-11.75 rounded-full bg-[#C9C9C9] font-bold"
          >
          <IoIosAdd className="p-1 w-11.5 h-11.5 hover:text-blue-500"/>
        </button>
      </div>

      {/* Class grid */}
      <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4  bg-primary dark:bg-primary-darkbg-[#C6C3C3] grid grid-cols-3 gap-12.5 mt-7.5">
        {classes.map((item, index) => (
          <button
            key={index}
            className="mt-3 p-3 rounded-lg border border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-darkw-66.25 h-62 bg-[#D9D9D9] border-0"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
  }
  
  