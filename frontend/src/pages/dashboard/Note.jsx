import { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { IoColorPaletteOutline } from "react-icons/io5";

export default function Note() {

    const [focusedNote, setFocusedNote] = useState(0)
    const [notes, setNotes] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const colorPalette = [
        '#fef08a', // yellow
        '#fda4af', // pink
        '#a5f3fc', // cyan
        '#d8b4fe', // purple
        '#bbf7d0', // green
        '#fed7aa', // orange
        '#fecaca', // red
        '#e9d5ff', // lavender
        '#bfdbfe', // blue
        '#fde68a', // amber
        '#a7f3d0', // emerald
        '#fbcfe8', // rose
    ];

    const loadNotes = () => {
        return fetch('http://localhost:3000/api/notes')
            .then(res => res.json())
            .then(data => {
                setLoaded(true);
                if(data.success && data.data.length > 0) {
                    setNotes(data.data);
                    return data.data;
                }
                return [];
            })
            .catch(err => console.error('Error', err));
    };

    useEffect(() => {
        loadNotes();
    }, []);

    return (
        <div className="flex flex-col border-2 rounded-xl flex-1 p-4 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark">
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
                            fetch('http://localhost:3000/api/notes', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    content: ' ',
                                    color: '#fda4af',
                                    pinned: 0
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    setNotes([...notes, data.data]);
                                    setFocusedNote(notes.length);
                                }
                            })
                            .catch(err => console.error('Error creating note:', err));
                        }}
                        >
                        <IoIosAddCircleOutline className="w-6 h-6 hover:text-blue-500"/>
                        </button>
                    </div>
            </div>
            {(!loaded || notes.length === 0) ? (
                <div className="flex-1 rounded-lg mt-2 p-2 flex items-center justify-center text-sm text-gray-400">
                    {loaded ? 'No notes yet. Click + to add one.' : 'Loading...'}
                </div>
            ) : null}
            {loaded && notes.length > 0 && (
            <div
                className="flex-1 rounded-lg mt-2 p-2 relative"
                style={{backgroundColor : notes[focusedNote].color}}
            >
                <button
                className="absolute bottom-2 right-8 cursor-pointer text-black"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>{
                    const currentNote = notes[focusedNote];
                    const newPinnedValue = currentNote.Pinned ? 0 : 1;

                    fetch(`http://localhost:3000/api/notes/${currentNote.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            content: currentNote.content,
                            color: currentNote.color,
                            Pinned: newPinnedValue
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            loadNotes().then(freshNotes => {
                                const newIndex = freshNotes.findIndex(n => n.id === currentNote.id);
                                setFocusedNote(newIndex >= 0 ? newIndex : 0);
                            });
                        }
                    })
                    .catch(err => console.error('Error toggling pin:', err));
                }}
                >
                {notes[focusedNote]?.Pinned ? (
                    <BsPinAngleFill className="h-4 w-4 hover:text-blue-500"/>
                ) : (
                    <BsPinAngle className="h-4 w-4 hover:text-blue-500"/>
                )}
                </button>

                {/* Color picker */}
                <div className="absolute bottom-2 right-14 flex items-center">
                    <button
                        className="cursor-pointer text-black"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                        <IoColorPaletteOutline className="h-4 w-4 hover:text-blue-500"/>
                    </button>
                    {showColorPicker && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setShowColorPicker(false)}
                            />
                            <div className="absolute bottom-6 right-0 z-20 rounded-lg shadow-lg p-2 w-28 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark">
                                <div className="grid grid-cols-4 gap-1 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark">
                                    {colorPalette.map(color => (
                                        <button
                                            key={color}
                                            className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
                                            style={{ backgroundColor: color }}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => {
                                                const currentNote = notes[focusedNote];
                                                fetch(`http://localhost:3000/api/notes/${currentNote.id}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        content: currentNote.content,
                                                        color: color,
                                                        Pinned: currentNote.Pinned ? 1 : 0
                                                    })
                                                })
                                                .then(res => res.json())
                                                .then(data => {
                                                    if (data.success) {
                                                        const updated = notes.map((n, i) =>
                                                            i === focusedNote ? { ...n, color } : n
                                                        );
                                                        setNotes(updated);
                                                        setShowColorPicker(false);
                                                    }
                                                })
                                                .catch(err => console.error('Error updating color:', err));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <button
                    className="text-black absolute bottom-2 right-2 cursor-pointer"
                    onClick={() => {
                        const noteId = notes[focusedNote].id;
                        fetch(`http://localhost:3000/api/notes/${noteId}`,{
                            method: 'DELETE',
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                const updatedNotes = notes.filter(note => note.id !== noteId);
                                setNotes(updatedNotes);

                                if (focusedNote >= updatedNotes.length) {
                                    setFocusedNote(updatedNotes.length - 1);
                                }
                            }
                        })
                        .catch(err => console.error('Error deleting note:', err));
                    }}
                >
                    <FaRegTrashCan className="h-4 w-4 hover:text-blue-500"/>
                </button>

            <textarea
                className="h-full w-full bg-transparent resize-none outline-none text-black"
                value={notes[focusedNote].content}
                onChange={(e) => {
                    const updated = notes.map((n, i) =>
                        i === focusedNote ? {...n, content: e.target.value } : n
                    );
                    setNotes(updated);
                }}
                onBlur={() => {
                    const currentNote = notes[focusedNote];
                    fetch(`http://localhost:3000/api/notes/${currentNote.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            content: currentNote.content,
                            color: currentNote.color,
                            Pinned: currentNote.Pinned ? 1 : 0
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Note saved!');
                        }
                    })
                    .catch(err => console.error('Error saving note:', err));
                }}
            />
            </div>
            )}
        </div>
    )
}
