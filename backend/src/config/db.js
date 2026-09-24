import mongoose from 'mongoose';
import { env } from './env.js';

let cached = global.__mongooseCache;
if (!cached) {
  cached = global.__mongooseCache = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,   // fail fast instead of 10s hang
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        bufferCommands: false,             // fail immediately if not connected
      })
      .then((m) => {
        console.log('✅ MongoDB connected');
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};