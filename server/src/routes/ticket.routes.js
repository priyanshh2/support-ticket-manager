import express from 'express';
import {
  createTicket,
  getAllTickets,
  updateTicketStatus,
  deleteTicket
} from '../controllers/ticket.controller.js';
import { requireDBConnection } from '../middlewares/dbCheck.middleware.js';

const router = express.Router();

// Ensure active database connection for all ticket endpoints
router.use(requireDBConnection);

// Routes for /api/tickets
router.post('/', createTicket);
router.get('/', getAllTickets);
router.patch('/:id', updateTicketStatus);
router.delete('/:id', deleteTicket);

export default router;
