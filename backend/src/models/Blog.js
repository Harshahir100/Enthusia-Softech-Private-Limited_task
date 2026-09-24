import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: 10,
    },
    mediaType: {
      type: String,
      enum: ['image', 'gif', 'video', 'url'],
      required: true,
    },
    mediaUrl: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0, min: 0 },
    likedBy: [{ type: String }],
    commentsCount: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Blog', blogSchema);