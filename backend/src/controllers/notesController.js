import prisma from '../config/database.js';

const normalizePinned = (value) => {
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (value === 1 || value === '1') return 1;
    return 0;
};

const mapNote = (note) => ({
    ...note,
    Pinned: note.Pinned === 1 || note.Pinned === true,
});

export const getNotes = async (req, res, next) => {

    try {
        const notes = await prisma.note.findMany({
            orderBy: [
                { Pinned: 'desc' },
                { createdAt: 'desc' }  
            ]
        });
        const notesWithBooleans = notes.map(mapNote);
        res.json({success: true, data: notesWithBooleans});
    } catch (error) {
        next(error);
    }
};
export const createNote = async (req, res, next) => {
    
    try {
        const { title, content, color, pinned } = req.body;
        const safeContent = typeof content === 'string' ? content : '';
        const safeColor = color || '#fef08a';

        if (safeColor && !/^#[0-9A-Fa-f]{6}$/.test(safeColor)) {
            return res.status(400).json({ success: false, message: 'Invalid color format. Must be hex like #FFAA88' });
        }

        const createdNote = await prisma.note.create({
            data: {
                title: title || '',
                content: safeContent,
                color: safeColor,
                Pinned: normalizePinned(pinned),
            }

        });
        res.status(201).json({ success: true, data: mapNote(createdNote) });
    } catch (error) {
        next(error);
    }
};
export const updateNote = async (req, res, next) => {
    const { id } = req.params;
    const { title, content, color, Pinned, pinned } = req.body;

    try {
        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) }
        });

        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found'});
        }
        if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
            return res.status(400).json({ success: false, message: 'Invalid color format. Must be hex like #FFAA88' });
        }
        const nextPinned = Pinned ?? pinned;
        const updatedNote = await prisma.note.update({
            where: { id: parseInt(id) },
            data: {
                title: title !== undefined ? title : note.title,
                content: content !== undefined ? content : note.content,
                color: color !== undefined ? color : note.color,
                Pinned: nextPinned !== undefined ? normalizePinned(nextPinned) : note.Pinned
            }
        })
        res.json({ success: true, data: mapNote(updatedNote) });
    } catch (error) {
        next(error);
    }
};
export const deleteNote = async (req, res, next) => {
    const { id } = req.params;

    try {
        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) }
        });

        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found'});
        }
        const deleteNote = await prisma.note.delete ({
            where: { id: parseInt(id) }
        });
        res.json({ success: true, message: 'Note deleted successfully' });
    
    } catch(error) {
        next(error);
    }
};
