import { useState, useEffect, useRef } from "react";
import { MdDriveFolderUpload } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOndemandVideo } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import api from '../../api.js';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const getVideoId = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export default function Shelf() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('choose');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [shelfItems, setShelfItems] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [focusedShelfItem, setFocusedItem] = useState(0);
  const [selectedYoutube, setSelectedYoutube] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef(null);

  useEffect(() => {
    api.getShelfItems()
      .then(data => { if (data.success) setShelfItems(data.data); })
      .catch(err => console.error('Error loading shelf:', err));
  }, []);

  const getYoutubeThumbnail = (url) => {
    const videoId = getVideoId(url);
    return videoId ? `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
  };

  const addYoutubeItem = () => {
    if (!youtubeUrl) return;
    api.addShelfYoutube(youtubeUrl)
      .then(data => {
        if (data.success) {
          setShelfItems([data.data, ...shelfItems]);
          setFocusedItem(0);
          setYoutubeUrl('');
          setIsModalOpen(false);
          setModalView('choose');
        }
      })
      .catch(err => console.error('Error adding YouTube item:', err));
  };

  const addPdfItem = () => {
    if (!pdfFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      api.addShelfPdf(base64, pdfFile.name)
        .then(data => {
          if (data.success) {
            setShelfItems([data.data, ...shelfItems]);
            setFocusedItem(0);
            setPdfFile(null);
            setIsModalOpen(false);
            setModalView('choose');
          }
        })
        .catch(err => console.error('Error adding PDF item:', err));
    };
    reader.readAsDataURL(pdfFile);
  };

    {/* Added changing shelf item */}
  const startEditing = (item) => {
    setNameInput(item.fileName || (item.type === 'youtube' ? 'YouTube Video' : 'PDF'));
    setEditingId(item.id);
    setTimeout(() => nameInputRef.current?.select(), 0);
  };

  const saveItemName = (id) => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    api.updateShelfItem(id, trimmed)
      .then(data => {
        if (data.success) {
          setShelfItems(shelfItems.map(i => i.id === id ? { ...i, fileName: trimmed } : i));
        }
      })
      .catch(err => console.error('Error renaming item:', err))
      .finally(() => setEditingId(null));
  };

  const deleteItem = (id) => {
    api.deleteShelfItem(id)
      .then(data => {
        if (data.success) {
          const updated = shelfItems.filter(item => item.id !== id);
          setShelfItems(updated);
          if (focusedShelfItem >= updated.length) {
            setFocusedItem(Math.max(0, updated.length - 1));
          }
        }
      })
      .catch(err => console.error('Error deleting item:', err));
  };

  return (
    <div className="relative flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4 bg-primary dark:bg-primary-dark overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-brd-primary dark:border-brd-primary-dark mx-2">
        <p className="font-bold">Shelf</p>
        <button onClick={() => setIsModalOpen(true)}>
          <MdDriveFolderUpload className="w-6 h-6 cursor-pointer hover:text-blue-500" />
        </button>
      </div>

      {/* Centering Div */}
      <div className="flex flex-1 items-center w-full overflow-hidden">

        {/* Add to Shelf Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
            <div className="p-6 w-96 flex flex-col gap-3 border bg-primary dark:bg-primary-dark border-brd-primary dark:border-brd-primary-dark rounded-lg">
              <div className="flex justify-between items-center w-full">
                <h2 className="font-semibold text-lg">Add to Shelf</h2>
                <button onClick={() => { setIsModalOpen(false); setModalView('choose'); }}>
                  <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
                </button>
              </div>

              {modalView === 'choose' && (
                <div className="flex gap-2 justify-center">
                  <button
                    className="cursor-pointer flex-1 flex flex-col items-center gap-2 p-4 border border-brd-primary dark:border-brd-primary-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark"
                    title="Add a YouTube video"
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
                  <p className="text-sm">Paste a YouTube URL:</p>
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
                      onClick={addYoutubeItem}
                    >
                      Add
                    </button>
                    <button
                      className="flex-1 px-3 py-2 rounded-md cursor-pointer border-brd-primary hover:bg-secondary dark:border-brd-primary-dark dark:hover:bg-secondary-dark"
                      onClick={() => setModalView('choose')}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {modalView === 'pdf' && (
                <div>
                  <p className="text-sm">Upload a PDF</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="w-full px-3 py-2 rounded-md bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark cursor-pointer"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                      onClick={addPdfItem}
                    >
                      Add
                    </button>
                    <button
                      className="flex-1 px-3 py-2 rounded-md cursor-pointer border-brd-primary hover:bg-secondary dark:border-brd-primary-dark dark:hover:bg-secondary-dark"
                      onClick={() => setModalView('choose')}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDF Viewer Modal */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
            <div className="fixed flex flex-col h-full w-[50%] rounded-xl border-2 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark">
              <div className="flex justify-between flex-row w-full items-center p-4">
                <h2 className="semi-bold text-lg">Your PDF</h2>
                <button onClick={() => setSelectedPdf(null)}>
                  <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto flex justify-center p-4">
                <Document
                  file={selectedPdf}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                  {numPages && Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                    <Page
                      key={pageNum}
                      pageNumber={pageNum}
                      width={600}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
                </Document>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Player Modal */}
        {selectedYoutube && (
          <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-50">
            <div className="flex flex-col w-[90%] max-w-6xl rounded-xl border-2 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark">
              <div className="flex justify-between items-center px-5 py-3">
                <h2 className="font-semibold text-lg">YouTube Video</h2>
                <button onClick={() => setSelectedYoutube(null)}>
                  <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer hover:text-red-500" />
                </button>
              </div>
              <div className="aspect-video px-5 pb-5">
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(selectedYoutube)}?autoplay=1`}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>
            </div>
          </div>
        )}

        {/* Empty SHelf Text */}
        {shelfItems.length === 0 ? (
          <p className="flex-1 text-center text-sm text-gray-400 dark:text-gray-500 select-none">
            No resources yet. Click + to add one.
          </p>
        ) : (
          <>
            {focusedShelfItem > 0 && (
              <button
                className="text-5xl font-light px-2 cursor-pointer hover:opacity-50 shrink-0"
                onClick={() => setFocusedItem(focusedShelfItem - 1)}
              >
                ‹
              </button>
            )}

            {/* Item display */}
            <div className="flex flex-1 overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out w-full"
                style={{ transform: `translateX(-${focusedShelfItem * 100}%)` }}
              >
                {shelfItems.map((item) => (
                  <div key={item.id} className="flex-none w-full flex justify-center items-center">
                    <div className="flex flex-col items-center">
                      <div className="inline-flex flex-col gap-1 items-center p-2 hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-xl">
                        {item.type === 'youtube' ? (
                          <div className="relative group">
                            <img
                              src={getYoutubeThumbnail(item.url)}
                              alt="YouTube thumbnail"
                              className="rounded-lg object-cover cursor-pointer max-h-64 w-auto"
                              onClick={() => setSelectedYoutube(item.url)}
                            />
                            <button
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-blue-500/80 text-white rounded-full p-1.5 cursor-pointer z-10"
                              onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                            >
                              <FaRegTrashCan className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="relative group cursor-pointer"
                            style={{ height: '260px', width: '200px', overflow: 'hidden', borderRadius: '8px' }}
                            onClick={() => setSelectedPdf(`data:application/pdf;base64,${item.fileData}`)}
                          >
                            <Document file={`data:application/pdf;base64,${item.fileData}`}>
                              <Page
                                pageNumber={1}
                                width={200}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                              />
                            </Document>
                            <button
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-blue-500/80 text-white rounded-full p-1.5 cursor-pointer z-10"
                              onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                            >
                              <FaRegTrashCan className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-1 group">
                          {editingId === item.id ? (
                            <input
                              ref={nameInputRef}
                              className="text-sm text-center bg-transparent border-b border-gray-400 outline-none w-40"
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              onBlur={() => saveItemName(item.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveItemName(item.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                            />
                          ) : (
                            <>
                              <p className="text-sm">
                                {item.fileName || (item.type === 'youtube' ? 'YouTube Video' : 'PDF')}
                              </p>
                              <button
                                className="opacity-0 group-hover:opacity-50 hover:opacity-100! transition-opacity cursor-pointer"
                                onClick={() => startEditing(item)}
                              >
                                <MdOutlineEdit className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {focusedShelfItem < shelfItems.length - 1 && (
              <button
                className="text-5xl font-light px-2 cursor-pointer hover:opacity-50 shrink-0"
                onClick={() => setFocusedItem(focusedShelfItem + 1)}
              >
                ›
              </button>
            )}
          </>
        )}

      </div>

      {/* page indicator */}
      {shelfItems.length > 1 && (
        <div className="flex justify-center gap-1 items-center pt-2">
          {shelfItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setFocusedItem(i)}
              className={`rounded-full transition-all duration-200 cursor-pointer bg-gray-600 dark:bg-gray-300 ${
                i === focusedShelfItem
                  ? 'w-2 h-2 opacity-80'
                  : 'w-1.5 h-1.5 opacity-30 hover:opacity-60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
