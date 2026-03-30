import prisma from '../config/database.js';
export const getNotes = async (req, res, next) => {

    try {
        const notes = await prisma.note.findMany({
            orderBy: [
                { Pinned: 'desc' },
                { createdAt: 'desc' }  
            ]
        });
        const notesWithBooleans = notes.map(note => ({
            ...note,
            Pinned: note.Pinned === 1
        }));
        res.json({success: true, data: notesWithBooleans});
    } catch (error) {
        next(error);
    }
};
export const createNote = async (req, res, next) => {
    
    try {
        const { content, color, pinned } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required'});
        }

        if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
            return res.status(400).json({ success: false, message: 'Invalid color format. Must be hex like #FFAA88' });
        }

        const createNote = await prisma.note.create({
            data: {
                content: content,
                color: color,
                Pinned: pinned || 0
            }

        });
        res.status(201).json({ success: true, data: createNote });
    } catch (error) {
        next(error);
    }
};
export const updateNote = async (req, res, next) => {
    const { id } = req.params;
    const { content, color, Pinned, pinned } = req.body;

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
        const updatedNote = await prisma.note.update({
            where: { id: parseInt(id) },
            data: {
                content: content,
                color: color,
                Pinned: Pinned ?? pinned
            }
        })
        res.json({ success: true, data: updatedNote });
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
    