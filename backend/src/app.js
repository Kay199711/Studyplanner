import express from 'express';
import cors from 'cors';
import registerRoutes from './routes.js';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
    : true, // in dev, allow any origin if FRONTEND_URL not set
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
registerRoutes(app);

export default app;