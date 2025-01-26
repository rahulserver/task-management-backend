// src/controllers/post.controller.ts
import { Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { BaseController } from './base.controller';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  ICreatePostDTO,
  IUpdatePostDTO,
  ICreateCommentDTO,
} from '../interfaces/post.interface';
import { ApiError } from '../utils/api-error';

export class PostController extends BaseController {
  constructor(private postService: PostService) {
    super();
  }

  public createPost = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const postData: ICreatePostDTO = req.body;
      const post = await this.postService.createPost(userId, postData);
      this.sendSuccess(res, post, 'Post created successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public updatePost = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { postId } = req.params;
      const updateData: IUpdatePostDTO = req.body;
      const post = await this.postService.updatePost(
        userId,
        postId,
        updateData,
      );
      this.sendSuccess(res, post, 'Post updated successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public deletePost = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { postId } = req.params;
      await this.postService.deletePost(userId, postId);
      this.sendSuccess(res, null, 'Post deleted successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public getPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { postId } = req.params;
      const post = await this.postService.getPostById(postId);
      this.sendSuccess(res, post);
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public getFeedPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sortBy, sortOrder } = req.query;
      const posts = await this.postService.getFeedPosts({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });
      this.sendSuccess(res, posts);
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public addComment = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const commentData: ICreateCommentDTO = req.body;
      const post = await this.postService.addComment(userId, commentData);
      this.sendSuccess(res, post, 'Comment added successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public toggleLike = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { postId } = req.params;
      const post = await this.postService.toggleLike(userId, postId);
      this.sendSuccess(res, post, 'Post like toggled successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };
}
