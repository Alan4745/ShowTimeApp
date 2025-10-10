import React from 'react';
import { View, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from './ProgressBar';

interface ScreenLayoutProps {
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function ScreenLayout(
  {
  children,
  currentStep,
  totalSteps,
  showBackButton = true,
  onBack,
}: ScreenLayoutProps) {

  const router = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {

      (router as any).goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Botón de retroceso fijo en la parte superior */}
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
        )}

        {/* Barra de progreso opcional */}
        {(currentStep !== undefined && totalSteps !== undefined) && (
          <View style={styles.progressWrapper}>
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </View>
        )}

        {/* Contenido principal con paddingTop para dejar espacio al botón */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  progressWrapper: {
    marginTop: Platform.OS === 'ios' ? 5 : 5,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 70 : 70, // Deja espacio al botón
  },
});
