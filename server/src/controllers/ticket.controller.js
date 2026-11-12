import mongoose from 'mongoose';
import Ticket from '../models/ticket.model.js';

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'];
const ALLOWED_STATUSES = ['Open', 'In Progress', 'Resolved'];

/**
 * Create a new support ticket
 * Route: POST /api/tickets
 */
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    // Validate title
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Ticket title is required and cannot be empty'
      });
    }

    // Validate description
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Ticket description is required and cannot be empty'
      });
    }

    // Validate priority
    if (!priority || typeof priority !== 'string' || !ALLOWED_PRIORITIES.includes(priority.trim())) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority. Allowed values are: ${ALLOWED_PRIORITIES.join(', ')}`
      });
    }

    // Always ensure new tickets start with status 'Open'
    const newTicket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority.trim(),
      status: 'Open'
    });

    return res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: newTicket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve all support tickets sorted newest first
 * Route: GET /api/tickets
 */
export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the status of an existing ticket
 * Route: PATCH /api/tickets/:id
 */
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID format'
      });
    }

    // Validate status
    if (!status || typeof status !== 'string' || !ALLOWED_STATUSES.includes(status.trim())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    // Update ONLY the status field, preventing any other modifications
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status: status.trim() },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a ticket permanently
 * Route: DELETE /api/tickets/:id
 */
export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID format'
      });
    }

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

