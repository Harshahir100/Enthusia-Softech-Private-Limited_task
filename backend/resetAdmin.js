import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
const Admin = (await import('./src/models/Admin.js')).default;

const email = ADMIN_EMAIL.toLowerCase();
const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

const result = await Admin.findOneAndUpdate(
  { email },
  { email, password: hash, name: 'Administrator' },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

console.log('✅ Admin upserted:', result.email);
console.log('   Password set to ADMIN_PASSWORD from .env');
await mongoose.connection.close();
process.exit(0);