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
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
