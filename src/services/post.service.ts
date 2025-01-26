import { Post, PostDocument } from '../models/post.model';
import {
  IPost,
  ICreatePostDTO,
  IUpdatePostDTO,
  ICreateCommentDTO,
  PostVisibility,
} from '../interfaces/post.interface';
import { ApiError } from '../utils/api-error';
import { IPaginationParams } from '../interfaces/response.interface';
import { CloudinaryService } from './cloudinary.service';

export class PostService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async createPost(userId: string, postData: ICreatePostDTO): Promise<IPost> {
    // Upload image to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      postData.imageUrl,
      `posts/${userId}/${Date.now()}`,
    );

    const post = new Post({
      ...postData,
      imageUrl: uploadResult.secureUrl,
      createdBy: userId,
      likes: [],
      comments: [],
    });

    return post.save();
  }

  async updatePost(
    userId: string,
    postId: string,
    updateData: IUpdatePostDTO,
  ): Promise<IPost> {
    const post = await Post.findOne({ _id: postId, createdBy: userId });
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    // If new image is provided, upload it and update URL
    if (updateData.imageUrl) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        updateData.imageUrl,
        `posts/${userId}/${Date.now()}`,
      );
      updateData.imageUrl = uploadResult.secureUrl;
    }

    Object.assign(post, updateData);
    return post.save();
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await Post.findOne({ _id: postId, createdBy: userId });
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    // Delete image from Cloudinary
    if (post.imageUrl) {
      await this.cloudinaryService.deleteImage(post.imageUrl);
    }

    await post.deleteOne();
  }

  async getPostById(postId: string): Promise<IPost> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    if (
      post.visibility === PostVisibility.PRIVATE &&
      !this.isPostAccessible(post)
    ) {
      throw new ApiError(403, 'Access denied to this post');
    }

    return post;
  }

  async getFeedPosts(params: IPaginationParams): Promise<IPost[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    return Post.find({ visibility: PostVisibility.PUBLIC })
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async addComment(
    userId: string,
    commentData: ICreateCommentDTO,
  ): Promise<IPost> {
    const post = await Post.findById(commentData.postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    post.comments.push({
      content: commentData.content,
      createdBy: userId,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return post.save();
  }

  async toggleLike(userId: string, postId: string): Promise<IPost> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    return post.save();
  }

  private isPostAccessible(post: PostDocument): boolean {
    // Implement your access control logic here
    return true;
  }
}
