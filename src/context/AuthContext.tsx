import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PhysicalData {
  weight: number;
  weightUnit: string;
  height: number;
  heightUnit: string;
}

interface User {
  id: number;
  username: string;
  role: 'student' | 'coach' | 'admin';
  physicalData?: PhysicalData;
  position?: string;
  studentProfileImage?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export let authInstance: AuthContextType | null = null; // referencia global

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    await AsyncStorage.setItem('authToken', newToken);
    await AsyncStorage.setItem('authUser', JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(['authToken', 'authUser']);
  };

  // Cargar desde almacenamiento al inicio
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('authUser');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadFromStorage();
  }, []);

  // Actualiza la instancia global en cada cambio relevante
  useEffect(() => {
    authInstance = { token, user, login, logout, isLoading };
    return () => {
      authInstance = null; // limpieza opcional
    };
  }, [token, user, isLoading]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
