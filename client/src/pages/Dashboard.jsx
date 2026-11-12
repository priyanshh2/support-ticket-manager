import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { fetchTickets, updateTicketStatus, deleteTicket } from '../services/api';

const Dashboard = () => {
  // Live tickets state populated from MongoDB Atlas
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Operation feedback notification (auto-dismissed)
  const [notification, setNotification] = useState(null);

  // Active status update tracker (for mini spinner / disabled state)
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to show temporary notification banner
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Load tickets from MongoDB Atlas on mount
  const loadTickets = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets from backend:', err);
      setFetchError(
        err.message || 'Unable to connect to the backend server. Please verify the server is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Smooth scroll and focus to the creation form
  const handleScrollToForm = () => {
    const section = document.getElementById('create-ticket-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const titleInput = document.getElementById('ticket-title');
      if (titleInput) {
        titleInput.focus();
      }
    }
  };

  // Handler when a ticket is created via TicketForm (prepend newest)
  const handleTicketCreated = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    showNotification('success', 'Ticket successfully created and saved to MongoDB Atlas.');
  };

  // Handler for updating ticket status via PATCH /api/tickets/:id
  const handleStatusChange = async (ticketId, newStatus) => {
    // Locate target ticket
    const currentTicket = tickets.find((t) => t._id === ticketId);
    if (!currentTicket || currentTicket.status === newStatus) return;

    setUpdatingTicketId(ticketId);
    try {
      // Call backend API PATCH /api/tickets/:id
      const updatedTicket = await updateTicketStatus(ticketId, newStatus);

      // Update state with confirmed backend data
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? updatedTicket : t))
      );
      showNotification('success', `Ticket status updated to "${newStatus}".`);
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      // Backend rejected or failed: keep original status, show error
      showNotification(
        'error',
        `Failed to update status: ${err.message || 'Server rejected status update.'}`
      );
    } finally {
      setUpdatingTicketId(null);
    }
  };

  // Open delete confirmation modal
  const handleDeleteRequest = (ticket) => {
    setDeleteTarget(ticket);
  };

  // Confirm delete and call DELETE /api/tickets/:id
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteTicket(deleteTarget._id);

      // Remove from UI state on successful database deletion
      setTickets((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      showNotification('success', 'Ticket successfully deleted from database.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      showNotification('error', `Failed to delete ticket: ${err.message || 'Database error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteTarget(null);
    }
  };

  return (
    <main className="dashboard-main">
      <div className="container">
        {/* Header with "+ Create Ticket" button */}
        <Header onCreateClick={handleScrollToForm} />

        {/* Global Feedback Notification */}
        {notification && (
          <div
            className={`alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'} global-toast`}
            role="status"
          >
            {notification.type === 'error' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{notification.message}</span>
            <button
              type="button"
              className="alert-close"
              onClick={() => setNotification(null)}
              aria-label="Dismiss message"
            >
              &times;
            </button>
          </div>
        )}

        {/* Dynamic Ticket Statistics derived directly from live database records */}
        <StatsCards tickets={tickets} />

        {/* Responsive Dashboard Content Layout */}
        <div className="dashboard-content-grid">
          {/* Ticket Listing Section */}
          <div className="dashboard-column-list">
            {isLoading ? (
              <div className="loading-state-container" aria-live="polite">
                <div className="spinner-large"></div>
                <p className="loading-text">Loading support tickets from MongoDB Atlas...</p>
              </div>
            ) : fetchError ? (
              <div className="error-state-card" role="alert">
                <div className="error-state-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="error-state-title">Failed to load tickets</h3>
                <p className="error-state-subtitle">{fetchError}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={loadTickets}
                  style={{ marginTop: '1rem' }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <TicketList
                tickets={tickets}
                onStatusChange={handleStatusChange}
                onDeleteRequest={handleDeleteRequest}
                onCreateClick={handleScrollToForm}
                updatingTicketId={updatingTicketId}
              />
            )}
          </div>

          {/* Ticket Creation Form Section */}
          <div className="dashboard-column-form">
            <TicketForm onTicketCreated={handleTicketCreated} />
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Permanent Deletion */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        ticketTitle={deleteTarget?.title}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </main>
  );
};

export default Dashboard;
