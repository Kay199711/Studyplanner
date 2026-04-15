import * as controllers from './controllers/index.js';

export default function registerRoutes(app) {
  // Root route
  app.get('/', (req, res) => {
    res.json({ message: 'Study Planner API', version: '1.0.0' });
  });

  // Auth routes
  app.post('/api/auth/login', controllers.login);
  app.post('/api/auth/register', controllers.register);
  app.post('/api/auth/logout', controllers.logout);

  // User routes
  app.patch('/api/users/:id/profile', controllers.updateProfile);
  app.patch('/api/users/:id/password', controllers.updatePassword);

  // Sticky Note routes
  app.get('/api/notes', controllers.getNotes);
  app.post('/api/notes', controllers.createNote);
  app.put('/api/notes/:id', controllers.updateNote);
  app.delete('/api/notes/:id', controllers.deleteNote);

  // Shelf routes
  app.get('/api/shelf', controllers.getShelfItems);
  app.post('/api/shelf', controllers.createShelfItem);
  app.patch('/api/shelf/:id', controllers.updateShelfItem);
  app.delete('/api/shelf/:id', controllers.deleteShelfItem);

  // Calendar Events routes
  app.get('/api/events', controllers.getEvents);
  app.post('/api/events', controllers.createEvent);
  app.put('/api/events/:id', controllers.updateEvent);
  app.delete('/api/events/:id', controllers.deleteEvent);
}

