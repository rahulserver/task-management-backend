import Joi from 'joi';
import { TaskStatus, TaskPriority } from '../interfaces/task.interface';

// Base task validation schema
const taskBaseSchema = {
  title: Joi.string().required().min(1).max(100).trim().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must have at least {#limit} character',
    'string.max': 'Title must be less than {#limit} characters',
  }),
  description: Joi.string().required().min(1).max(1000).trim().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must have at least {#limit} character',
    'string.max': 'Description must be less than {#limit} characters',
  }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .optional(),
  dueDate: Joi.date().iso().optional().greater('now').messages({
    'date.greater': 'Due date must be in the future',
  }),
};

export const createTaskSchema = Joi.object({
  body: Joi.object({
    ...taskBaseSchema,
  }).required(),
});

export const updateTaskSchema = Joi.object({
  params: Joi.object({
    taskId: Joi.string().required().messages({
      'string.empty': 'Task ID is required',
    }),
  }),
  body: Joi.object({
    title: taskBaseSchema.title.optional(),
    description: taskBaseSchema.description.optional(),
    priority: taskBaseSchema.priority,
    dueDate: taskBaseSchema.dueDate,
    status: Joi.string()
      .valid(...Object.values(TaskStatus))
      .optional(),
    column: Joi.string()
      .valid(...Object.values(TaskStatus))
      .optional(),
    position: Joi.number().min(0).optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
});

export const updatePositionsSchema = Joi.object({
  body: Joi.object({
    updates: Joi.array()
      .items(
        Joi.object({
          taskId: Joi.string().required(),
          column: Joi.string()
            .valid(...Object.values(TaskStatus))
            .required(),
          newPosition: Joi.number().min(0).required(),
        }),
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one task position update is required',
      }),
  }),
});

export const getTasksQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string()
      .valid('createdAt', 'title', 'priority', 'dueDate', 'position')
      .default('position'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  }),
});
