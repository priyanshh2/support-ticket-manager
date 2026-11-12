import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  const PORT = config.port;

  // Start the Express server first so health-check and status endpoints remain accessible
  const server = app.listen(PORT, () => {
    console.log(`[Server] Mini Support Ticket Manager Backend running on http://localhost:${PORT}`);
    console.log(`[Server] Health Check available at http://localhost:${PORT}/api/health`);
    console.log(`[Server] Tickets API available at http://localhost:${PORT}/api/tickets`);
  });

  // Attempt MongoDB connection; background retries run automatically if initial attempt encounters network delay
  try {
    await connectDB();
  } catch (error) {
    console.warn('[Server] Initial MongoDB connection attempt failed. Continuing in degraded mode while reconnecting in background.');
  }

  return server;
};

startServer();
