import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('MONGODB_URI exists:', Boolean(env.MONGODB_URI));

    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log(
      `✅ MongoDB connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};