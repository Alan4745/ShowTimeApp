// types/post.ts

import { MediaItem, MediaType } from './media';

// Estructura cruda que viene del backend
export type RawMediaItem = {
  type: MediaType;
  uri: string;
  thumbnail?: string;
};

// Post del backend
export type RawPost = {
  id: string;
  author_id: number;
  username: string;
  userType: string;
  avatar: string;
  text: string;
  media: RawMediaItem[];
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
  updatedAt: string;
};

// Post usado en la app
export type PostType = {
  id: string;
  userId: number;
  username: string;
  userType: string;
  avatar: string;
  text: string;
  commentsCount: number;
  likesCount: number;
  media: MediaItem[];
  likedByMe: boolean;
};
