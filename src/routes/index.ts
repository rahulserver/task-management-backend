import { Router } from 'express';
import taskRoutes from './task.routes';
import postRoutes from './post.routes';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/posts', postRoutes);

export default router;
