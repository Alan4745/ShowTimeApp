import { GlobalErrorContextType } from './GlobalErrorContext';

export let globalErrorInstance: GlobalErrorContextType | null = null;

export const setGlobalErrorInstance = (instance: GlobalErrorContextType) => {
  globalErrorInstance = instance;
};
