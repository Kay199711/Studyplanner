import db from './db.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS TodoItems (
    TodoID      INTEGER PRIMARY KEY AUTOINCREMENT,
    Title       TEXT    NOT NULL,
    Description TEXT,
    Status      TEXT    NOT NULL DEFAULT 'todo',
    Priority    TEXT    NOT NULL DEFAULT 'medium',
    DueDate     TEXT,
    CreatedAt   TEXT    NOT NULL DEFAULT (datetime('now')),
    UpdatedAt   TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

console.log('✅ TodoItems table ready');