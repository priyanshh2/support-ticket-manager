import { isDBConnected } from '../config/db.js';

/**
 * Middleware ensuring database connection is established before processing requests
 */
export const requireDBConnection = (req, res, next) => {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is not established. Please check MongoDB Atlas connection and IP whitelist.'
    });
  }
  next();
};

