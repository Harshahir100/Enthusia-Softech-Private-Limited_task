import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureDefaultAdmin } from './utils/ensureAdmin.js';

let initialized = false;

const initialize = async () => {
  if (initialized) return;

  console.log('🚀 Initializing application...');

  await connectDB();

  console.log('✅ Database connection ready');

  await ensureDefaultAdmin();

  console.log('✅ Default admin ensured');

  initialized = true;
};

export default async function handler(req, res) {
  try {
    await initialize();

    return app(req, res);
  } catch (error) {
    console.error('❌ Startup error:', error);

    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
}