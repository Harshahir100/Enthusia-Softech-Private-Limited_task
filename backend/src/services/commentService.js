import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import { ApiError } from '../utils/ApiError.js';

export const getComments = async (blogId) => {
  const blog = await Blog.findById(blogId).select('_id');
  if (!blog) throw new ApiError(404, 'Blog not found');

  return Comment.find({ blog: blogId }).sort({ createdAt: -1 }).lean();
};

export const addComment = async (blogId, { author, text }) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new ApiError(404, 'Blog not found');

  const comment = await Comment.create({ blog: blogId, author, text });
  blog.commentsCount += 1;
  await blog.save();

  return comment;
};