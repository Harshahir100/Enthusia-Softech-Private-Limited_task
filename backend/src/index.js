import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureDefaultAdmin } from './utils/ensureAdmin.js';

let initialized = false;
let initializationPromise = null;

const initialize = async () => {
  if (initialized) {
    return;
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      console.log('🔄 Connecting to MongoDB...');

      await connectDB();

      console.log('✅ MongoDB connection ready');

      await ensureDefaultAdmin();

      console.log('✅ Default admin ensured');

      initialized = true;
    })();
  }

  await initializationPromise;
};

export default async function handler(req, res) {
  try {
    await initialize();

    return app(req, res);
  } catch (error) {
    console.error('❌ Initialization error:', error);

    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
}