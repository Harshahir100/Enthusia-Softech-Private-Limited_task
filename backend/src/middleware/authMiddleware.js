import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import Admin from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) throw new ApiError(401, 'Not authorized, no token');

  const decoded = jwt.verify(token, env.JWT_SECRET);
  const admin = await Admin.findById(decoded.id);
  if (!admin) throw new ApiError(401, 'Admin no longer exists');

  req.admin = admin;
  next();
});

export const adminOnly = (req, res, next) => {
  if (!req.admin) throw new ApiError(403, 'Admin access required');
  next();
};