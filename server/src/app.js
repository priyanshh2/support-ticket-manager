import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { config } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

// Configurable CORS Allowlist
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server health checks)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelDeployment = origin.endsWith('.vercel.app');
    const isDevelopment = config.nodeEnv === 'development';

    if (isExplicitlyAllowed || isVercelDeployment || isDevelopment) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked request from unauthorized origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Global Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Root route for hosting environment health inspection
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Mini Support Ticket Manager API',
    status: 'online',
    healthCheck: '/api/health',
    ticketsApi: '/api/tickets'
  });
});

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
