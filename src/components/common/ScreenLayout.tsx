import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      {(showBackButton || (currentStep !== undefined && totalSteps !== undefined)) && (
        <View style={styles.header}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
          )}
          {currentStep !== undefined && totalSteps !== undefined && (
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          )}
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    zIndex: 1,
    padding: 8,
  },
});
