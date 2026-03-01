import * as controllers from './controllers/index.js';

export default function registerRoutes(app) {
  // Root route
  app.get('/', (req, res) => {
    res.json({ message: 'Study Planner API', version: '1.0.0' });
  });

  // Auth routes
  app.post('/api/auth/login', controllers.login);
  app.post('/api/auth/logout', controllers.logout);
}
