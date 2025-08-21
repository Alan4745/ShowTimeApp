import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title?: string;
  style?: any;
}

export default function ContinueButton({
  onPress,
  disabled = false,
  title,
  style,
}: ContinueButtonProps) {
  const { t } = useTranslation();
  const buttonTitle = title || t('common.continue');

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledButton]}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#2B80BE',
    color:"#FFFFFF"
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
    color: '#2B80BE',  }

});
