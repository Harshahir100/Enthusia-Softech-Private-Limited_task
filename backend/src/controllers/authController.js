import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/ApiResponse.js';
import * as authService from '../services/authService.js';

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginAdmin(req.body);
  return success(res, 200, 'Login successful', result);
});

export const me = asyncHandler(async (req, res) => {
  return success(res, 200, 'Admin profile', {
    id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
  });
});