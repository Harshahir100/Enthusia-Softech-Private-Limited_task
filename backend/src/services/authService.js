import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';          // ⬅️ THIS LINE
import { ApiError } from '../utils/ApiError.js';

const signToken = (id) =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

export const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin) throw new ApiError(401, 'Invalid credentials');

  const match = await admin.comparePassword(password);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  const token = signToken(admin._id);
  return {
    token,
    admin: { id: admin._id, email: admin.email, name: admin.name },
  };
};