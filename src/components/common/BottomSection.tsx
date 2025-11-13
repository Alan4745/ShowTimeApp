import React from 'react';
import { View, StyleSheet } from 'react-native';

interface BottomSectionProps {
  children: React.ReactNode;
  style?: any;
}

export default function BottomSection({ children, style }: BottomSectionProps) {
  return (
    <View style={[styles.bottomSection, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
});
