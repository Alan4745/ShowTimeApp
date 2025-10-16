import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RegistrationProvider } from './src/context/RegistrationContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n/i18n';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RegistrationProvider>
          <AppNavigator />
          <StatusBar barStyle="light-content" backgroundColor="#000" />
        </RegistrationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
