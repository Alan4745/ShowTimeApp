import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index < currentStep ? styles.activeStep : styles.inactiveStep,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 55,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
  },
  step: {
    flex: 1,
    height: 12,
    borderRadius: 30,
    maxWidth: 60,
  },
  activeStep: {
    backgroundColor: '#2B80BE',
  },
  inactiveStep: {
    backgroundColor: '#FFFFFF',
  },
});
