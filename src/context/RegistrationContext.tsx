import React, { createContext, useContext, useState, ReactNode } from 'react';
import { registrationAPI } from '../services/auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definimos los valores internos que usaremos como claves para traducción
export type Position =
  | 'goalkeeper'
  | 'defender'
  | 'centerBack'
  | 'fullback'
  | 'midfielder'
  | 'winger'
  | 'forward';

export interface RegistrationData {
  email?: string;
  password?: string;
  username?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: {
    month: number;
    day: number;
    year: number;
  };
  citizenship?: string;
  physicalData?: {
    weight: number;
    height: number;
  };
  physicalGoal?: 'Gain muscle' | 'Lose fat' | 'Maintain';
  position?: Position; // ← cambiado aquí
  experienceLevel?: 'High School' | 'Academy' | 'College' | 'Semi-Pro' | 'Lower division Pro';
  trainingFrequency?: '3-5 sessions per week' | '5-7 sessions per week' | '+7 sessions per week';
  contentLikes?: string[];
  notificationsEnabled?: boolean;
  appDiscoverySource?: 'TikTok' | 'Youtube' | 'Instagram (or Facebook)' | 'Instagram Advertisement' | 'Friends/Family/Coach' | 'App Store Search' | 'Other';
  selectedPlan?: {
    id: string;
    title: string;
    price: string;
    priceValue: number;
  };
  authMethod?: 'google' | 'apple' | 'email';
}

export interface LoginData {
  email: string;
  password: string;
}

interface RegistrationContextType {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>, sendData?: boolean) => void;
  resetData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistrationData>({});

  const updateData = async (newData: Partial<RegistrationData>, sendData?: boolean) => {
    setData(prev => ({ ...prev, ...newData }));
    if (sendData) {
      await registerDataApi(newData);
    }
  };

  const registerDataApi = async (newData: Partial<RegistrationData>) => {
    const dataRegistration = {
      ...data,
      ...newData,
      name: data.username,
      weight: data.physicalData?.weight,
      height: data.physicalData?.height,
      birthdate: data.dateOfBirth
        ? new Date(data.dateOfBirth.year, data.dateOfBirth.month - 1, data.dateOfBirth.day)
        : undefined,
    };

    const response = await registrationAPI(dataRegistration);
    if(response){
      await AsyncStorage.setItem('token', response.token);
    }
  };

  const resetData = () => {
    // setData({});
  };

  return (
    <RegistrationContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}
