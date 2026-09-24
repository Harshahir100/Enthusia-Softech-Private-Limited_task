import mongoose from 'mongoose';
import { env } from './env.js';

let cachedConnection = null;

export const connectDB = async () => {
  if (
    cachedConnection &&
    mongoose.connection.readyState === 1
  ) {
    return cachedConnection;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');

    cachedConnection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log(
      `✅ MongoDB connected: ${cachedConnection.connection.host}`
    );

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;

    console.error(
      '❌ MongoDB connection failed:',
      error.message
    );

    throw error;
  }
};