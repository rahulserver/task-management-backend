import { PostVisibility } from '../interfaces/post.interface';
import Joi from 'joi';

const postBaseSchema = {
  caption: Joi.string().required().min(1).max(2000).trim().messages({
    'string.empty': 'Caption is required',
    'string.min': 'Caption must have at least {#limit} character',
    'string.max': 'Caption must be less than {#limit} characters',
  }),
  imageUrl: Joi.string().required().uri().messages({
    'string.empty': 'Image URL is required',
    'string.uri': 'Invalid image URL format',
  }),
  visibility: Joi.string()
    .valid(...Object.values(PostVisibility))
    .default(PostVisibility.PUBLIC),
  tags: Joi.array()
    .items(Joi.string().min(1).max(50).trim())
    .max(10)
    .unique()
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags allowed',
      'array.unique': 'Duplicate tags are not allowed',
    }),
};

export const createPostSchema = Joi.object({
  body: Joi.object({
    ...postBaseSchema,
  }).required(),
});

export const updatePostSchema = Joi.object({
  params: Joi.object({
    postId: Joi.string().required().messages({
      'string.empty': 'Post ID is required',
    }),
  }),
  body: Joi.object({
    caption: postBaseSchema.caption.optional(),
    imageUrl: postBaseSchema.imageUrl.optional(),
    visibility: postBaseSchema.visibility.optional(),
    tags: postBaseSchema.tags,
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
});

export const createCommentSchema = Joi.object({
  params: Joi.object({
    postId: Joi.string().required().messages({
      'string.empty': 'Post ID is required',
    }),
  }),
  body: Joi.object({
    content: Joi.string().required().min(1).max(500).trim().messages({
      'string.empty': 'Comment content is required',
      'string.min': 'Comment must have at least {#limit} character',
      'string.max': 'Comment must be less than {#limit} characters',
    }),
  }),
});

export const getPostsQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sortBy: Joi.string()
      .valid('createdAt', 'likes', 'comments')
      .default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
});
