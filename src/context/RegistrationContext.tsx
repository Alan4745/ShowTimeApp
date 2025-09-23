import React, {createContext, useContext, useState, ReactNode} from 'react';

// Definimos los valores internos que usaremos como claves para traducción
export type Position =
  | 'goalkeeper'
  | 'defender'
  | 'centerBack'
  | 'fullback'
  | 'midfielder'
  | 'winger'
  | 'forward';

export type Role = 'student' | 'coach'; 

export interface RegistrationData {
  email?: string;
  password?: string;
  role?: Role;
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
  experienceLevel?:
    | 'High School'
    | 'Academy'
    | 'College'
    | 'Semi-Pro'
    | 'Lower division Pro';
  trainingFrequency?:
    | '3-5 sessions per week'
    | '5-7 sessions per week'
    | '+7 sessions per week';
  contentLikes?: string[];
  notificationsEnabled?: boolean;
  appDiscoverySource?:
    | 'TikTok'
    | 'Youtube'
    | 'Instagram (or Facebook)'
    | 'Instagram Advertisement'
    | 'Friends/Family/Coach'
    | 'App Store Search'
    | 'Other';
  selectedPlan?: {
    id: string;
    title: string;
    price: string;
    priceValue: number;
  };
  authMethod?: 'google' | 'apple' | 'email';
  
  // Coach-specific fields
  coachingRole?: string; 
  uploadMedia?: string; // URL o path local de media
  bio?: string; // descripción del coach
  accomplishments?: string[]; // lista de logros
}

interface RegistrationContextType {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  resetData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined,
);

export function RegistrationProvider({children}: {children: ReactNode}) {
  const [data, setData] = useState<RegistrationData>({});

  const updateData = (newData: Partial<RegistrationData>) => {
    setData(prev => ({...prev, ...newData}));
  };

  const resetData = () => {
    setData({});
  };

  return (
    <RegistrationContext.Provider value={{data, updateData, resetData}}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error(
      'useRegistration must be used within a RegistrationProvider',
    );
  }
  return context;
}
