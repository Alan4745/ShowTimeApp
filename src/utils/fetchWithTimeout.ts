// utils/fetchWithTimeout.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/api';
import { authInstance } from '../context/AuthContext';
import { globalErrorInstance } from '../context/GlobalErrorSingleton';

export async function fetchWithTimeout(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = 15000 // 15 segundos por defecto
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const token = await AsyncStorage.getItem('authToken');

    // 🔹 Detectamos si el body es FormData
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        // Importante: solo agregamos Content-Type si NO es FormData
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(id);

    if (response.status === 401) {
      // ⚠️ Solo cerrar sesión si NO estamos en login o register
      const isAuthEndpoint =
      endpoint.includes('/api/auth/login') ||
      endpoint.includes('/api/auth/register');
      
      if (!isAuthEndpoint) {        
        const { logout } = authInstance ?? {};
        if (logout) await logout();
        globalErrorInstance?.showError('errors.sessionExpired');
        throw new Error('Session expired');
      }
    }
    return response;
  } catch (error: any) {
    clearTimeout(id);

    if (error.name === 'AbortError') {
      globalErrorInstance?.showError('errors.connectionTimedOut');
      throw new Error('Request timed out');
    }

    // 🔹 Detectar pérdida de conexión o error de red
    if (error.message?.includes('Network request failed')) {
      globalErrorInstance?.showError('errors.networkError');
      throw new Error('Network error');
    }
    // 🔹 Cualquier otro error no manejado explícitamente
    globalErrorInstance?.showError('errors.unexpectedError');
    throw error;    
  }
}
