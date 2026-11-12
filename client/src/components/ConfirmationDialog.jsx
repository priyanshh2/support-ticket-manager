import React from 'react';

const ConfirmationDialog = ({ isOpen, ticketTitle, onConfirm, onCancel, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-icon-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 id="dialog-title" className="modal-title">Delete Ticket</h3>
            <p className="modal-description">
              Are you sure you want to permanently delete this ticket from the database?
            </p>
          </div>
        </div>

        {ticketTitle && (
          <div className="modal-target-card">
            <span className="modal-target-title">"{ticketTitle}"</span>
          </div>
        )}

        <p className="modal-subtext">This action cannot be undone.</p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-inline"></span>
                Deleting...
              </>
            ) : (
              'Delete Ticket'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
