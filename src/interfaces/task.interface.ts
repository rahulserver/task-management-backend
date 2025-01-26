import { BaseDocument } from './base.interface';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ITask extends BaseDocument {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  position: number; // For maintaining order within columns
  column: TaskStatus; // Maps to status but explicitly used for UI columns
}

export interface ICreateTaskDTO {
  title: string;
  description: string;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface IUpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  position?: number;
  column?: TaskStatus;
}

export interface ITaskPositionUpdate {
  taskId: string;
  column: TaskStatus;
  newPosition: number;
}
