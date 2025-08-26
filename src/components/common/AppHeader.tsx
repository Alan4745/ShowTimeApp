import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Bookmark } from 'lucide-react-native';

interface AppHeaderProps {
  title: string;
  userAvatar?: string;
  onBookmarkPress?: () => void;
}

export default function AppHeader({ title, userAvatar, onBookmarkPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {userAvatar && (
          <Image
            source={{ uri: userAvatar }}
            style={styles.avatar}
          />
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.bookmarkButton}
        onPress={onBookmarkPress}
      >
        <Bookmark color="#fff" size={24} fill="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: '#000',
    marginTop: 20,
  },
  leftSection: {
    width: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
