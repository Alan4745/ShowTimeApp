// utils/urlHelpers.ts

import API_BASE_URL from "../config/api"; 

/**
 * Verifica si una URL es absoluta (http/https).
 */
export const isAbsoluteUrl = (url: string | undefined | null): boolean => {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
};

/**
 * Construye una URL absoluta a partir de una ruta relativa en /media/.
 * Si ya es absoluta, la devuelve tal cual.
 */
export const buildMediaUrl = (path: string | undefined | null): string => {
  if (!path) return '';

  if (isAbsoluteUrl(path)) return path;

  // Limpia posibles slashes y prefijos redundantes
  path = path.replace(/^\/?media\/?/, '').replace(/^\/?/, '');

  return `${API_BASE_URL}/media/${path}`;
};

/**
 * Alias general si el backend usa otras rutas además de /media/
 * Puedes personalizar o extender según tu estructura
 */
export const buildFullUrl = buildMediaUrl;
