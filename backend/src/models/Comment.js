import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
      index: true,
    },
    author: { type: String, required: true, trim: true, maxlength: 60 },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);