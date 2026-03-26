import express from 'express';
import db from '../config/db.js';

const router = express.Router();

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET /api/todos — fetch all todos
router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM TodoItems').all();
  res.json(todos);
});

// POST /api/todos — create a new todo
router.post('/', (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  const stmt = db.prepare(`
    INSERT INTO TodoItems (Title, Description, Status, Priority, DueDate)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    title,
    description ?? null,
    status ?? 'todo',
    priority ?? 'medium',
    due_date ?? null
  );

  const newTodo = db.prepare('SELECT * FROM TodoItems WHERE TodoID = ?').get(result.lastInsertRowid);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id — update a todo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  const existing = db.prepare('SELECT * FROM TodoItems WHERE TodoID = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  const fields = [];
  const values = [];

  if (title !== undefined)       { fields.push('Title = ?');       values.push(title); }
  if (description !== undefined) { fields.push('Description = ?'); values.push(description); }
  if (status !== undefined)      { fields.push('Status = ?');      values.push(status); }
  if (priority !== undefined)    { fields.push('Priority = ?');    values.push(priority); }
  if (due_date !== undefined)    { fields.push('DueDate = ?');     values.push(due_date); }

  fields.push("UpdatedAt = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE TodoItems SET ${fields.join(', ')} WHERE TodoID = ?`).run(...values);

  const updated = db.prepare('SELECT * FROM TodoItems WHERE TodoID = ?').get(id);
  res.json(updated);
});

// DELETE /api/todos/:id — delete a todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM TodoItems WHERE TodoID = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  db.prepare('DELETE FROM TodoItems WHERE TodoID = ?').run(id);
  res.json({ message: 'Todo deleted successfully' });
});

export default router;