import mongoose from 'mongoose';
import { config } from './env.js';

let isConnecting = false;
let retryTimer = null;

/**
 * Connect to MongoDB Atlas
 */
export const connectDB = async () => {
  const uri = config.mongoUri;

  if (!uri) {
    console.error('[Database Error] MongoDB connection string (MONGO_URI) is not defined in environment variables.');
    return null;
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    console.log('[Database] Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      dbName: 'support_ticket_manager',
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[Database] MongoDB Atlas Connected successfully: ${conn.connection.host} (DB: support_ticket_manager)`);
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    return conn;
  } catch (error) {
    console.error('[Database Error] Failed to connect to MongoDB Atlas:', error.message);
    if (!retryTimer) {
      // Schedule background retries every 8 seconds so connection establishes automatically when IP is whitelisted
      retryTimer = setInterval(async () => {
        if (mongoose.connection.readyState !== 1 && !isConnecting) {
          try {
            await connectDB();
          } catch (e) {
            // Handled inside connectDB
          }
        }
      }, 8000);
    }
    return null;
  } finally {
    isConnecting = false;
  }
};

/**
 * Check whether database is currently connected
 */
export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Handle unexpected disconnections
mongoose.connection.on('disconnected', () => {
  console.log('[Database] Disconnected from MongoDB Atlas.');
});

export default connectDB;
