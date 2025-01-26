import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  updatePositionsSchema,
} from '../validators/task.validator';

const router = Router();
const taskService = new TaskService();
const taskController = new TaskController(taskService);

// GET /api/tasks
router.get('/', authenticate, taskController.getTasks);

// GET /api/tasks/:taskId
router.get('/:taskId', authenticate, taskController.getTask);

// POST /api/tasks
router.post(
  '/',
  authenticate,
  validateRequest(createTaskSchema),
  taskController.createTask,
);

// PUT /api/tasks/:taskId
router.put(
  '/:taskId',
  authenticate,
  validateRequest(updateTaskSchema),
  taskController.updateTask,
);

// DELETE /api/tasks/:taskId
router.delete('/:taskId', authenticate, taskController.deleteTask);

// PUT /api/tasks/positions
router.put(
  '/positions',
  authenticate,
  validateRequest(updatePositionsSchema),
  taskController.updateTaskPositions,
);

export default router;
