// utils/generateLocalThumbnail.ts

import { createThumbnail } from 'react-native-create-thumbnail';
type Message = {
    id: string;
    sender: 'user' | 'coach' | `admin`;
    text: string;
    timestamp: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: 'image' | 'video' | 'pdf';
    fileThumbnail?: string;
};

export async function generateLocalThumbnail(message: Message): Promise<Message> {
  if (message.fileThumbnail || !message.fileUrl) {
    return message; // Ya tiene thumbnail o no tiene archivo
  }

  try {
    if (message.fileType === 'image') {
      // Usamos la imagen como thumbnail directamente
      return { ...message, fileThumbnail: message.fileUrl };
    }

    if (message.fileType === 'video') {
      const thumbnail = await createThumbnail({
        url: message.fileUrl,
        timeStamp: 1000,
      });

      return {
        ...message,
        fileThumbnail: thumbnail.path,
      };
    }  

    // Otros tipos (pdf, etc.) no tienen thumbnail
    return message;
  } catch (err) {
    console.warn('Thumbnail generation failed:', err);
    return message;
  }
}
