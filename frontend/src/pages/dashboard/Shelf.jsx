import { useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";

export default function Shelf() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="relative flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4  bg-primary dark:bg-primary-dark">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-bold">Shelf</p>
        <button onClick={() => setIsModalOpen(true)}>
          <MdDriveFolderUpload className="w-6 h-6 cursor-pointer" />
        </button>
      </div>
      {/* Centering Div */}
      <div className="flex flex-1 items-center justify-center w-full">
        {isModalOpen && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl">
            <div className="bg-primary dark:bg-primary-dark rounded-xl p-6 flex flex-col gap-4">


            </div>
        </div>
        )}
    
            

        {/* Scroll Div */}
        <div className="flex flex-row gap-2 overflow-x-auto">
          {/* Thumbnails */}
          <div className="flex flex-col gap-1 w-52 p-2 shrink-0 items-center">
            <div className="bg-secondary dark:bg-secondary-dark rounded-lg h-72 w-48"></div>
            <p className="text-sm">Textbook</p>
          </div>
          <div className="flex flex-col gap-1 w-96 p-2 shrink-0 items-center">
            <div className="bg-secondary dark:bg-secondary-dark rounded-lg h-64 w-96"></div>
            <p className="text-sm">Youtube Video</p>
          </div>
        </div>
      </div>
    </div>
  );
}

