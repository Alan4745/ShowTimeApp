import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ContentContainerProps {
  children: React.ReactNode;
  style?: any;
  centered?: boolean;
}

export default function ContentContainer({
  children,
  style,
  centered = false,
}: ContentContainerProps) {
  return (
    <View style={[
      styles.content,
      centered && styles.centered,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  centered: {
    justifyContent: 'center',
  },
});
