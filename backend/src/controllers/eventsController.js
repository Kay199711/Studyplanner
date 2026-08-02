import prisma from '../config/database.js';

// ---- GET ALL EVENTS ----
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.$queryRaw`
      SELECT * FROM "CalendarEvent" ORDER BY startDate ASC
    `;
    const mapped = events.map(e => ({
      event_id: e.id,
      title: e.title,
      description: e.description,
      start_date: e.startDate,
      end_date: e.endDate,
      all_day: e.allDay === 1,
      color: e.color ?? 'blue',
      created_at: e.createdAt,
      updated_at: e.updatedAt,
    }));
    res.status(200).json(mapped);
  } catch (err) {
    console.error('GET EVENTS ERROR:', err.message);
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// ---- CREATE EVENT ----
export const createEvent = async (req, res) => {
  const { title, description, start_date, end_date, all_day, color } = req.body;

  if (!title || !start_date || !end_date) {
    return res.status(400).json({ message: 'title, start_date, and end_date are required' });
  }

  if (new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({ message: 'end_date cannot be before start_date' });
  }

  try {
    const id = crypto.randomUUID();
    const allDayInt = all_day ? 1 : 0;
    const eventColor = color ?? 'blue';
    const now = new Date().toISOString();

    await prisma.$executeRaw`
  INSERT INTO "CalendarEvent" (id, title, description, startDate, endDate, allDay, color, createdAt, updatedAt)
  VALUES (${id}, ${title}, ${description ?? null}, ${new Date(start_date)}, ${new Date(end_date)}, ${allDayInt}, ${eventColor}, ${new Date(now)}, ${new Date(now)})
    `;

    const rows = await prisma.$queryRaw`
      SELECT * FROM "CalendarEvent" WHERE id = ${id}
    `;
    const e = rows[0];
    res.status(201).json({
      event_id: e.id,
      title: e.title,
      description: e.description,
      start_date: e.startDate,
      end_date: e.endDate,
      all_day: e.allDay === 1,
      color: e.color ?? 'blue',
      created_at: e.createdAt,
      updated_at: e.updatedAt,
    });
  } catch (err) {
    console.error('CREATE EVENT ERROR:', err.message);
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

// ---- UPDATE EVENT ----
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, all_day, color } = req.body;

  try {
    const existing = await prisma.$queryRaw`
      SELECT * FROM "CalendarEvent" WHERE id = ${id}
    `;
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const current = existing[0];

    const newStart = start_date ?? current.startDate;
    const newEnd = end_date ?? current.endDate;
    if (new Date(newEnd) < new Date(newStart)) {
      return res.status(400).json({ message: 'end_date cannot be before start_date' });
    }

    const newTitle = title ?? current.title;
    const newDescription = description ?? current.description;
    const newAllDay = all_day !== undefined ? (all_day ? 1 : 0) : current.allDay;
    const newColor = color ?? current.color ?? 'blue';
    const now = new Date().toISOString();

    await prisma.$executeRaw`
      UPDATE "CalendarEvent"
      SET title = ${newTitle},
          description = ${newDescription},
          startDate = ${newStart},
          endDate = ${newEnd},
          allDay = ${newAllDay},
          color = ${newColor},
          updatedAt = ${now}
      WHERE id = ${id}
    `;

    const updated = await prisma.$queryRaw`
      SELECT * FROM "CalendarEvent" WHERE id = ${id}
    `;
    const e = updated[0];
    res.status(200).json({
      event_id: e.id,
      title: e.title,
      description: e.description,
      start_date: e.startDate,
      end_date: e.endDate,
      all_day: e.allDay === 1,
      color: e.color ?? 'blue',
      created_at: e.createdAt,
      updated_at: e.updatedAt,
    });
  } catch (err) {
    console.error('UPDATE EVENT ERROR:', err.message);
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

// ---- DELETE EVENT ----
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.$queryRaw`
      SELECT * FROM "CalendarEvent" WHERE id = ${id}
    `;
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await prisma.$executeRaw`
      DELETE FROM "CalendarEvent" WHERE id = ${id}
    `;

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('DELETE EVENT ERROR:', err.message);
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};