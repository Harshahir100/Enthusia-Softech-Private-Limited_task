import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/ApiResponse.js';
import * as commentService from '../services/commentService.js';

export const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getComments(req.params.id);
  return success(res, 200, 'Comments fetched', comments);
});

export const addComment = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment(req.params.id, req.body);
  return success(res, 201, 'Comment added', comment);
});