import { IoIosAdd } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Resources from "./Resources";
import { createResource } from "../../../../backend/src/controllers/resourcesController";

export default function ResourcesMainPage() {

  const navigate = useNavigate();
  
  const [classes, setClasses] = useState(["Class 1"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('choose');

  const addClass = () => {
    if (classes.length < 6) {
      setClasses(prev => [...prev, `Class ${prev.length + 1}`]);
    }
  };

  return (
    <div className="p-4">

  {/* Pop Up when add button is clicked */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
        <div className="p-6 w-96 flex flex-col gap-3 border bg-primary dark:bg-primary-dark border-brd-primary dark:border-brd-primary-dark rounded-lg">
          
          <div className="flex justify-between items-center w-full">
            <h2 className="font-semibold text-lg">Enter Class Information</h2>
            <button onClick={() => { 
              setIsModalOpen(false); 
              setModalView('choose'); 
              }}
            >
              <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
            </button>
          </div>
          <Resources />
          <div className="flex gap-2">
            <button
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              onClick={createResource}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}

      {/* class grid */}
      <div className="border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark mt-0.5">
        <div className="flex justify-between items-center font-bold text-2xl w-full text-black-900 border-b border-brd-primary dark:border-brd-primary-dark pb-3">
          Your Classes
      
        {/* + button */}
          <button className="cursor-pointer"
            onClick={() => {
              addClass();
              setIsModalOpen(true);
            }}
            >
            <IoIosAddCircleOutline className="p-1 w-10 h-10 hover:text-blue-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
        {classes.map((item, index) => (
          <button
            key={index}
            className="mt-4 p-2 rounded-lg border-brd-primary dark:border-brd-primary-dark bg-secondary dark:bg-secondary-dark w-full h-30 bg-[#D9D9D9] border-0"
          >
            {item}
          </button>
        ))}
        </div>
      </div>

      {/* Imported sources (documents & videos) displayed */}
      <div className="border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark mt-5 ">
      {/* documents section */}
      <div className="flex flex-col">
          <div className="font-bold text-2xl">Documents</div>
          <div className="flex gap-2 mt-4 ml-1">
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
          </div>
      </div>

      <div className="border-b border-brd-primary dark:border-brd-primary-dark p-2"></div>
      
      {/* videos section */}
      <div className="flex flex-col">
          <div className="font-bold mt-4 text-2xl">Videos</div>
          <div className="flex gap-2 mt-3 ml-1">
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
              <div className="border rounded-md h-full p-4 cursor-pointer"></div>
          </div>
      </div>
      </div>
    </div>
  );
}