import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';

const seed = async () => {
  try {
    await connectDB();

    const email = env.ADMIN_EMAIL.toLowerCase();
    const existing = await Admin.findOne({ email });

    if (existing) {
      console.log(`ℹ️  Admin already exists: ${email}`);
    } else {
      const hash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      await Admin.create({ email, password: hash, name: 'Administrator' });
      console.log(`✅ Default admin created: ${email}`);
    }
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();