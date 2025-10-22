import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import PopupAlert from '../components/modals/PopupAlert';

export type GlobalErrorContextType = {
  showError: (key: string) => void; // 🔹 ahora recibe una "key" de traducción
  clearError: () => void;
};

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(undefined);

export const GlobalErrorProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useTranslation(); 
  const showError = (keyOrMessage: string) => {
    // 🔹 Si existe la clave en las traducciones, la traduce. Si no, usa el texto literal.
    const translated = t(keyOrMessage);
    setMessage(translated !== keyOrMessage ? translated : keyOrMessage);
  };

  const clearError = () => setMessage(null);

  return (
    <GlobalErrorContext.Provider value={{ showError, clearError }}>
      {children}

      <PopupAlert
        visible={!!message}
        message={message ?? ''}
        onClose={clearError}
      />
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) throw new Error('useGlobalError must be used inside GlobalErrorProvider');
  return context;
};
