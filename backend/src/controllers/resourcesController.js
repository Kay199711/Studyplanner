import prisma from '../config/database.js';

const mapResource = (resource) => ({
  resource_id: resource.id,
  class_name: resource.className,
  description: resource.description,
  instructor: resource.instructor,
  schedule: resource.schedule,
  semester: resource.semester,
  created_at: resource.createdAt,
  updated_at: resource.updatedAt,
});

// GET, fetching all resources
export const getResources = async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { className: 'asc' },
    });

    res.status(200).json(resources.map(mapResource));
  } catch (error) {
    next(error);
  }
};

// POST, create new resource
export const createResource = async (req, res, next) => {
  const { class_name, description, instructor, schedule, semester } = req.body;

  if (!class_name?.trim()) {
    return res.status(400).json({ error: 'please enter class name.' });
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        className: class_name.trim(),
        description: description || '',
        instructor: instructor || '',
        schedule: schedule || '',
        semester: semester || '',
      },
    });

    res.status(201).json(mapResource(resource));
  } catch (error) {
    next(error);
  }
};

// PUT, update an existing resource
export const updateResource = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existing = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: 'given resourceID does not exist' });
    }

    const updated = await prisma.resource.update({
      where: { id: parseInt(id) },
      data: {
        className: req.body.class_name ?? existing.className,
        description: req.body.description ?? existing.description,
        instructor: req.body.instructor ?? existing.instructor,
        schedule: req.body.schedule ?? existing.schedule,
        semester: req.body.semester ?? existing.semester,
      },
    });

    res.status(200).json(mapResource(updated));
  } catch (error) {
    next(error);
  }
};

// DELETE, deleting a resource
export const deleteResource = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existing = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: 'given resourceID does not exist' });
    }

    await prisma.resource.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'resource deleted successfully' });
  } catch (error) {
    next(error);
  }
};
