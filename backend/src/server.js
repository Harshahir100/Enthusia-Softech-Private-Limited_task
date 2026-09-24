import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { ensureDefaultAdmin } from './utils/ensureAdmin.js';

let bootstrapped = false;

const bootstrap = async () => {
  if (bootstrapped) return;
  await connectDB();
  await ensureDefaultAdmin();
  bootstrapped = true;
};

// Vercel: export handler, DO NOT call app.listen
export default async (req, res) => {
  try {
    await bootstrap();
    return app(req, res);
  } catch (err) {
    console.error('❌ Bootstrap failed:', err);
    res.status(500).json({ success: false, message: 'Server bootstrap failed' });
  }
};