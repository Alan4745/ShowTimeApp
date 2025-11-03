import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { RegistrationProvider } from './src/context/RegistrationContext';
import { AuthProvider } from './src/context/AuthContext';
import { GlobalErrorProvider, useGlobalError } from './src/context/GlobalErrorContext';
import { setGlobalErrorInstance } from './src/context/GlobalErrorSingleton';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n/i18n';

// Stripe Publishable Key (Test Mode)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RBea4Lrqy0CY9eDFKTqEY7bzcWKGLb9sHLXEhXfHTTOarHpJNB7XAtY5334POOLrgN6wTUCrAyRObBiIWrKJibE00k2Zw9iUr';

// Este componente conecta el contexto global con la utilidad fetch
const GlobalErrorConnector = () => {
  const ctx = useGlobalError();
  setGlobalErrorInstance(ctx);
  return null;
};

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <SafeAreaProvider>
        <AuthProvider>
          <RegistrationProvider>
            <GlobalErrorProvider>
              {/* Conecta el contexto global de errores al singleton */}
              <GlobalErrorConnector />

              {/* Navegación y resto de la app */}
              <AppNavigator />

              <StatusBar barStyle="light-content" backgroundColor="#000" />
            </GlobalErrorProvider>
          </RegistrationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </StripeProvider>
  );
}
