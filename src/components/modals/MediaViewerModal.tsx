import React from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function MediaViewerModal({ visible, media, onClose }) {
  if (!media) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={30} color="#FFF" />
        </TouchableOpacity>

        {media.type === 'image' && (
          <Image
            source={{ uri: media.uri }}
            style={styles.fullscreenMedia}
            resizeMode="contain"
          />
        )}

        {media.type === 'video' && (
          <Video
            source={{ uri: media.uri }}
            style={styles.fullscreenMedia}
            resizeMode="contain"
            controls={true}
            paused={false}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenMedia: {
    width: width,
    height: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
