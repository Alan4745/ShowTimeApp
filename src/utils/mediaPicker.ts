import { launchImageLibrary } from 'react-native-image-picker';
import { pick, types, errorCodes, isErrorWithCode } from '@react-native-documents/picker';
import { Image } from 'react-native';
import { MediaItem } from '../types/media';
import { createThumbnail } from 'react-native-create-thumbnail';

// 🔹 Seleccionar imágenes
export const selectImages = async (): Promise<MediaItem[]> => {
  return new Promise((resolve) => {
    const options = {
      mediaType: 'photo' as const,
      selectionLimit: 0, // 0 = múltiples
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || !response.assets) return resolve([]);

      const images: MediaItem[] = response.assets.map((asset, index) => ({
        id: `${Date.now()}-${index}`,
        mediaType: 'image', // Esto es un literal, no string
        uri: asset.uri!,
        thumbnail: asset.uri!, // Puedes usar la misma imagen como thumbnail
      }));

      resolve(images);
    });
  });
};

// 🔹 Seleccionar video y generar thumbnail
export const selectVideo = async (): Promise<MediaItem[]> => {
  return new Promise((resolve, reject) => {
    const options = {
      mediaType: 'video' as const,
      videoQuality: 'high' as const,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel || !response.assets || response.assets.length === 0)
        return resolve([]);

      const video = response.assets[0];
      try {
        const thumbnail = await createThumbnail({ url: video.uri! });

        const newVideo: MediaItem = {
          id: `${Date.now()}`,
          mediaType: 'video',
          uri: video.uri!,
          thumbnail: thumbnail.path,
        };

        resolve([newVideo]);
      } catch (err) {
        reject(err);
      }
    });
  });
};

// 🔹 Seleccionar PDF
export const selectPDF = async (): Promise<MediaItem[]> => {
  try {
    const [res] = await pick({ type: [types.pdf] });
    if (!res) return [];

    const pdfItem: MediaItem = {
      id: `${Date.now()}`,
      mediaType: 'pdf',
      uri: res.uri,
      thumbnail: Image.resolveAssetSource(require('../../assets/img/Adobe.png')).uri,
    };

    return [pdfItem];
  } catch (err) {
    if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
      return [];
    }
    throw err;
  }
};

