import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ScreenTitleProps {
  title: string;
  style?: any;
}

export default function ScreenTitle({ title, style }: ScreenTitleProps) {
  return (
    <Text style={[styles.title, style]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 40,
  },
});
