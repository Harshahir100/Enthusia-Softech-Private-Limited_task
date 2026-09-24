import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/ApiResponse.js';
import * as blogService from '../services/blogService.js';

export const getBlogs = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const { blogs, meta } = await blogService.listBlogs({ page, limit, search });
  return success(res, 200, 'Blogs fetched', blogs, meta);
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogById(req.params.id);
  return success(res, 200, 'Blog fetched', blog);
});

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.createBlog(req.body, req.admin._id);
  return success(res, 201, 'Blog created', blog);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.updateBlog(req.params.id, req.body);
  return success(res, 200, 'Blog updated', blog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  await blogService.deleteBlog(req.params.id);
  return success(res, 200, 'Blog deleted');
});

export const likeBlog = asyncHandler(async (req, res) => {
  const clientId = req.body.clientId || req.headers['x-client-id'];
  const result = await blogService.toggleLike(req.params.id, clientId);
  return success(res, 200, result.liked ? 'Blog liked' : 'Blog unliked', result);
});