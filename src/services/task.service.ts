import { Task } from '../models/task.model';
import {
  ITask,
  ICreateTaskDTO,
  IUpdateTaskDTO,
  TaskStatus,
  ITaskPositionUpdate,
} from '../interfaces/task.interface';
import { ApiError } from '../utils/api-error';
import { IPaginationParams } from '../interfaces/response.interface';
import mongoose from 'mongoose';

export class TaskService {
  async createTask(userId: string, taskData: ICreateTaskDTO): Promise<ITask> {
    const lastTask = await Task.findOne({
      createdBy: userId,
      status: TaskStatus.PENDING,
    }).sort({ position: -1 });

    const position = lastTask ? lastTask.position + 1000 : 1000;

    const task = new Task({
      ...taskData,
      createdBy: userId,
      position,
      status: TaskStatus.PENDING,
      column: TaskStatus.PENDING,
    });

    return task.save();
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateData: IUpdateTaskDTO,
  ): Promise<ITask> {
    const task = await Task.findOne({ _id: taskId, createdBy: userId });
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    // If status is being updated, sync the column
    if (updateData.status) {
      updateData.column = updateData.status;
    }

    Object.assign(task, updateData);
    return task.save();
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const result = await Task.deleteOne({ _id: taskId, createdBy: userId });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'Task not found');
    }
  }

  async getTaskById(userId: string, taskId: string): Promise<ITask> {
    const task = await Task.findOne({ _id: taskId, createdBy: userId });
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    return task;
  }

  async getTasks(userId: string, params: IPaginationParams): Promise<ITask[]> {
    const {
      page = 1,
      limit = 50,
      sortBy = 'position',
      sortOrder = 'asc',
    } = params;

    return Task.find({ createdBy: userId })
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async updateTaskPositions(
    userId: string,
    updates: ITaskPositionUpdate[],
  ): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const update of updates) {
        const task = await Task.findOne({
          _id: update.taskId,
          createdBy: userId,
        }).session(session);

        if (!task) {
          throw new ApiError(404, `Task ${update.taskId} not found`);
        }

        task.position = update.newPosition;
        task.column = update.column;
        task.status = update.column;
        await task.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
