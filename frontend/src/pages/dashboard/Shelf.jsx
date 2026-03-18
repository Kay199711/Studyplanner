import { useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOndemandVideo } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";

export default function Shelf() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('choose');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [shelfItems, setShelfItems] = useState([]);


  return (
    <div className="relative flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark">

      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-bold">Shelf</p>
        <button onClick={() => setIsModalOpen(true)}>
          <MdDriveFolderUpload className="w-6 h-6 cursor-pointer hover:text-blue-500" />
        </button>
      </div>

      {/* Centering Div */}
      <div className="flex flex-1 items-center justify-center w-full">

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="p-6 w-96 flex flex-col gap-3 border bg-primary dark:bg-primary-dark border-brd-primary dark:border-brd-primary-dark rounded-lg">

              <div className="flex justify-between items-center w-full">
                <h2 className="font-semibold text-lg">Add to Shelf</h2>
                <button onClick={() => {setIsModalOpen(false); setModalView('choose');}}>
                  <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
                </button>
              </div>

            {modalView === 'choose' && (
                <div className="flex gap-2 justify-center">
                <button
                  className="cursor-pointer flex-1 flex flex-col items-center gap-2 p-4 border border-brd-primary dark:border-brd-primary-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark"
                  title="Upload a video"
                  onClick={() => setModalView('youtube')}
                  >
                  <MdOndemandVideo className="w-24 h-24" />
                </button>
                <button
                  className="cursor-pointer flex-1 flex flex-col items-center gap-2 p-4 border border-brd-primary dark:border-brd-primary-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark"
                  title="Upload a PDF"
                  onClick={() => setModalView('pdf')}
                  >
                  <FaRegFilePdf className="w-24 h-24" />
                </button>
              </div>
                )}
            {modalView === 'youtube' && (
                <div className="flex flex-col gap-3">
                    <p className="text-sm opacity-70">Paste a Youtube URL:</p>
                    <input
                        type="text"
                        placeholder="https://youtube.com/watch?v="
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary"
                    />
                    <div className="flex gap-2">
                    <button
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                        onClick={()=> {setModalView('choose')}}
                    >
                        Add
                    </button>
                     <button
                        className="flex-1 px-3 py-2 rounded-md cursor-pointer border-brd-primary hover:bg-secondary dark:border-brd-primary-dark dark:hover:bg-secondary-dark"
                        onClick={()=> {setModalView('choose')}}
                    >
                        Back
                    </button>
                    </div>
                </div>
            )}
            {modalView === 'pdf' && (
                <div>
                    <p className="text-sm opacity-70">Upload a PDFs</p>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        value={pdfFile}
                        className="w-full px-3 py-2 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark cursor-pointer"
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                        onClick={()=> {setModalView('choose')}}
                    >
                        Add
                        </button>
                        <button
                        className="flex-1 px-3 py-2 rounded-md cursor-pointer border-brd-primary hover:bg-secondary dark:border-brd-primary-dark dark:hover:bg-secondary-dark"
                        onClick={()=> {setModalView('choose')}}
                    >
                        Back
                        </button>


                    </div>

                </div>
                

            )}
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