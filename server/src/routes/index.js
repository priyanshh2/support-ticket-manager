import express from 'express';
import healthRoutes from './health.routes.js';
import ticketRoutes from './ticket.routes.js';

const apiRouter = express.Router();

// Mount health routes at /api/health
apiRouter.use('/', healthRoutes);

// Mount ticket routes at /api/tickets
apiRouter.use('/tickets', ticketRoutes);

export default apiRouter;
