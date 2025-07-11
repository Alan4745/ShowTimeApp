import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

interface ContentCardProps {
  title?: string;
  imageUrl?: string;
  onPress?: () => void;
  style?: any;
  children?: React.ReactNode;
}

export default function ContentCard({ title, imageUrl, onPress, style, children }: ContentCardProps) {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper style={[styles.card, style]} onPress={onPress}>
      {imageUrl ? (
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            {title && <Text style={styles.title}>{title}</Text>}
            {children}
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          {children}
        </View>
      )}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#2A2A2A',
    minHeight: 200,
  },
  backgroundImage: {
    flex: 1,
    minHeight: 200,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
});
