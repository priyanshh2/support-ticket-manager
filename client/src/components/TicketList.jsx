import React from 'react';
import TicketCard from './TicketCard';
import EmptyState from './EmptyState';

const TicketList = ({
  tickets = [],
  onStatusChange,
  onDeleteRequest,
  onCreateClick,
  updatingTicketId = null
}) => {
  if (tickets.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  // Ensure newest tickets appear first
  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="tickets-section" aria-label="Support tickets list">
      <div className="section-header">
        <h2 className="section-title">Support Tickets</h2>
        <span className="tickets-count-badge">
          {sortedTickets.length} {sortedTickets.length === 1 ? 'ticket' : 'tickets'}
        </span>
      </div>

      <div className="tickets-list">
        {sortedTickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onStatusChange={onStatusChange}
            onDeleteRequest={onDeleteRequest}
            isUpdating={updatingTicketId === ticket._id}
          />
        ))}
      </div>
    </section>
  );
};

export default TicketList;
