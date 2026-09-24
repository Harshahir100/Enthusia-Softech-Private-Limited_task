import mongoose from 'mongoose';

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateBlogInput = (body) => {
  const errors = [];
  const { title, description, mediaType, mediaUrl } = body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (title.trim().length > 150) {
    errors.push('Title must be at most 150 characters');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  const allowedTypes = ['image', 'gif', 'video', 'url'];
  if (!mediaType || !allowedTypes.includes(mediaType)) {
    errors.push(`mediaType must be one of: ${allowedTypes.join(', ')}`);
  }

  if (!mediaUrl || typeof mediaUrl !== 'string' || mediaUrl.trim().length === 0) {
    errors.push('mediaUrl is required');
  } else {
    try {
      new URL(mediaUrl);
    } catch {
      errors.push('mediaUrl must be a valid URL');
    }
  }

  return errors;
};

export const validateCommentInput = (body) => {
  const errors = [];
  const { author, text } = body;

  if (!author || typeof author !== 'string' || author.trim().length < 2) {
    errors.push('Author name must be at least 2 characters');
  } else if (author.trim().length > 60) {
    errors.push('Author name must be at most 60 characters');
  }

  if (!text || typeof text !== 'string' || text.trim().length < 1) {
    errors.push('Comment text is required');
  } else if (text.trim().length > 500) {
    errors.push('Comment must be at most 500 characters');
  }

  return errors;
};