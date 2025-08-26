import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {ChevronDown} from 'lucide-react-native';
import VideoPlayer from '../components/common/VideoPlayer';
import PostAlan from './PostAlan';

export default function HomeTabScreen() {
  const handleVideoPlay = () => {
    console.log('Video play pressed');
  };

  const handleScrollDown = () => {
    console.log('Scroll down pressed');
  };

  return (
    <ScrollView style={styles.container}>
      <PostAlan />
      <PostAlan />

      <PostAlan />
      <PostAlan />
      <PostAlan />
      <PostAlan />
      <PostAlan />
      <PostAlan />
    </ScrollView>
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
