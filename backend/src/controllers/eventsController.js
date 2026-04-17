import prisma from '../config/database.js';

const mapEvent = (event) => ({
  event_id: event.id,
  title: event.title,
  description: event.description,
  start_date: event.startDate,
  end_date: event.endDate,
  all_day: Boolean(event.allDay),
  created_at: event.createdAt,
  updated_at: event.updatedAt,
});

// ---- GET ALL EVENTS ----
export const getEvents = async (req, res, next) => {
  try {
    const events = await prisma.calendarEvent.findMany({
      orderBy: { startDate: 'asc' },
    });

    res.status(200).json(events.map(mapEvent));
  } catch (error) {
    next(error);
  }
};

// ---- CREATE EVENT ----
export const createEvent = async (req, res, next) => {
  const { title, description, start_date, end_date, all_day } = req.body;

  if (!title || !start_date || !end_date) {
    return res.status(400).json({ message: 'title, start_date, and end_date are required' });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return res.status(400).json({ message: 'start_date and end_date must be valid dates' });
  }

  if (endDate < startDate) {
    return res.status(400).json({ message: 'end_date cannot be before start_date' });
  }

  try {
    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description: description ?? null,
        startDate,
        endDate,
        allDay: Boolean(all_day),
      },
    });

    res.status(201).json(mapEvent(event));
  } catch (error) {
    next(error);
  }
};

// ---- UPDATE EVENT ----
export const updateEvent = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, all_day } = req.body;

  try {
    const existing = await prisma.calendarEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const nextStart = start_date !== undefined ? new Date(start_date) : existing.startDate;
    const nextEnd = end_date !== undefined ? new Date(end_date) : existing.endDate;

    if (Number.isNaN(nextStart.getTime()) || Number.isNaN(nextEnd.getTime())) {
      return res.status(400).json({ message: 'start_date and end_date must be valid dates' });
    }

    if (nextEnd < nextStart) {
      return res.status(400).json({ message: 'end_date cannot be before start_date' });
    }

    const updated = await prisma.calendarEvent.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description !== undefined ? description : existing.description,
        startDate: nextStart,
        endDate: nextEnd,
        allDay: all_day !== undefined ? Boolean(all_day) : existing.allDay,
      },
    });

    res.status(200).json(mapEvent(updated));
  } catch (error) {
    next(error);
  }
};

// ---- DELETE EVENT ----
export const deleteEvent = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existing = await prisma.calendarEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await prisma.calendarEvent.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
