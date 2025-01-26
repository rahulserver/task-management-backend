import mongoose, { Schema, Document } from 'mongoose';
import { IPost, PostVisibility, IComment } from '../interfaces/post.interface';

export interface PostDocument extends IPost, Document {
  id: string;
}

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const postSchema = new Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: Object.values(PostVisibility),
      default: PostVisibility.PUBLIC,
    },
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Indexes for better query performance
postSchema.index({ createdBy: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ visibility: 1, createdAt: -1 });

// Virtual for comment count
postSchema.virtual('commentCount').get(function (this: PostDocument) {
  return this.comments?.length || 0;
});

// Virtual for like count
postSchema.virtual('likeCount').get(function (this: PostDocument) {
  return this.likes?.length || 0;
});

export const Post = mongoose.model<PostDocument>('Post', postSchema);
