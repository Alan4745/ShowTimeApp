import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import VideoPlayer from '../components/common/VideoPlayer';

export default function HomeTabScreen() {

  const handleVideoPlay = () => {
    console.log('Video play pressed');
  };

  const handleScrollDown = () => {
    console.log('Scroll down pressed');
  };

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        {/* Main Video Section */}
        <View style={styles.videoSection}>
          <VideoPlayer
            thumbnailUrl="https://upload.wikimedia.org/wikipedia/commons/2/2d/2019-05-18_Fu%C3%9Fball%2C_Frauen%2C_UEFA_Women%27s_Champions_League%2C_Olympique_Lyonnais_-_FC_Barcelona_StP_1192_LR10_by_Stepro%28Cropped%29.jpg"
            onPlay={handleVideoPlay}
            style={styles.mainVideo}
          />

          {/* Scroll Down Indicator */}
          <TouchableOpacity style={styles.scrollIndicator} onPress={handleScrollDown}>
            <View style={styles.scrollButton}>
              <ChevronDown color="#fff" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Trending Videos Section */}
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>Trending Videos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  videoSection: {
    flex: 1,
    position: 'relative',
  },
  mainVideo: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scrollButton: {
    backgroundColor: '#4A90E2',
    width: 430,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingSection: {
    backgroundColor: '#000',
    padding: 20,
    minHeight: 200,
  },
  sectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
});
