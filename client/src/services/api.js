/**
 * Centralized API Service for Mini Support Ticket Manager
 * Connects frontend to Express backend and MongoDB Atlas
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to handle fetch responses and parse error messages
 */
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`Server returned unexpected response (${response.status})`);
  }

  if (!response.ok) {
    const errorMessage = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Checks backend health status
 * Endpoint: GET /api/health
 */
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

/**
 * Fetches all tickets from MongoDB Atlas, newest first
 * Endpoint: GET /api/tickets
 * @returns {Promise<Array>} Array of ticket objects
 */
export const fetchTickets = async () => {
  const response = await fetch(`${API_BASE_URL}/tickets`);
  const result = await handleResponse(response);
  return result.data || [];
};

/**
 * Creates a new support ticket in MongoDB Atlas
 * Endpoint: POST /api/tickets
 * @param {Object} ticketData - { title, description, priority }
 * @returns {Promise<Object>} The created ticket document
 */
export const createTicket = async (ticketData) => {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticketData)
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Updates the status of an existing ticket
 * Endpoint: PATCH /api/tickets/:id
 * @param {string} ticketId - MongoDB ObjectId of the ticket
 * @param {string} status - New status ('Open', 'In Progress', 'Resolved')
 * @returns {Promise<Object>} The updated ticket document
 */
export const updateTicketStatus = async (ticketId, status) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Permanently deletes a ticket from MongoDB Atlas
 * Endpoint: DELETE /api/tickets/:id
 * @param {string} ticketId - MongoDB ObjectId of the ticket
 * @returns {Promise<Object>} Success response
 */
export const deleteTicket = async (ticketId) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

export default {
  API_BASE_URL,
  checkHealth,
  fetchTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket
};
