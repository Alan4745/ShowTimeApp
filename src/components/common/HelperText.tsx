import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface HelperTextProps {
  text: string;
  style?: any;
}

export default function HelperText({ text, style }: HelperTextProps) {
  return (
    <Text style={[styles.helperText, style]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  helperText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
