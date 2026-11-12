import React, { useState } from 'react';
import { createTicket } from '../services/api';

const TicketForm = ({ onTicketCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required and cannot be empty.';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required and cannot be empty.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send ticket to backend POST /api/tickets
      const createdTicket = await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority
      });

      // Notify parent to update tickets state & dynamic stats
      onTicketCreated(createdTicket);

      // Reset form fields on success
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setErrors({});

      // Display success message
      setSuccessMessage('Ticket created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      // Preserve entered information and display meaningful error
      console.error('Ticket creation failed:', err);
      setErrorMessage(err.message || 'Failed to create ticket. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="create-ticket-section" className="ticket-form-card" aria-labelledby="form-heading">
      <div className="form-card-header">
        <h2 id="form-heading" className="form-card-title">Create New Support Ticket</h2>
        <p className="form-card-subtitle">Fill in the details below to submit a new support request.</p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setSuccessMessage('')}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="alert alert-error" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setErrorMessage('')}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="ticket-title" className="form-label">
            Title <span className="required-asterisk">*</span>
          </label>
          <input
            id="ticket-title"
            type="text"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g. Cannot reset password on mobile app"
            value={title}
            disabled={isSubmitting}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="ticket-description" className="form-label">
            Description <span className="required-asterisk">*</span>
          </label>
          <textarea
            id="ticket-description"
            rows="4"
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            placeholder="Provide relevant details, steps to reproduce, or error messages..."
            value={description}
            disabled={isSubmitting}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Priority Dropdown */}
        <div className="form-group">
          <label htmlFor="ticket-priority" className="form-label">
            Priority <span className="required-asterisk">*</span>
          </label>
          <select
            id="ticket-priority"
            className="form-select"
            value={priority}
            disabled={isSubmitting}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-inline"></span>
                Creating Ticket...
              </>
            ) : (
              'Create Ticket'
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TicketForm;
