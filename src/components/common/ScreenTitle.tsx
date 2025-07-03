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
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 26, // 100% line height
    color: '#fff',
    textAlign: 'center',
    marginBottom: 60,
  },
});
