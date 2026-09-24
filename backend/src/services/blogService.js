import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import { ApiError } from '../utils/ApiError.js';

export const listBlogs = async ({ page = 1, limit = 9, search = '' }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
  const skip = (pageNum - 1) * limitNum;

  const filter = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

export const getBlogById = async (id, { countView = true } = {}) => {
  const update = countView ? { $inc: { views: 1 } } : {};
  const blog = await Blog.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!blog) throw new ApiError(404, 'Blog not found');
  return blog;
};

export const createBlog = async (payload, adminId) => {
  const blog = await Blog.create({ ...payload, author: adminId });
  return blog;
};

export const updateBlog = async (id, payload) => {
  const blog = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!blog) throw new ApiError(404, 'Blog not found');
  return blog;
};

export const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new ApiError(404, 'Blog not found');
  await Comment.deleteMany({ blog: id });
  return blog;
};

export const toggleLike = async (id, clientId) => {
  if (!clientId) throw new ApiError(400, 'clientId is required');

  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  const hasLiked = blog.likedBy.includes(clientId);

  if (hasLiked) {
    blog.likedBy = blog.likedBy.filter((c) => c !== clientId);
    blog.likes = Math.max(0, blog.likes - 1);
  } else {
    blog.likedBy.push(clientId);
    blog.likes += 1;
  }

  await blog.save();
  return { likes: blog.likes, liked: !hasLiked };
};

export const getStats = async () => {
  const [totalBlogs, totalComments] = await Promise.all([
    Blog.countDocuments(),
    Comment.countDocuments(),
  ]);
  const likeAgg = await Blog.aggregate([
    { $group: { _id: null, totalLikes: { $sum: '$likes' } } },
  ]);
  const totalLikes = likeAgg[0]?.totalLikes || 0;

  const byMediaType = await Blog.aggregate([
    { $group: { _id: '$mediaType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const recent = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title createdAt likes mediaType')
    .lean();

  return { totalBlogs, totalComments, totalLikes, byMediaType, recent };
};