import { MdDriveFolderUpload } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        
        {/* --- TO DO LIST BLOCK --- */}
        <div className="flex justify-between border border-zinc-700 rounded-2xl h-200 p-4 bg-primary dark:bg-primary-dark">
          <p className="font-bold">To-Do List</p>
          <IoIosAddCircleOutline className="w-6 h-6"/>
        </div>
        
        {/* --- RESOURCES BLOCK --- */}
        <div className="border border-zinc-700 rounded-2xl h-200 p-0 px-3 flex flex-col gap-4 bg-primary dark:bg-primary-dark">
          <p className="pt-4 font-bold">Resources</p>
            
            {/* --- MY NOTES BLOCK --- */}
            <div className="flex justify-between border border-zinc-700 rounded-2xl h-89 p-4">
              <p className="font-bold">My Notes</p>
              <IoIosAddCircleOutline className="w-6 h-6"/>
            </div> 
            
            {/* --- MY SHELF BLOCK --- */} 
            <div className="flex justify-between border border-zinc-700 rounded-2xl h-89 p-4">
              <p className="font-bold">My Shelf</p>
              <MdDriveFolderUpload className="w-6 h-6" />
            </div>
        </div>
        
        {/* --- CALENDAR BLOCK --- */}
        <div className="flex justify-between border border-zinc-700 rounded-2xl h-200 p-4 bg-primary dark:bg-primary-dark">
          <p className="font-bold">Calendar</p>
          <IoIosAddCircleOutline className="w-6 h-6"/>

        </div>
      </div>
    </div>
  );
}

