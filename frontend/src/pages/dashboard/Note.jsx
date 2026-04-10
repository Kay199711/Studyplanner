import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";


export default function Note() {
    
    const [focusedNote, setFocusedNote] = useState(0)
    const [notes, setNotes] = useState([
        { id: 1, text: '', color: '#fef08a'}
    ]);
    
    return (
        <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl flex-1 p-4  bg-primary dark:bg-primary-dark">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-brd-primary dark:border-brd-primary-dark" >
                <p className="font-bold">Sticky Note</p>
                    <div className="flex gap-2 items-center">
                        <button
                            className="px-2 py-1 rounded-md border border-brd-primary dark:border-brd-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={focusedNote === 0}
                            onClick={() => setFocusedNote(focusedNote - 1)}
                            >
                            ←
                        </button>
                        <button
                            className="px-2 py-1 rounded-md border border-brd-primary dark:border-brd-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={()=> setFocusedNote(focusedNote + 1)}
                            disabled={focusedNote === notes.length - 1}
                            >
                            →
                        </button>
                        <button
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => {
                            const newNote = { id: notes.length + 1, text: '', color: '#fda4af' };
                            setNotes ([...notes, newNote]);
                            setFocusedNote(notes.length);
                        }}
                        >
                        <IoIosAddCircleOutline className="w-6 h-6 hover:text-blue-500"/>
                        </button>
                    </div>
            </div>
            <div 
                className="flex-1 rounded-lg mt-2 p-2"
                style={{backgroundColor : notes[focusedNote].color}}
            >     
            <textarea 
                className="h-full w-full bg-transparent resize-none outline-none text-black"
                value={notes[focusedNote].text}
                onChange={(e) => {
                    const updated = [...notes];
                    updated[focusedNote].text = e.target.value;
                    setNotes(updated);
            }}
            /> 
            </div>
        </div>
    )
}