import React from 'react';

const StatsCards = ({ tickets = [] }) => {
  // Dynamically derive statistics from ticket state
  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const stats = [
    {
      id: 'total',
      label: 'Total Tickets',
      count: total,
      colorClass: 'stat-total',
      indicatorClass: 'indicator-slate'
    },
    {
      id: 'open',
      label: 'Open',
      count: openCount,
      colorClass: 'stat-open',
      indicatorClass: 'indicator-blue'
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: inProgressCount,
      colorClass: 'stat-in-progress',
      indicatorClass: 'indicator-amber'
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: resolvedCount,
      colorClass: 'stat-resolved',
      indicatorClass: 'indicator-emerald'
    }
  ];

  return (
    <section className="stats-grid" aria-label="Ticket statistics summary">
      {stats.map((stat) => (
        <div key={stat.id} className={`stat-card ${stat.colorClass}`}>
          <div className="stat-header">
            <span className="stat-label">{stat.label}</span>
            <span className={`stat-indicator ${stat.indicatorClass}`}></span>
          </div>
          <div className="stat-value">{stat.count}</div>
        </div>
      ))}
    </section>
  );
};

export default StatsCards;

