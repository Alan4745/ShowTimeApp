import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title?: string;
  style?: any;
}

export default function ContinueButton({
  onPress,
  disabled = false,
  title = 'Continue',
  style,
}: ContinueButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
