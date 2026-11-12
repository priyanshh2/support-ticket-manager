import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true
    },
    priority: {
      type: String,
      required: [true, 'Ticket priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be one of: Low, Medium, High'
      }
    },
    status: {
      type: String,
      default: 'Open',
      enum: {
        values: ['Open', 'In Progress', 'Resolved'],
        message: 'Status must be one of: Open, In Progress, Resolved'
      }
    }
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;

