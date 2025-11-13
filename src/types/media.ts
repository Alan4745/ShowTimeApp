export type MediaType = 'image' | 'video' | 'audio' | 'pdf';

// Este es el tipo que usas dentro del frontend
export type MediaItem = {
  id: string;
  mediaType: MediaType;
  uri: string;
  thumbnail: string;
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  format?: string;
  likes?: number;
  comments?: number;
};
