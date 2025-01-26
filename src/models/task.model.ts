import mongoose, { Schema, Document } from 'mongoose';
import { ITask, TaskStatus, TaskPriority } from '../interfaces/task.interface';

export interface TaskDocument extends ITask, Document {
  id: string;
}

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
    column: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
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
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ position: 1 });

export const Task = mongoose.model<TaskDocument>('Task', taskSchema);
