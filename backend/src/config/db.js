import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    isConnected = conn.connection.readyState === 1;

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;

    console.error('❌ MongoDB connection failed:', error.message);

    // IMPORTANT:
    // Do NOT use process.exit() on Vercel/serverless.
    throw error;
  }
};