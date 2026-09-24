import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureDefaultAdmin } from './utils/ensureAdmin.js';

let initialized = false;
let initPromise = null;

const initialize = async () => {
  if (initialized) return;

  if (!initPromise) {
    initPromise = (async () => {
      console.log('🚀 Initializing application...');

      await connectDB();

      console.log('✅ Database ready');

      await ensureDefaultAdmin();

      console.log('✅ Default admin ensured');

      initialized = true;
    })();
  }

  await initPromise;
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