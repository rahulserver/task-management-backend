import { BaseDocument } from './base.interface';

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface IPost extends BaseDocument {
  id: string;
  caption: string;
  imageUrl: string;
  visibility: PostVisibility;
  likes: string[]; // Array of user IDs who liked the post
  comments: IComment[];
  tags?: string[];
}

export interface IComment extends BaseDocument {
  id: string;
  content: string;
  likes: string[]; // Array of user IDs who liked the comment
}

export interface ICreatePostDTO {
  caption: string;
  imageUrl: string;
  visibility?: PostVisibility;
  tags?: string[];
}

export interface IUpdatePostDTO {
  caption?: string;
  imageUrl?: string;
  visibility?: PostVisibility;
  tags?: string[];
}

export interface ICreateCommentDTO {
  content: string;
  postId: string;
}
