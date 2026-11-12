import React from 'react';

const formatTicketDate = (dateString) => {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
};

const TicketCard = ({ ticket, onStatusChange, onDeleteRequest, isUpdating = false }) => {
  const priorityClass = `badge-priority-${ticket.priority?.toLowerCase() || 'low'}`;
  const statusSlug = ticket.status?.toLowerCase().replace(/\s+/g, '-') || 'open';
  const statusClass = `badge-status-${statusSlug}`;

  return (
    <article className="ticket-card" aria-labelledby={`ticket-title-${ticket._id}`}>
      {/* Top row: Badges and Creation Date */}
      <div className="ticket-card-meta">
        <div className="ticket-badges">
          <span className={`badge ${priorityClass}`}>
            <span className="badge-bullet"></span>
            {ticket.priority} Priority
          </span>
          <span className={`badge ${statusClass}`}>
            <span className="badge-bullet"></span>
            {ticket.status}
          </span>
        </div>
        <time className="ticket-date" dateTime={ticket.createdAt}>
          {formatTicketDate(ticket.createdAt)}
        </time>
      </div>

      {/* Title & Description */}
      <h3 id={`ticket-title-${ticket._id}`} className="ticket-title">
        {ticket.title}
      </h3>
      <p className="ticket-description">
        {ticket.description}
      </p>

      {/* Actions row: Status Update dropdown & Delete button */}
      <div className="ticket-actions">
        <div className="status-select-wrapper">
          <label htmlFor={`status-select-${ticket._id}`} className="status-select-label">
            Status:
          </label>
          <div className="status-control-container">
            <select
              id={`status-select-${ticket._id}`}
              className="status-select-control"
              value={ticket.status}
              disabled={isUpdating}
              onChange={(e) => onStatusChange(ticket._id, e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            {isUpdating && <span className="spinner-mini" title="Updating status in database..."></span>}
          </div>
        </div>

        <button
          type="button"
          className="btn-delete"
          onClick={() => onDeleteRequest(ticket)}
          aria-label={`Delete ticket: ${ticket.title}`}
          title="Delete ticket"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="delete-text">Delete</span>
        </button>
      </div>
    </article>
  );
};

export default TicketCard;
