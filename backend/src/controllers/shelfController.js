import prisma from '../config/database.js';

export const getShelfItems = async (req, res, next) => {
  try {
    const items = await prisma.shelfItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const createShelfItem = async (req, res, next) => {
  try {
    const { type, url, fileData, fileName } = req.body;

    if (!type || !['youtube', 'pdf'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be youtube or pdf' });
    }
    if (type === 'youtube' && !url) {
      return res.status(400).json({ success: false, message: 'URL is required for YouTube items' });
    }
    if (type === 'pdf' && !fileData) {
      return res.status(400).json({ success: false, message: 'fileData is required for PDF items' });
    }

    const item = await prisma.shelfItem.create({
      data: { type, url, fileData, fileName }
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteShelfItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await prisma.shelfItem.findUnique({ where: { id: parseInt(id) } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    await prisma.shelfItem.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
};