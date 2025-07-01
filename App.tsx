import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { RegistrationProvider } from './src/context/RegistrationContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <RegistrationProvider>
      <AppNavigator />
      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </RegistrationProvider>
  );
}