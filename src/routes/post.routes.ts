import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
} from '../validators/post.validator';

const router = Router();
const cloudinaryService = new CloudinaryService();
const postService = new PostService(cloudinaryService);
const postController = new PostController(postService);

// GET /api/posts/feed
router.get('/feed', postController.getFeedPosts);

// GET /api/posts/:postId
router.get('/:postId', postController.getPost);

// POST /api/posts
router.post(
  '/',
  authenticate,
  validateRequest(createPostSchema),
  postController.createPost,
);

// PUT /api/posts/:postId
router.put(
  '/:postId',
  authenticate,
  validateRequest(updatePostSchema),
  postController.updatePost,
);

// DELETE /api/posts/:postId
router.delete('/:postId', authenticate, postController.deletePost);

// POST /api/posts/:postId/comments
router.post(
  '/:postId/comments',
  authenticate,
  validateRequest(createCommentSchema),
  postController.addComment,
);

// POST /api/posts/:postId/likes
router.post('/:postId/likes', authenticate, postController.toggleLike);

export default router;
