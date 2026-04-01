import * as controllers from './controllers/index.js';

export default function registerRoutes(app) {
  // Root route
  app.get('/', (req, res) => {
    res.json({ message: 'Study Planner API', version: '1.0.0' });
  });

  // Auth routes
  app.post('/api/auth/login', controllers.login);
  app.post('/api/auth/logout', controllers.logout);

  // Sticky Note routes
  app.get('/api/notes', controllers.getNotes);
  app.post('/api/notes', controllers.createNote);
  app.put('/api/notes/:id', controllers.updateNote);
  app.delete('/api/notes/:id', controllers.deleteNote);

  // Shelf routes
  app.get('/api/shelf', controllers.getShelfItems);
  app.post('/api/shelf', controllers.createShelfItem);
  app.delete('/api/shelf/:id', controllers.deleteShelfItem);
}
