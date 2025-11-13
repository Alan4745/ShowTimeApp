import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Play } from 'lucide-react-native';

interface VideoPlayerProps {
  thumbnailUrl: string;
  onPlay?: () => void;
  style?: any;
}

export default function VideoPlayer({ thumbnailUrl, onPlay, style }: VideoPlayerProps) {
  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.playButton} onPress={onPlay}>
            <View style={styles.playButtonInner}>
              <Play color="#fff" size={32} fill="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  playButtonInner: {
    marginLeft: 4,
  },
});
