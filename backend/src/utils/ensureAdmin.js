import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { env } from '../config/env.js';

export const ensureDefaultAdmin = async () => {
  try {
    const email = env.ADMIN_EMAIL.toLowerCase();
    const existing = await Admin.findOne({ email });
    if (existing) return;
    const hash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    await Admin.create({ email, password: hash, name: 'Administrator' });
    console.log(`✅ Default admin ensured: ${email}`);
  } catch (err) {
    console.error('⚠️  Could not ensure default admin:', err.message);
  }
};