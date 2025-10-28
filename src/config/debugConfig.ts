// config/debugConfig.ts
/**
 * 🔧 CONFIGURACIÓN DE DEBUG PARA API
 *
 * Para ACTIVAR los logs de API:
 * - Cambia API_LOGGING a true
 *
 * Para DESACTIVAR los logs de API:
 * - Cambia API_LOGGING a false
 *
 * También puedes comentar/descomentar para activar/desactivar rápidamente
 */

export const DEBUG_CONFIG = {
  // � CAMBIA ESTE VALOR PARA ACTIVAR/DESACTIVAR LOGS
  API_LOGGING: true, // true = logs activados | false = logs desactivados

  // Opciones adicionales (solo aplican si API_LOGGING es true)
  SHOW_HEADERS: true, // Mostrar headers HTTP
  SHOW_REQUEST_BODY: true, // Mostrar body de las peticiones
  SHOW_RESPONSE_BODY: true, // Mostrar body de las respuestas
};

/**
 * Logger para peticiones API
 * No necesitas modificar esta clase, solo cambia DEBUG_CONFIG.API_LOGGING arriba
 */
export class APILogger {
  private static get isEnabled() {
    return DEBUG_CONFIG.API_LOGGING;
  }

  static logRequest(method: string, url: string, options?: RequestInit) {
    if (!this.isEnabled) {
      return;
    }

    // Extrae la parte "api/..." si existe
    let endpoint = url;
    const apiIndex = url.indexOf('api/');
    if (apiIndex !== -1) {
      endpoint = url.substring(apiIndex);
    }

    const logData: any = {
      type: '📤 REQUEST',
      method,
      url,
      endpoint,
      timestamp: new Date().toISOString(),
    };

    if (DEBUG_CONFIG.SHOW_HEADERS && options?.headers) {
      logData.headers = options.headers;
    }

    if (DEBUG_CONFIG.SHOW_REQUEST_BODY && options?.body) {
      if (options.body instanceof FormData) {
        // Intentar mostrar el contenido de FormData
        logData.body = '[FormData]';
        try {
          const formDataEntries: any = {};
          // @ts-ignore - FormData puede tener _parts en React Native
          if (options.body._parts) {
            // @ts-ignore
            options.body._parts.forEach(([key, value]: [string, any]) => {
              if (typeof value === 'object' && value.uri) {
                formDataEntries[key] = `[File: ${value.name || value.uri}]`;
              } else {
                formDataEntries[key] = value;
              }
            });
            logData.formDataContent = formDataEntries;
          }
        } catch (e) {
          logData.formDataNote = 'No se pudo inspeccionar FormData';
        }
      } else {
        try {
          logData.body =
            typeof options.body === 'string'
              ? JSON.parse(options.body)
              : options.body;
        } catch {
          logData.body = options.body;
        }
      }
    }

    console.log(`❔ API REQUEST: ${endpoint}`, logData);
  }

  static async logResponse(response: Response, startTime: number) {
    if (!this.isEnabled) {
      return;
    }

    const duration = Date.now() - startTime;
    let endpoint = response.url;
    const apiIndex = response.url.indexOf('api/');
    if (apiIndex !== -1) {
      endpoint = response.url.substring(apiIndex);
    }

    const logData: any = {
      type: response.ok ? '✅ RESPONSE SUCCESS' : '❌ RESPONSE ERROR',
      response,
      endpoint,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };

    if (DEBUG_CONFIG.SHOW_HEADERS) {
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      logData.headers = headers;
    }

    if (DEBUG_CONFIG.SHOW_RESPONSE_BODY) {
      try {
        const clonedResponse = response.clone();
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          logData.body = await clonedResponse.json();
        } else {
          const text = await clonedResponse.text();
          logData.body = text.substring(0, 500);
        }
      } catch (error) {
        logData.body = '[No se pudo leer el body]';
      }
    }

    console.log(`🟢 API RESPONSE: ${endpoint}`, logData);
  }

  static logError(error: any, url: string) {
    if (!this.isEnabled) {
      return;
    }

    let endpoint = url;
    const apiIndex = url.indexOf('api/');
    if (apiIndex !== -1) {
      endpoint = url.substring(apiIndex);
    }

    const logData = {
      type: '❌ ERROR',
      url,
      endpoint,
      error: error.message,
      name: error.name,
      timestamp: new Date().toISOString(),
      stack: error.stack || 'No stack trace',
    };

    console.log(`🔴 API ERROR: ${endpoint}`, logData);
  }
}
