import { Router } from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} from '../controllers/blogController.js';
import { getComments, addComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { validateBody } from '../middleware/validateRequest.js';
import { validateBlogInput, validateCommentInput } from '../utils/validators.js';

const router = Router();

router.route('/').get(getBlogs).post(protect, validateBody(validateBlogInput), createBlog);

router
  .route('/:id')
  .get(validateObjectId('id'), getBlog)
  .put(protect, validateObjectId('id'), validateBody(validateBlogInput), updateBlog)
  .delete(protect, validateObjectId('id'), deleteBlog);

router.post('/:id/like', validateObjectId('id'), likeBlog);

router
  .route('/:id/comments')
  .get(validateObjectId('id'), getComments)
  .post(validateObjectId('id'), validateBody(validateCommentInput), addComment);

export default router;