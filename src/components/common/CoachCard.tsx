import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

interface CoachCardProps {
  name: string;
  description: string;
  imageUrl: string;
  onPress?: () => void;
  style?: any;
}

export default function CoachCard({ name, description, imageUrl, onPress, style }: CoachCardProps) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.coachLabel}>COACH</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    width: 280,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#4A90E2',
  },
  image: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  coachLabel: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    marginBottom: 8,
    letterSpacing: 1,
  },
  name: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
});
