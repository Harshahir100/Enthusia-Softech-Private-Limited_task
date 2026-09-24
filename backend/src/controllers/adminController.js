import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/ApiResponse.js';
import * as blogService from '../services/blogService.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await blogService.getStats();
  return success(res, 200, 'Stats fetched', stats);
});