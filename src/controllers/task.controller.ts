import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { BaseController } from './base.controller';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  ICreateTaskDTO,
  IUpdateTaskDTO,
  ITaskPositionUpdate,
} from '../interfaces/task.interface';
import { ApiError } from '../utils/api-error';

export class TaskController extends BaseController {
  constructor(private taskService: TaskService) {
    super();
  }

  public createTask = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const taskData: ICreateTaskDTO = req.body;
      const task = await this.taskService.createTask(userId, taskData);
      this.sendSuccess(res, task, 'Task created successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public updateTask = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { taskId } = req.params;
      const updateData: IUpdateTaskDTO = req.body;
      const task = await this.taskService.updateTask(
        userId,
        taskId,
        updateData,
      );
      this.sendSuccess(res, task, 'Task updated successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public deleteTask = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { taskId } = req.params;
      await this.taskService.deleteTask(userId, taskId);
      this.sendSuccess(res, null, 'Task deleted successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public getTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { taskId } = req.params;
      const task = await this.taskService.getTaskById(userId, taskId);
      this.sendSuccess(res, task);
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { page, limit, sortBy, sortOrder } = req.query;
      const tasks = await this.taskService.getTasks(userId, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });
      this.sendSuccess(res, tasks);
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };

  public updateTaskPositions = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, 'User not authenticated');
      }

      const updates: ITaskPositionUpdate[] = req.body.updates;
      await this.taskService.updateTaskPositions(userId, updates);
      this.sendSuccess(res, null, 'Task positions updated successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        this.sendError(res, error.statusCode, error.message);
      } else {
        this.sendError(res, 500, 'Internal server error');
      }
    }
  };
}
