import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  inputStyle?: any;
}

export default function FormInput({
  label,
  error,
  containerStyle,
  inputStyle,
  ...props
}: FormInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor="#666"
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#929292',
    marginLeft: 4,
  },
  input: {
    fontFamily: 'AnonymousPro-Regular',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#FFFFFF',
  },
  error: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
    marginLeft: 4,
  },
});
